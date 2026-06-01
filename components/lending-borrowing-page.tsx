"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { ref, onValue, off, set, update, push } from "firebase/database"
import { database } from '@/lib/firebase'
import { Overlay } from "@/components/overlay"
import { Footer } from "@/components/footer"

interface MarketData {
  asset: string
  symbol: string
  supplyAPY: number
  variableSupplyAPY: number 
  borrowAPY: number
  totalSupply: number
  totalBorrow: number
  liquidity: number
  collateralFactor: number
  icon: string
}

export function LendingBorrowingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [xsgdMarket, setXsgdMarket] = useState<MarketData | null>(null)
  const [portfolio, setPortfolio] = useState<{ xsgd: number; lp: number }>({ xsgd: 0, lp: 0 })
  const [withdrawalFee, setWithdrawalFee] = useState<number>(0.5) 
  const [tvl, setTvl] = useState<number>(0)
  const [variableSupplyAPY, setVariableSupplyAPY] = useState<number>(0)
  const [borrowAPY, setBorrowAPY] = useState<number>(0)
  const [depositAmount, setDepositAmount] = useState("")
  const [lendAmount, setLendAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")

  // Fetch XSGD market data from Firebase
  useEffect(() => {
    const marketRef = ref(database, "markets/XSGD")
    const unsubMarket = onValue(marketRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setXsgdMarket({
          asset: "XSGD",
          symbol: "XSGD",
          supplyAPY: data.supplyAPY || 0,
          variableSupplyAPY: data.variableSupplyAPY || 0,
          borrowAPY: data.borrowAPY || 0,
          totalSupply: data.totalSupply || 0,
          totalBorrow: data.totalBorrow || 0,
          liquidity: data.liquidity || 0,
          collateralFactor: data.collateralFactor || 0.8,
          icon: "🇸🇬",
        })
      }
    })

    const dashboardRef = ref(database, "dashboard")
    const unsubDashboard = onValue(dashboardRef, (snapshot) => {
      const data = snapshot.val()
      setTvl(data?.tvl || 0)
      setVariableSupplyAPY(data?.variableSupplyAPY || 0)
      setBorrowAPY(data?.borrowAPY || 0)
    })

    let unsubPortfolio = () => {}
    let unsubFee = () => {}
    if (user) {
      const portfolioRef = ref(database, `users/${user.uid}/portfolio`)
      unsubPortfolio = onValue(portfolioRef, (snapshot) => {
        const data = snapshot.val()
        setPortfolio({
          xsgd: data?.xsgd || 0,
          lp: data?.lp || 0,
        })
      })
      const feeRef = ref(database, "withdrawalFeePercent")
      unsubFee = onValue(feeRef, (snapshot) => {
        setWithdrawalFee(snapshot.val() || 0.5)
      })
    }

    return () => {
      off(marketRef)
      off(dashboardRef)
      unsubMarket()
      unsubDashboard()
      if (user) {
        off(ref(database, `users/${user.uid}/portfolio`))
        off(ref(database, "withdrawalFeePercent"))
        unsubPortfolio()
        unsubFee()
      }
    }
  }, [user])

  const handleGatekept = (action: string) => {
    if (!user) {
      router.push("/account")
      return
    }
    alert(`Action: ${action} (functionality coming soon)`)
  }

  const logTransaction = async (action: string, amount: number, details: object = {}) => {
    if (!user) return
    const txRef = ref(database, `transactions/${user.uid}`)
    const newTxRef = push(txRef)
    await set(newTxRef, {
      action,
      amount,
      timestamp: Date.now(),
      ...details
    })
  }

  const handleDeposit = async () => {
    if (!user || !depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) return
    const newXsgd = portfolio.xsgd + Number(depositAmount)
    const userPortfolioRef = ref(database, `users/${user.uid}/portfolio`)
    await update(userPortfolioRef, { xsgd: newXsgd })
    await logTransaction("deposit", Number(depositAmount), { asset: "XsGD" })
    setDepositAmount("")
  }

  const handleLend = async () => {
    if (!user || !lendAmount || isNaN(Number(lendAmount)) || Number(lendAmount) <= 0) return
    const amount = Number(lendAmount)
    if (portfolio.xsgd < amount) return
    const newXsgd = portfolio.xsgd - amount
    const newLp = portfolio.lp + amount
    const userPortfolioRef = ref(database, `users/${user.uid}/portfolio`)
    await update(userPortfolioRef, { xsgd: newXsgd, lp: newLp })
    await logTransaction("lend", amount, { from: "XsGD", to: "LP" })
    setLendAmount("")
  }

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) return
    const amount = Number(withdrawAmount)
    if (portfolio.lp < amount) return
    const fee = (withdrawalFee / 100) * amount
    const received = amount - fee
    const newLp = portfolio.lp - amount
    const newXsgd = portfolio.xsgd + received
    const userPortfolioRef = ref(database, `users/${user.uid}/portfolio`)
    await update(userPortfolioRef, { xsgd: newXsgd, lp: newLp })
    await logTransaction("withdraw", amount, { asset: "LP", received, fee })
    setWithdrawAmount("")
  }

  // for now this uses hardcoded conversion where 1 LP = 1 XsGD but tweak this in the future
  const handleBorrow = async () => {
    if (!user || !borrowAmount || isNaN(Number(borrowAmount)) || Number(borrowAmount) <= 0) return
    const amount = Number(borrowAmount)
    if (portfolio.lp < amount) return
    const newXsgd = portfolio.xsgd + amount
    const newLp = portfolio.lp - amount
    const userPortfolioRef = ref(database, `users/${user.uid}/portfolio`)
    await update(userPortfolioRef, { xsgd: newXsgd, lp: newLp })
    await logTransaction("borrow", amount, { collateral: "LP", interestRate: borrowAPY })
    setBorrowAmount("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
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

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-lg bg-slate-800/50 border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-2xl gap-3">
                  <span className="text-3xl">{xsgdMarket?.icon || "🇸🇬"}</span>
                  Lend XSGD
                  <Badge variant="secondary" className="ml-2 bg-purple-600/20 text-purple-300">
                    {xsgdMarket ? `${xsgdMarket.collateralFactor * 100}% LTV` : "--"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Supply APY</p>
                    <p className="text-lg font-semibold text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {xsgdMarket ? `${xsgdMarket.supplyAPY}%` : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Supply APY (Variable)</p>
                    <p className="text-lg font-semibold text-yellow-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {xsgdMarket ? `${xsgdMarket.variableSupplyAPY}%` : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Borrow APY</p>
                    <p className="text-lg font-semibold text-red-400 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {xsgdMarket ? `${xsgdMarket.borrowAPY}%` : "--"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Total Supplied</p>
                    <p className="text-lg font-semibold text-white">
                      {xsgdMarket ? `$${xsgdMarket.totalSupply.toLocaleString()}` : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Available</p>
                    <p className="text-lg font-semibold text-white">
                      {xsgdMarket ? `$${xsgdMarket.liquidity.toLocaleString()}` : "--"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleGatekept("Lend XSGD")}
                  >
                    Lend XSGD
                  </Button>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleGatekept("Borrow XSGD")}
                  >
                    Borrow XSGD
                  </Button>
                  <Button
                    className="w-full bg-slate-700 hover:bg-slate-800"
                    onClick={() => handleGatekept("Withdraw XSGD")}
                  >
                    Withdraw XSGD
                  </Button>
                </div>
                <div className="mt-4 text-center text-slate-400 text-sm">
                  <span>
                    Please <span className="text-purple-400 font-semibold">log in</span> to lend, borrow, or withdraw.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (

          <>
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-4 flex-1 flex flex-col items-center">
              <span className="text-slate-400 text-sm">Your XSGD Balance</span>
              <span className="text-2xl font-bold text-white">{portfolio.xsgd.toLocaleString()} XSGD</span>
            </div>
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-4 flex-1 flex flex-col items-center">
              <span className="text-slate-400 text-sm">Your LP Balance</span>
              <span className="text-2xl font-bold text-white">{portfolio.lp.toLocaleString()} LP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Deposit XsGD */}
            <Card className="bg-slate-800/50 border-slate-700 relative">
              <CardHeader>
                <CardTitle className="text-white">Deposit XSGD</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-2">Enter the amount of XSGD to deposit:</p>
                <input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="mb-4 w-full rounded bg-slate-700 border border-slate-600 text-white px-3 py-2"
                />
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleDeposit}>
                  Deposit
                </Button>
              </CardContent>
            </Card>

            {/* Card 2: Convert XsGD to LP (LEND) */}
            <div className="relative">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Convert XSGD to LP (LEND)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-2">
                    Convert your XSGD to LP tokens and contribute to the lending pool.
                  </p>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={lendAmount}
                    onChange={e => setLendAmount(e.target.value)}
                    className="mb-4 w-full rounded bg-slate-700 border border-slate-600 text-white px-3 py-2"
                    disabled={portfolio.xsgd === 0}
                  />
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={portfolio.xsgd === 0} onClick={handleLend}>
                    Convert to LP
                  </Button>
                  <div className="mt-4 text-slate-400 text-sm">
                    For every 1 XSGD you lend, you receive 1 LP token.
                  </div>
                  <div className="mt-4">
                    <div className="bg-slate-700/30 rounded-lg p-4 text-slate-300">
                      <div>Total Lending Pool: <span className="font-bold text-white">${tvl.toLocaleString()}</span></div>
                      <div>Variable APY: <span className="font-bold text-yellow-400">{variableSupplyAPY}%</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {(portfolio.xsgd === 0 && portfolio.lp === 0) && (
                <Overlay>You must hold XSGD and LP first</Overlay>
              )}
            </div>

            {/* Card 3: Withdraw (LP → XsGD) */}
            <div className="relative">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Withdraw (LP → XSGD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-2">
                    Withdraw XSGD by redeeming your LP tokens. Withdrawal fee: {withdrawalFee}%.
                  </p>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="mb-4 w-full rounded bg-slate-700 border border-slate-600 text-white px-3 py-2"
                    disabled={portfolio.lp === 0}
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700" disabled={portfolio.lp === 0 || Number(withdrawAmount) > portfolio.lp} onClick={handleWithdraw}>
                    Withdraw
                  </Button>
                  {Number(withdrawAmount) > portfolio.lp && (
                    <div className="text-red-400 text-sm mt-2">Insufficient LP tokens.</div>
                  )}
                </CardContent>
              </Card>
              {(portfolio.lp === 0 && portfolio.xsgd > 0) && (
                <Overlay>You must convert to LP first</Overlay>
              )}
              {(portfolio.lp === 0 && portfolio.xsgd === 0) && (
                <Overlay>You must hold XSGD and LP first</Overlay>
              )}
            </div>

            {/* Card 4: Borrow XsGD (using LP as collateral) */}
            <div className="relative">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Borrow XSGD (using LP as collateral)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-2">
                    Borrow XSGD using your LP tokens as collateral. Interest rate: {borrowAPY}% APY.
                  </p>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={borrowAmount}
                    onChange={e => setBorrowAmount(e.target.value)}
                    className="mb-4 w-full rounded bg-slate-700 border border-slate-600 text-white px-3 py-2"
                    disabled={portfolio.lp === 0}
                  />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={portfolio.lp === 0 || Number(borrowAmount) > portfolio.lp} onClick={handleBorrow}>
                    Borrow
                  </Button>
                  {Number(borrowAmount) > portfolio.lp && (
                    <div className="text-red-400 text-sm mt-2">Insufficient LP tokens.</div>
                  )}
                </CardContent>
              </Card>
              {(portfolio.lp === 0 && portfolio.xsgd > 0) && (
                <Overlay>You must convert to LP first</Overlay>
              )}
              {(portfolio.lp === 0 && portfolio.xsgd === 0) && (
                <Overlay>You must hold XSGD and LP first</Overlay>
              )}
            </div>
          </div>
        </>
        )}
      </main>
      <Footer/>
    </div>
  )
}