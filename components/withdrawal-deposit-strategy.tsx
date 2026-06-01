"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { ref, onValue, update } from "firebase/database"
import { database } from "@/lib/firebase"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { TabbedTables } from "@/components/tabbed-tables"
import { Modal } from "@/components/modal-component"

interface VaultDetails {
  id: string;
  name: string;
  apr: number;
  tvl: number;
  balance: number;
  points: number;
  leader: string;
  rewards: number;         // Assume available
  rewardsAvailable: number;// Assume available
  strategy: string;        // Assume available
  risk: string;            // Assume available
  ltv: number;             // Assume available
  minCollateral: number;   // Assume available
  liquidationPenalty: number;// Assume available
  borrowRate: number;      // Assume available
  snapshot?: number[];     // Legacy: single snapshot array
  aprSnapshot?: number[];  // NEW: APR data over time
  tvlSnapshot?: number[];  // NEW: TVL data over time
  // Add more fields as needed
}

// Helper for formatting
function fmt(val: number, decimals = 2) {
  return val !== undefined && val !== null
    ? val.toLocaleString(undefined, {minimumFractionDigits: decimals, maximumFractionDigits: decimals})
    : "-"
}

export function WithdrawalDepositStrategy({ vaultId }: { vaultId: string }) {
  const { user } = useAuth()
  const [vault, setVault] = useState<VaultDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [amount, setAmount] = useState("");  
  const [receiptOpen, setReceiptOpen] = useState(false); 
  const [txnDetails, setTxnDetails] = useState<{
    type: "deposit" | "withdraw",
    amount: number,
    balance: number,
    depositTerm?: "6M" | "1Y",             // NEW optional
    estimatedReward?: number,               // NEW optional
    strategy?: string                       // NEW: selected strategy
  } | null>(null);


  const [depositTerm, setDepositTerm] = useState<"6M" | "1Y">("6M")  // NEW: selected deposit term

  // NEW: Timeframe selection for charts
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1W" | "1M" | "3M" | "6M" | "1Y">("1M")

  const depositRates = {
    "6M": 0.035, // 3.5% p.a. for 6 months, you can adjust
    "1Y": 0.05,  // 5.0% p.a. for 1 year
  }

  const depositTermDisplay = {
    "6M": "6 Months",
    "1Y": "1 Year",
  }

  function calcTermEnd(term: "6M" | "1Y") {
    const now = new Date()
    if (term === "6M") now.setMonth(now.getMonth() + 6)
    else if (term === "1Y") now.setFullYear(now.getFullYear() + 1)
    return now.toLocaleDateString("en-GB", {year: "numeric", month: "short", day: "2-digit"})
  }

  function calcEstimatedReward(amountStr: string, term: "6M" | "1Y") {
    const rate = depositRates[term]
    const amt = parseFloat(amountStr || "0")
    if (isNaN(amt) || amt <= 0) return 0
    const periodYears = term === "6M" ? 0.5 : 1
    return amt * rate * periodYears
  }

  useEffect(() => {
    if (!vaultId) {
      console.error("vaultId is required");
      return;
    }
    const vaultRef = ref(database, `allVaults/${vaultId}`);
    setLoading(true);
    const unsub = onValue(vaultRef, (snapshot) => {
      const data = snapshot.val();
      setVault(data || null);
      setLoading(false);
      console.log(`Loaded vault data for ${vaultId}:`, data);
    });
    return () => unsub();
  }, [vaultId]);
  
  // NEW: Dynamic strategy support
  const [selectedStrategy, setSelectedStrategy] = useState<string>("xsgd");
  const [strategyBalances, setStrategyBalances] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (!user) {
      setStrategyBalances({});
      return;
    }
    
    // Fetch XSGD balance (legacy support)
    const xsgdRef = ref(database, `users/${user.uid}/portfolio/xsgd`);
    const unsubXsgd = onValue(xsgdRef, (snapshot) => {
      const balance = snapshot.val();
      setStrategyBalances(prev => ({ ...prev, xsgd: typeof balance === "number" ? balance : 0 }));
    });
    
    // NEW: Fetch all strategy balances
    const portfolioRef = ref(database, `users/${user.uid}/portfolio`);
    const unsubPortfolio = onValue(portfolioRef, (snapshot) => {
      const portfolio = snapshot.val();
      if (portfolio) {
        const balances: Record<string, number> = {};
        Object.entries(portfolio).forEach(([strategy, balance]) => {
          if (typeof balance === "number") {
            balances[strategy] = balance;
          }
        });
        setStrategyBalances(balances);
      }
    });
    
    return () => {
      unsubXsgd();
      unsubPortfolio();
    };
  }, [user]);

  // Confirm Deposit Logic
  const onConfirmDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      console.log("depositAmount can't be zero or negative", depositAmount)
      return;
    }
    if (!user) return;

    const currentBalance = strategyBalances[selectedStrategy] || 0;
    if (depositAmount > currentBalance) {
      console.log("depositAmount can't be greater than user's strategy balance", depositAmount, currentBalance)
      return;
    }

    try {
      const newBalance = currentBalance - depositAmount;
      await update(ref(database, `users/${user.uid}/portfolio`), {
        [selectedStrategy]: newBalance,
      });
      
      setTxnDetails({ 
        type: "deposit", 
        amount: depositAmount, 
        balance: newBalance,
        depositTerm: depositTerm,              // NEW: save selected term
        estimatedReward: calcEstimatedReward(amount, depositTerm), // NEW: save reward
        strategy: selectedStrategy,            // NEW: save selected strategy
      });
      setDepositOpen(false);
      setReceiptOpen(true);
      setAmount(""); 
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const onConfirmWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      console.log("withdrawAmount can't be zero or negative", withdrawAmount)
      return;
    }
    if (!user) return;
    
    const currentBalance = strategyBalances[selectedStrategy] || 0;
    if (withdrawAmount > currentBalance) {
      console.log("withdrawAmount can't be greater than user's strategy balance", withdrawAmount, currentBalance)
      return;
    }
    
    try {
      const newBalance = currentBalance + withdrawAmount;
      await update(ref(database, `users/${user.uid}/portfolio`), {
        [selectedStrategy]: newBalance,
      });
      setTxnDetails({ 
        type: "withdraw", 
        amount: withdrawAmount, 
        balance: newBalance,
        strategy: selectedStrategy,            // NEW: save selected strategy
      });
      setWithdrawOpen(false);
      setReceiptOpen(true);
      setAmount(""); 
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  // UI skeleton while loading
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 rounded-2xl shadow-lg border border-slate-700 flex flex-col gap-6 animate-pulse text-white">
        {/* Loading message */}
        <div className="text-center text-lg font-semibold select-none">
          Loading...
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-2/3 bg-slate-800 rounded"></div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-7 bg-slate-800 rounded w-full"></div>
            <div className="h-7 bg-slate-800 rounded w-full"></div>
          </div>
          <div className="h-10 bg-slate-800 rounded w-full my-2"></div>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="h-6 bg-slate-800 rounded w-full"></div>
            <div className="h-6 bg-slate-800 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  const showValues = !!user
  const getOrDash = (v: number | undefined, decimals = 2) => 
    (v !== undefined && v !== null) ? fmt(v, decimals) : "-"
  
  // NEW: Enhanced date generation with timeframe support
  const generateDateLabels = (dataLength: number, timeframe: "1W" | "1M" | "3M" | "6M" | "1Y") => {
    const dates = [];
    const today = new Date();
    
    // Calculate interval based on timeframe
    let interval = 1; // days
    let totalDays = 7; // default to 1 week
    
    switch (timeframe) {
      case "1W":
        totalDays = 7;
        interval = 1;
        break;
      case "1M":
        totalDays = 30;
        interval = 2;
        break;
      case "3M":
        totalDays = 90;
        interval = 3;
        break;
      case "6M":
        totalDays = 180;
        interval = 7;
        break;
      case "1Y":
        totalDays = 365;
        interval = 14;
        break;
    }
    
    const dataPoints = Math.min(dataLength, Math.ceil(totalDays / interval));
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (dataPoints - 1 - i) * interval);
      dates.push(date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }));
    }
    
    return dates;
  };

  // NEW: Generate chart data for APR
  const generateAprChartData = () => {
    const data = vault?.aprSnapshot || vault?.snapshot || [];
    if (!data.length) return [];
    
    const dateLabels = generateDateLabels(data.length, selectedTimeframe);
    return data.slice(-dateLabels.length).map((value, index) => ({
      name: dateLabels[index] || `Day ${index + 1}`,
      apr: value,
    }));
  };

  // NEW: Generate chart data for TVL
  const generateTvlChartData = () => {
    const data = vault?.tvlSnapshot || vault?.snapshot || [];
    if (!data.length) return [];
    
    const dateLabels = generateDateLabels(data.length, selectedTimeframe);
    return data.slice(-dateLabels.length).map((value, index) => ({
      name: dateLabels[index] || `Day ${index + 1}`,
      tvl: value,
    }));
  };

  // Legacy: Keep for backward compatibility
  const chartData = vault?.snapshot
    ? vault.snapshot.map((value, index) => {
        const dateLabels = generateDateLabels(vault.snapshot!.length, selectedTimeframe);
        return {
          name: dateLabels[index] || `Day ${index + 1}`,
          value,
        };
      })
    : [];

  // NEW: Get current chart data based on available snapshots
  const aprChartData = generateAprChartData();
  const tvlChartData = generateTvlChartData();
  const hasAprData = aprChartData.length > 0;
  const hasTvlData = tvlChartData.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fixed Header always on top */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">NIDUS</h1>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                v1.0
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-300 hover:text-purple-300 transition-colors">
                Dashboard
              </Link>
              <Link href="/vaults" className="text-white hover:text-purple-300 transition-colors">
                Vaults
              </Link>
              <Link href="/points" className="text-slate-300 hover:text-purple-300 transition-colors">
                Points
              </Link>
              {!user && (
                <Link href="/about-nidus" className="text-slate-300 hover:text-purple-300 transition-colors">
                  Mission
                </Link>
              )}
              <Link href="/account" className="text-slate-300 hover:text-purple-300 transition-colors">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {!user && (
        <div className="max-w-5xl mx-auto mt-5 px-4 py-3 bg-yellow-500 bg-opacity-80 text-yellow-900 font-semibold rounded-md text-center text-sm">
          Your personal deposit data is hidden. Please{" "}
          <Link href="/account" className="underline font-bold text-yellow-900 hover:text-yellow-700">
            log in
          </Link>{" "}
          to see your deposits.
        </div>
      )}


      {/* Wider responsive card with two columns */}
      <div className="w-full max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 rounded-2xl shadow-lg border border-slate-700 flex flex-col">

          {/* Performance Snapshot + Overlay */}
          <div className="mb-6 flex flex-col items-center justify-center">
            {/* NEW: Timeframe Selection Dropdown */}
            <div className="w-full mb-4 flex justify-center">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as "1W" | "1M" | "3M" | "6M" | "1Y")}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1W">Last Week</option>
                <option value="1M">Last Month</option>
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
              </select>
            </div>

            {/* NEW: Dual Graph Layout */}
            <div className="w-full space-y-6">
              {/* APR Chart */}
              {hasAprData && (
                <div className="w-full h-48">
                  <h3 className="text-white text-lg mb-2 font-semibold text-center">
                    APR Performance
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={aprChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                      <YAxis tick={{ fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip chartType="apr" />} />
                      <Line type="monotone" dataKey="apr" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* TVL Chart */}
              {hasTvlData && (
                <div className="w-full h-48">
                  <h3 className="text-white text-lg mb-2 font-semibold text-center">
                    TVL Performance
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={tvlChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                      <YAxis tick={{ fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip chartType="tvl" />} />
                      <Line type="monotone" dataKey="tvl" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Fallback: Legacy single chart if no dual data available */}
              {!hasAprData && !hasTvlData && vault?.snapshot && vault.snapshot.length > 0 && (
                <div className="w-full h-48">
                  <h3 className="text-white text-lg mb-2 font-semibold text-center">
                    {vault?.name ?? "Performance"} - Legacy View
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                      <YAxis tick={{ fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip chartType="value" />} />
                      <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">

          {/* Right column: Vault details and controls */}
       {/* Title and subtitle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mt-1">
              Strategy: <span className="font-semibold text-purple-300">{vault?.strategy || "-"}</span>
            </div>
          </div>
          {showValues && (
            <div className="flex flex-col items-end text-right text-slate-400 text-xs">
              Leader: <span className="font-mono text-sm text-slate-200">{vault?.leader ?? "-"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Your Deposit</div>
          <div className="font-semibold text-lg text-white">
            {user && vault?.balance != null ? fmt(vault.balance) : "-"} {user && "USD"}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Rewards</div>
          <div className="font-semibold text-lg text-white">
            {getOrDash(vault?.rewardsAvailable, 2)} {showValues && "USD"}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-0.5">APR</div>
          <div className="font-semibold text-lg text-green-400">
            {getOrDash(vault?.apr, 2)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-0.5">TVL</div>
          <div className="font-semibold text-lg text-white">
            {getOrDash(vault?.tvl, 2)} {showValues && "USD"}
          </div>
        </div>
      </div>

<div className="flex items-center justify-center gap-5 mt-6">
  {!user ? (
    <Link
      href="/account"
      className="block text-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg px-8 py-3 font-bold transition text-lg"
    >
      Connect Wallet
    </Link>
  ) : (
    <>
      <button
        className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg px-8 py-3 font-bold transition text-lg"
        onClick={() => setDepositOpen(true)}
      >
        Deposit
      </button>
      <button
        className="bg-gradient-to-br from-slate-800 to-slate-700 hover:from-purple-700 hover:to-slate-900 text-white rounded-lg px-8 py-3 font-bold transition text-lg border border-purple-400"
        onClick={() => setWithdrawOpen(true)}
      >
        Withdraw
      </button>
    </>
  )}
</div>

      {/* ===== END existing vault details and controls ===== */}

    </div>

  </div> 
  <div>
    <TabbedTables vaultId={vaultId} user={user} />
  </div>
      {/* Deposit Modal */}
      <Modal open={depositOpen} onClose={() => {setDepositOpen(false); setAmount("")}}>
        <h3 className="text-lg font-bold mb-2 text-white">Deposit</h3>
        <div className="mb-3 text-slate-200">
          Deposit to <span className="font-mono">{vault?.name}</span>
        </div>
        
        {/* NEW: Strategy Selection */}
        <div className="mb-3">
          <label className="block text-sm text-slate-300 mb-2">Select Strategy:</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="w-full px-3 py-2 rounded border bg-slate-800 text-white border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {Object.keys(strategyBalances).map(strategy => (
              <option key={strategy} value={strategy}>
                {strategy.toUpperCase()} - Balance: {fmt(strategyBalances[strategy] || 0)}
              </option>
            ))}
          </select>
        </div>
        
        {/* === NEW: Term selection buttons === */}
        <div className="mb-3 flex gap-3">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-bold text-white ${depositTerm === "6M" ? "bg-purple-600" : "bg-slate-700"}`}
            onClick={() => setDepositTerm("6M")}
          >
            6 Months
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-bold text-white ${depositTerm === "1Y" ? "bg-purple-600" : "bg-slate-700"}`}
            onClick={() => setDepositTerm("1Y")}
          >
            1 Year
          </button>
        </div>

        {/* === NEW: Reward info display === */}
        <div className="mb-4 p-3 rounded bg-slate-800 text-slate-200 text-sm space-y-1">
          <div><strong>Reward Rate</strong>: {(depositRates[depositTerm] * 100).toFixed(2)}% p.a.</div>
          <div><strong>Term Ends</strong>: {calcTermEnd(depositTerm)}</div>
          <div><strong>Reward Token</strong>: {selectedStrategy.toUpperCase()}</div>
          <div><strong>Est. Reward</strong>: {fmt(calcEstimatedReward(amount, depositTerm))} {selectedStrategy.toUpperCase()}</div>
        </div>

        <input
          type="number"
          min={0}
          step="any"
          placeholder="Amount"
          className="w-full mb-3 px-3 py-2 rounded border bg-slate-800 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            onClick={() => { setDepositOpen(false); setAmount(""); }}
          >
            Cancel
          </button>
          <button
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            onClick={onConfirmDeposit}
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal open={withdrawOpen} onClose={() => {setWithdrawOpen(false); setAmount("")}}>
        <h3 className="text-lg font-bold mb-2 text-white">Withdraw</h3>
        <div className="mb-3 text-slate-200">
          Withdraw from <span className="font-mono">{vault?.name}</span>
        </div>
        
        {/* NEW: Strategy Selection */}
        <div className="mb-3">
          <label className="block text-sm text-slate-300 mb-2">Select Strategy:</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="w-full px-3 py-2 rounded border bg-slate-800 text-white border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {Object.keys(strategyBalances).map(strategy => (
              <option key={strategy} value={strategy}>
                {strategy.toUpperCase()} - Balance: {fmt(strategyBalances[strategy] || 0)}
              </option>
            ))}
          </select>
        </div>
        
        <input
          type="number"
          min={0}
          step="any"
          placeholder="Amount"
          className="w-full mb-3 px-3 py-2 rounded border bg-slate-800 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            onClick={() => { setWithdrawOpen(false); setAmount(""); }}
          >
            Cancel
          </button>
          <button
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            onClick={onConfirmWithdraw}
            disabled={!strategyBalances[selectedStrategy] || parseFloat(amount) <= 0 || parseFloat(amount) > strategyBalances[selectedStrategy]}
            title={(!strategyBalances[selectedStrategy] || parseFloat(amount) > strategyBalances[selectedStrategy]) ? "Insufficient balance" : ""}
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Transaction Receipt Modal */}
      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)}>
        {txnDetails && (
          <div className="text-white space-y-3">
            <h3 className="text-lg font-bold">
              Transaction Receipt
            </h3>
            <div>
              <strong>Type: </strong>
              {txnDetails.type === "deposit" ? "Deposit" : "Withdraw"}
            </div>
            <div>
              <strong>Strategy: </strong>
              {txnDetails.strategy?.toUpperCase() || "XSGD"}
            </div>
            <div>
              <strong>Amount: </strong>
              {fmt(txnDetails.amount)} {txnDetails.strategy?.toUpperCase() || "XSGD"}
            </div>

            {/* NEW: show term and estimated reward for deposit */}
            {txnDetails.type === "deposit" && txnDetails.depositTerm && (
              <>
                <div>
                  <strong>Term: </strong>
                  {depositTermDisplay[txnDetails.depositTerm]}
                </div>
                <div>
                  <strong>Estimated Reward: </strong>
                  {fmt(txnDetails.estimatedReward || 0)} {txnDetails.strategy?.toUpperCase() || "XSGD"}
                </div>
              </>
            )}

            <div>
              <strong>New Balance: </strong>
              {fmt(txnDetails.balance)} {txnDetails.strategy?.toUpperCase() || "XSGD"}
            </div>
            <button
              className="mt-4 bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
              onClick={() => setReceiptOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      </div>
      <Footer />
    </div>
  )
}

// Custom tooltip component for APR/TVL display
const CustomTooltip = ({ active, payload, label, chartType }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  chartType?: "apr" | "tvl" | "value";
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    let formattedValue = "";
    let labelText = "";
    
    switch (chartType) {
      case 'apr':
        formattedValue = `${value.toFixed(2)}%`;
        labelText = "APR";
        break;
      case 'tvl':
        formattedValue = `$${value.toLocaleString()}`;
        labelText = "TVL";
        break;
      case 'value':
      default:
        formattedValue = `${value.toFixed(2)}`;
        labelText = "Value";
        break;
    }
    
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-slate-300 text-sm">{label}</p>
        <p className="text-white font-semibold">
          {labelText}: {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};
