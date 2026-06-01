import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ref, onValue, off } from "firebase/database";
import type { DataSnapshot } from "firebase/database";
import { database } from "@/lib/firebase";

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface DepositWithdrawal {
  time?: string;
  status?: string;
  network?: string;
  action?: string;
  accountValueChange?: number | string;
  fee?: number | string;
}

// interface Trade {
//   time?: string;
//   coin?: string;
//   direction?: string;
//   price?: number | string;
//   size?: number | string;
//   tradeValue?: number | string;
//   fee?: number | string;
//   pnl?: number | string;
// }

// interface Position {
//   time?: string;
//   coin?: string;
//   direction?: string;
//   entryPrice?: number | string;
//   size?: number | string;
//   value?: number | string;
//   pnl?: number | string;
// }

function TableDepositsWithdrawals({ data }: { data:DepositWithdrawal[] }) {
  // Columns: Time, Status, Network, Action, Account Value Change, Fee
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-slate-400 border-b border-slate-700">
          <th className="py-2 px-2 text-left">Time</th>
          <th className="py-2 px-2 text-left">Status</th>
          <th className="py-2 px-2 text-left">Network</th>
          <th className="py-2 px-2 text-left">Action</th>
          <th className="py-2 px-2 text-right">Value Change</th>
          <th className="py-2 px-2 text-right">Fee</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr><td colSpan={6} className="py-8 text-slate-500 text-center">No records found</td></tr>
        )}
        {data.map((row, i) => (
          <tr key={i} className="border-b border-slate-800 hover:bg-slate-900/40">
            <td className="py-2 px-2">{row.time || "-"}</td>
            <td className="py-2 px-2">{row.status || "-"}</td>
            <td className="py-2 px-2">{row.network || "-"}</td>
            <td className="py-2 px-2">{row.action || "-"}</td>
            <td className="py-2 px-2 text-right">{row.accountValueChange || "-"}</td>
            <td className="py-2 px-2 text-right">{row.fee || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// function TableTrades({ data }: { data: Trade[] }) {
//   // Columns: Time, Coin, Direction, Price, Size, Trade Value, Fee, PnL
//   return (
//     <table className="w-full border-collapse">
//       <thead>
//         <tr className="text-slate-400 border-b border-slate-700">
//           <th className="py-2 px-2 text-left">Time</th>
//           <th className="py-2 px-2 text-left">Coin</th>
//           <th className="py-2 px-2 text-left">Direction</th>
//           <th className="py-2 px-2 text-right">Price</th>
//           <th className="py-2 px-2 text-right">Size</th>
//           <th className="py-2 px-2 text-right">Trade Value</th>
//           <th className="py-2 px-2 text-right">Fee</th>
//           <th className="py-2 px-2 text-right">PnL</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.length === 0 && (
//           <tr><td colSpan={8} className="py-8 text-slate-500 text-center">No records found</td></tr>
//         )}
//         {data.map((row, i) => (
//           <tr key={i} className="border-b border-slate-800 hover:bg-slate-900/40">
//             <td className="py-2 px-2">{row.time || "-"}</td>
//             <td className="py-2 px-2">{row.coin || "-"}</td>
//             <td className="py-2 px-2">{row.direction || "-"}</td>
//             <td className="py-2 px-2 text-right">{row.price || "-"}</td>
//             <td className="py-2 px-2 text-right">{row.size || "-"}</td>
//             <td className="py-2 px-2 text-right">{row.tradeValue || "-"}</td>
//             <td className="py-2 px-2 text-right">{row.fee || "-"}</td>
//             <td className="py-2 px-2 text-right">{row.pnl || "-"}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

/*
function TablePositions({ data }: { data: Position[] }) {
  // Columns: Time, Coin, Direction, Entry Price, Size, Value, PnL
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-slate-400 border-b border-slate-700">
          <th className="py-2 px-2 text-left">Time</th>
          <th className="py-2 px-2 text-left">Coin</th>
          <th className="py-2 px-2 text-left">Direction</th>
          <th className="py-2 px-2 text-right">Entry Price</th>
          <th className="py-2 px-2 text-right">Size</th>
          <th className="py-2 px-2 text-right">Value</th>
          <th className="py-2 px-2 text-right">PnL</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr><td colSpan={7} className="py-8 text-slate-500 text-center">No records found</td></tr>
        )}
        {data.map((row, i) => (
          <tr key={i} className="border-b border-slate-800 hover:bg-slate-900/40">
            <td className="py-2 px-2">{row.time || "-"}</td>
            <td className="py-2 px-2">{row.coin || "-"}</td>
            <td className="py-2 px-2">{row.direction || "-"}</td>
            <td className="py-2 px-2 text-right">{row.entryPrice || "-"}</td>
            <td className="py-2 px-2 text-right">{row.size || "-"}</td>
            <td className="py-2 px-2 text-right">{row.value || "-"}</td>
            <td className="py-2 px-2 text-right">{row.pnl || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
  */

export function TabbedTables({ vaultId, user }: { vaultId: string, user: User | null }) {
  // const [activeTab, setActiveTab] = useState<"deposits" | "trades" | "positions">("deposits");
  const [activeTab, setActiveTab] = useState<"deposits" >("deposits");
  const [deposits, setDeposits] = useState<DepositWithdrawal[]>([]);
  // const [trades, setTrades] = useState<Trade[]>([]);
  // const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (!user || !vaultId) return;
    if (!vaultId) return;
    setLoading(true);


    let refPath = "";
    switch (activeTab) {
      case "deposits":
        refPath = `allVaults/${vaultId}/depositsAndWithdrawals`;
        break;
      // case "trades":
      //   refPath = `allVaults/${vaultId}/tradeHistory`;
      //   break;

      // case "positions":
      //   refPath = `users/${user.uid}/vaults/${vaultId}/positions`;
      //   break;

      default:
    }

    const tableRef = ref(database, refPath);
    const handle = onValue(tableRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (!data) {
        setDeposits([]);
        // setTrades([]);

        // setPositions([]);

        setLoading(false);
        return;
      }
      if (activeTab === "deposits") setDeposits(Object.values(data));
      // if (activeTab === "trades") setTrades(Object.values(data));

      // if (activeTab === "positions") setPositions(Object.values(data));

      setLoading(false);

    });
    return () => {
      handle();
      off(tableRef);
    }
  }, [activeTab, vaultId, user]);

  // Styling helper
  const tabButton =
    "px-4 py-2 font-medium rounded-t-lg border-b-2 border-transparent focus:outline-none text-sm transition";
  const tabButtonActive =
    "border-purple-400 text-purple-300 bg-slate-900/50";

  return (
    // <Card className="bg-slate-800/50 border-slate-700 min-h-[505px] flex flex-col">
    <Card className="p-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 rounded-2xl shadow-lg border border-slate-700 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          Activity
        </CardTitle>
        {/* Tab controls */}
        <div className="flex gap-2 mt-3">
          <button
            className={`${tabButton} ${activeTab === "deposits" ? tabButtonActive : "text-slate-300 hover:text-purple-300"}`}
            onClick={() => setActiveTab("deposits")}
          >Deposits & Withdrawals</button>

          {/* <button
            className={`${tabButton} ${activeTab === "trades" ? tabButtonActive : "text-slate-300 hover:text-purple-300"}`}
            onClick={() => setActiveTab("trades")}
          >Trade History</button> */}

          {/* <button
            className={`${tabButton} ${activeTab === "positions" ? tabButtonActive : "text-slate-300 hover:text-purple-300"}`}
            onClick={() => setActiveTab("positions")}
          >Positions</button> */}

        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto text-xs text-slate-100 mt-2">
        {loading && <div className="py-8 text-center text-slate-400">Loading...</div>}

        {/* Render the currently selected table */}
        {!loading && activeTab === "deposits" && (
          <TableDepositsWithdrawals data={deposits} />
        )}
        {/* {!loading && activeTab === "trades" && (
          <TableTrades data={trades} />
        )} */}

        {/* {!loading && activeTab === "positions" && (
          <TablePositions data={positions} />
        )} */}

      </CardContent>
    </Card>
  );
}