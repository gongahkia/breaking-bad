"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, Medal } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ref, query, orderByChild, limitToLast, onValue, off } from "firebase/database";
import { database } from '@/lib/firebase'
import { useAuth } from "./auth-provider"

interface LeaderboardEntry {
  userId: string;
  score: number;
  displayName?: string;
  walletAddress?: string;
  lastUpdated?: number;
  rank?: number; 
}

export default function PointLeaderboard() {

  // const [isWindowTooSmall, setIsWindowTooSmall] = useState(false)

  // useEffect(() => {
  //   const handleResize = () => {
  //     const isTooSmall =
  //       window.innerWidth < window.screen.width * 0.95 ||
  //       window.innerHeight < window.screen.height * 0.9

  //     setIsWindowTooSmall(isTooSmall)
  //   }
  //   handleResize()
  //   window.addEventListener("resize", handleResize)
  //   return () => window.removeEventListener("resize", handleResize)
  // }, [])

  // useEffect(() => {
  //   if (isWindowTooSmall) {
  //     document.body.style.overflow = "hidden";
  //     const preventDefault = (e: Event) => { e.preventDefault(); };
  //     window.addEventListener("keydown", preventDefault, { passive: false });
  //     window.addEventListener("wheel", preventDefault, { passive: false });
  //     window.addEventListener("touchmove", preventDefault, { passive: false });
  //     window.addEventListener("mousedown", preventDefault, { passive: false });
  //     return () => {
  //       document.body.style.overflow = "";
  //       window.removeEventListener("keydown", preventDefault);
  //       window.removeEventListener("wheel", preventDefault);
  //       window.removeEventListener("touchmove", preventDefault);
  //       window.removeEventListener("mousedown", preventDefault);
  //     };
  //   } else {
  //     document.body.style.overflow = "";
  //   }
  // }, [isWindowTooSmall]);

  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {

    const leaderboardRef = query(
      ref(database, "leaderboard"),
      orderByChild("score"),
      limitToLast(10)
    );

    const handler = onValue(leaderboardRef, (snapshot) => {
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach(childSnap => {
        entries.push({
          userId: childSnap.key!,
          ...childSnap.val(),
        });
      });
      entries.sort(
        (a, b) =>
          b.score - a.score ||
          (b.lastUpdated ?? 0) - (a.lastUpdated ?? 0)
      );
      entries.forEach((entry, idx) => (entry['rank'] = idx + 1));
      setLeaderboard(entries);
    });

    return () => off(leaderboardRef, "value", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
              <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                Dashboard
              </Link>
              <Link href="/vaults" className="text-slate-300 hover:text-purple-300 transition-colors">
                Vaults
              </Link>
              <Link href="/points" className="text-white hover:text-purple-300 transition-colors">
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
        <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-white gap-2">
              <TrendingUp className="text-purple-400 w-6 h-6" />
              Points leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-xs uppercase text-slate-400 border-b border-slate-700">
                    <th className="py-3 px-4 font-semibold w-16">Rank</th>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Wallet</th>
                    <th className="py-3 px-4 font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">
                        No leaderboard data.
                      </td>
                    </tr>
                  )}
                  {leaderboard.map((entry, idx) => (
                    <tr
                      key={entry.userId}
                      className={`${
                        idx === 0
                          ? "bg-gradient-to-r from-yellow-500/10 via-yellow-300/5 to-transparent"
                          : idx === 1
                          ? "bg-gradient-to-r from-slate-300/5 via-slate-400/5 to-transparent"
                          : idx === 2
                          ? "bg-gradient-to-r from-amber-700/5 via-amber-500/5 to-transparent"
                          : "odd:bg-slate-900/10"
                      }`}
                    >
                      <td className="py-2 px-4 align-middle text-center font-bold text-white">
                        {idx === 0 ? (
                          <Medal className="text-yellow-400 w-5 h-5 mx-auto" />
                        ) : idx === 1 ? (
                          <Medal className="text-slate-300 w-5 h-5 mx-auto" />
                        ) : idx === 2 ? (
                          <Medal className="text-amber-700 w-5 h-5 mx-auto" />
                        ) : (
                          entry['rank']
                        )}
                      </td>
                      <td className="py-2 px-4 align-middle font-mono text-slate-300 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <User className="inline-block w-4 h-4 text-slate-500" />
                          <span className="tracking-wide">
                            {entry.displayName && entry.displayName.length > 0
                              ? entry.displayName
                              : entry.userId.slice(0, 6) + "..." + entry.userId.slice(-4)}
                          </span>
                        </span>
                      </td>
                      <td className="py-2 px-4 align-middle text-slate-500 text-xs font-mono">
                        {entry.walletAddress
                          ? entry.walletAddress.slice(0, 6) + "..." + entry.walletAddress.slice(-4)
                          : "--"}
                      </td>
                      <td className="py-2 px-4 align-middle font-semibold text-white">
                        {entry.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
      {/* {isWindowTooSmall && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center text-center p-4">
          <div className="bg-slate-900 border border-purple-600 p-6 rounded-lg max-w-md text-white space-y-2 shadow-lg">
            <h2 className="text-xl font-bold text-purple-300">Please Maximise Window</h2>
            <p className="text-sm text-slate-300">
              NIDUS is optimised for full-screen viewing. Please maximise your browser window for the best experience.
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
}