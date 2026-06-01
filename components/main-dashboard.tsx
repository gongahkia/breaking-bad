"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { ref, onValue, off } from "firebase/database"
import { database } from "@/lib/firebase"
import { ValueChart } from "@/components/value-chart"
import { Overlay } from "@/components/overlay"
import { Footer } from "@/components/footer"
import { VaultsCard } from "@/components/dashboard-vaults-card"
import { AnnouncementsWithToggle } from "@/components/announcements-with-toggle" 

interface Announcement {
  id: string
  title: string
  content: string
  timestamp: number
  type: "info" | "warning" | "success"
}

interface DashboardData {
  tvl: number
  announcements: Announcement[]
}

interface UserPortfolio {
  lp: number
  ownershipPercent: number
  xsgd: number
  apr: number
  outstandingRewards: number
  points: number
}

interface Vault {
  id: string
  name: string
  apr: number
  type: string
  balance: number
  points: number
}

export function MainDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    tvl: 0,
    announcements: [],
  })
  const [poolValueHistory, setPoolValueHistory] = useState<
    { timestamp: number; value: number }[]
  >([])
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(null)
  const [vaults, setVaults] = useState<Vault[]>([])

  // Dashboard, Pool Value History and Announcements fetch
  useEffect(() => {
    const dashboardRef = ref(database, "dashboard")
    const announcementsRef = ref(database, "announcements")
    const poolValueRef = ref(database, "poolValueHistory")

    onValue(poolValueRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.entries(data)
          .map(([timestamp, value]) => ({
            timestamp: Number(timestamp),
            value: Number(value),
          }))
          .sort((a, b) => a.timestamp - b.timestamp)
        setPoolValueHistory(arr)
      }
    })

    onValue(dashboardRef, snapshot => {
      const data = snapshot.val()
      if (data) setDashboardData(prev => ({ ...prev, tvl: data.tvl || 0 }))
    })

    onValue(announcementsRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const announcements = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }))
        setDashboardData(prev => ({ ...prev, announcements }))
      }
    })

    return () => {
      off(poolValueRef)
      off(dashboardRef)
      off(announcementsRef)
    }
  }, [])

  // Portfolio fetch
  useEffect(() => {
    if (!user) {
      setUserPortfolio(null)
      return
    }
    const userPortfolioRef = ref(database, `users/${user.uid}/portfolio`)
    const unsub = onValue(userPortfolioRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        setUserPortfolio({
          lp: data.lp || 0,
          ownershipPercent: data.ownershipPercent || 0,
          xsgd: data.xsgd || 0,
          apr: data.apr || 0,
          outstandingRewards: data.outstandingRewards || 0,
          points: data.points || 0,
        })
      }
    })
    return () => {
      off(userPortfolioRef)
      unsub()
    }
  }, [user])

  // Vaults fetch (public)
  useEffect(() => {
    const vaultsRef = ref(database, `allVaults`)
    const unsub = onValue(vaultsRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.keys(data).map(id => ({ id, ...data[id] }))
        setVaults(arr)
      } else {
        setVaults([])
      }
    })
    return () => {
      off(vaultsRef)
      unsub()
    }
  }, [])

  // Define Portfolio card component
  const PortfolioCard = (
    <Card className="bg-slate-800/50 border-slate-700 relative min-h-[505px] max-h-[505px] h-[505px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white mb-2">
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300 mb-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Balance</div>
            <div className="font-semibold text-lg text-white">
              {userPortfolio ? `S$${userPortfolio.xsgd.toLocaleString()}` : "$0"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Outstanding Rewards</div>
            <div className="font-semibold text-lg text-white">
              {userPortfolio ? `$${userPortfolio.outstandingRewards.toLocaleString()}` : "$0"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Weighted APR</div>
            <div className="font-semibold text-lg text-white">
              {userPortfolio ? `${userPortfolio.apr.toFixed(2)}%` : "0%"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Points</div>
            <div className="font-semibold text-lg text-white">
              {userPortfolio ? userPortfolio.points : "0"}
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 rounded-lg p-3 flex flex-col" style={{ height: 330 }}>
          <div className="text-xs text-slate-400 mb-2">Performance</div>
          <ValueChart
            data={{
              poolValueHistory,
              dailyNewUsers: [],
              chartType: "pool",
            }}
            onClick={() => {}}
          />
        </div>
      </CardContent>
    </Card>
  )

  // Comment out Nidus card for now
  // const NidusCard = ( ... )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header & Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">NIDUS</h1>
            <Badge variant="secondary">v1.0</Badge>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-purple-300 transition">Dashboard</Link>
            <Link href="/vaults" className="text-slate-300 hover:text-purple-300 transition">Vaults</Link>
            <Link href="/points" className="text-slate-300 hover:text-purple-300 transition">Points</Link>
            {!user && <Link href="/about-nidus" className="text-slate-300 hover:text-purple-300 transition">Mission</Link>}
            <Link href="/account" className="text-slate-300 hover:text-purple-300 transition">Account</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Portfolio and Vaults */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7 items-stretch">
          <div className="relative">
            {PortfolioCard}
            {!user && <Overlay>Please log in to view your portfolio</Overlay>}
          </div>
          <div className="relative">
            <VaultsCard vaults={vaults} user={user} />
          </div>
        </div>

        {/* Announcements occupy entire bottom */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div>{ /* Full width single item */
            <AnnouncementsWithToggle dashboardData={dashboardData} />
          }</div>
        </div>
      </main>

      <Footer />
    </div>
  )
}