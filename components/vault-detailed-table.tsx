"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Sparklines, SparklinesLine } from 'react-sparklines'

interface Vault {
  id: string
  name: string
  apr: number
  type: string
  balance: number
  points: number
  leader: string
  tvl: number
  age: number
  snapshot: number[]
}

type SortField = "name" | "leader" | "apr" | "tvl" | "balance" | "age" | "points"
type SortDirection = "asc" | "desc"

export function Vaults() {
  const { user } = useAuth()
  const router = useRouter()
  const [vaults, setVaults] = useState<Vault[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  useEffect(() => {
    const vaultsRef = ref(database, `allVaults`)
    const unsub = onValue(vaultsRef, (snapshot) => {
      const data = snapshot.val()
      console.log("Fetched vault data:", data)  
      if (data) {
        const vaultsArr = Object.keys(data).map(id => ({
          id,
          ...data[id]
        }))
        console.log("Processed vaults for rendering:", vaultsArr)
        setVaults(vaultsArr)
      } else {
        setVaults([])
      }
    })

    return () => {
      unsub()
    }
  }, [])  // no user dependency now

  // Filter vaults by search
  const filteredVaults = vaults.filter((v) =>
    !searchInput || v.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  // Sort vaults based on current sortField and sortDirection
  const sortedVaults = [...filteredVaults].sort((a, b) => {
    let compare = 0
    switch (sortField) {
      case "name":
        compare = a.name.localeCompare(b.name)
        break
      case "leader":
        compare = a.leader?.localeCompare?.(b.leader) ?? 0
        break
      case "apr":
        compare = (a.apr ?? 0) - (b.apr ?? 0)
        break
      case "tvl":
        compare = (a.tvl ?? 0) - (b.tvl ?? 0)
        break
      case "balance":
        compare = (a.balance ?? 0) - (b.balance ?? 0)
        break
      case "age":
        compare = (a.age ?? 0) - (b.age ?? 0)
        break
      case "points":
        compare = (a.points ?? 0) - (b.points ?? 0)
        break
    }
    return sortDirection === "asc" ? compare : -compare
  })


  // UI: Clickable column headers for sorting
  const renderHeader = (
    <div className="flex items-center w-full px-4 pb-2 pt-4 text-xs text-slate-400 font-semibold select-none gap-1">
      <HeaderCell label="Vault" field="name"   active={sortField === "name"}   direction={sortDirection} onClick={() => handleSort("name")}   className="flex-1 min-w-[110px]" />
      <HeaderCell label="Leader" field="leader" active={sortField === "leader"} direction={sortDirection} onClick={() => handleSort("leader")} className="w-24"          />
      <HeaderCell label="APR" field="apr"       active={sortField === "apr"}    direction={sortDirection} onClick={() => handleSort("apr")}    className="w-16 text-right"/>
      <HeaderCell label="TVL" field="tvl"       active={sortField === "tvl"}    direction={sortDirection} onClick={() => handleSort("tvl")}    className="w-28 text-right"/>
      <HeaderCell label="Your Deposit" field="balance" active={sortField === "balance"} direction={sortDirection} onClick={() => handleSort("balance")} className="w-28 text-right"/>
      <HeaderCell label="Age (days)" field="age" active={sortField === "age"} direction={sortDirection} onClick={() => handleSort("age")} className="w-14 text-right"/>
      <div className="w-24 text-right">Snapshot</div>
    </div>
  )

  function maskAddress(addr?: string) {
    if (!addr || addr.length < 8) return addr ?? "-"
    return addr.slice(0, 5) + "..." + addr.slice(-4)
  }

  function MiniChart({ data }: { data?: number[] }) {
    if (!data || data.length < 2) {
      return <span className="text-slate-500 text-xs">-</span>
    }
    return (
      <div className="w-20 h-5 flex items-center justify-end">
        <Sparklines data={data} width={60} height={20}>
          <SparklinesLine color="#a78bfa" style={{ strokeWidth: 2, fill: "none" }} />
        </Sparklines>
      </div>
    )
  }

  function renderVaultRow(v: Vault) {
    const aprColor = v.apr < 0 ? "text-red-400" : (v.apr > 0 ? "text-green-400" : "text-slate-200");
    return (
      <button
        key={v.id}
        onClick={() => router.push(`/vaults/${v.id}`)}
        className="w-full flex items-center px-4 py-2 my-1 rounded-lg bg-slate-900/80 hover:bg-purple-800/70 transition group gap-1"
        type="button"
        aria-label={`Open vault ${v.name}`}
      >
        <div className="flex-1 min-w-[110px] text-left truncate text-slate-100">{v.name}</div>
        <div className="w-24 text-slate-300 text-xs text-center font-mono">{maskAddress(v.leader)}</div>
        <div className={`w-16 text-right text-xs font-mono ${aprColor}`}>
          {v.apr != null ? `${v.apr > 0 ? "+" : ""}${v.apr.toFixed(2)}%` : "-"}
        </div>
        <div className="w-28 text-right text-xs font-mono">{v.tvl != null ? `$${v.tvl.toLocaleString()}` : "-"}</div>
        <div className="w-28 text-right text-xs font-mono">
          {user && v.balance != null && v.balance !== 0 ? `$${v.balance.toLocaleString()}` : "-"}
        </div>
        <div className="w-14 text-right text-xs">{v.age ?? "-"}</div>
        <div className="w-24 flex justify-end"><MiniChart data={v.snapshot} /></div>
      </button>
    );
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(dir => (dir === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection(field === "name" ? "asc" : "desc")
    }
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

      {!user && (
        <div className="max-w-5xl mx-auto mt-5 px-4 py-3 bg-yellow-500 bg-opacity-80 text-yellow-900 font-semibold rounded-md text-center text-sm">
          Your personal deposit data is hidden. Please{" "}
          <Link href="/account" className="underline font-bold text-yellow-900 hover:text-yellow-700">
            log in
          </Link>{" "}
          to see your deposits.
        </div>
      )}

      <div className="relative max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700 flex flex-col min-h-[600px] mt-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-white mb-2">
              Your Vaults
            </CardTitle>
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-400 border border-slate-700 focus:ring-2 focus:ring-purple-400 transition"
                placeholder="Search by token, address, or protocol"
              />
              <Search className="absolute right-2 top-2 w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>

          <CardContent className="flex-1 min-h-[480px] max-h-[480px] overflow-y-auto">
            {/* Table Headers */}
            {renderHeader}

            {sortedVaults.length === 0 ? (
              <div className="text-center text-slate-500 py-20">No vaults found.</div>
            ) : (
              sortedVaults.map(renderVaultRow)
            )}

          </CardContent>
        </Card>
      </div>
      <Footer/>
    </div>
  )
}

// Helper component for sortable column headers
function HeaderCell({
  label,
  active,
  direction,
  onClick,
  className
}: {
  label: string
  field: SortField
  active: boolean
  direction: SortDirection
  onClick: () => void
  className?: string
}) {
  let icon = (
    <span className="ml-1 opacity-40">⇅</span>
  )
  if (active && direction === "asc") {
    icon = <span className="ml-1 text-purple-300">↑</span>
  } else if (active && direction === "desc") {
    icon = <span className="ml-1 text-purple-300">↓</span>
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-transparent border-0 text-xs font-semibold px-0 mx-0 focus:outline-none cursor-pointer flex items-center ${className ?? ""} ${active ? "text-purple-200" : "text-slate-400"} transition-colors`}
      aria-label={`Sort by ${label}`}
    >
      {label} {icon}
    </button>
  )
}