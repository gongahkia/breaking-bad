import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

interface Vault {
  id: string
  name: string
  apr: number
  type: string
  balance: number
  points: number
}

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface VaultsCardProps {
  vaults: Vault[]
  user: User | null
}

export function VaultsCard({ vaults, user }: VaultsCardProps) {
  const [searchInput, setSearchInput] = useState("")

  const filteredVaults = vaults.filter(
    (v) =>
      !searchInput ||
      v.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  const vaultProtocols = Array.from(
    new Set(vaults.map((v) => v.name))
  )

  return (
    <Card className="bg-slate-800/50 border-slate-700 relative min-h-[505px] max-h-[505px] h-[505px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white mb-2">
          Vaults
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {/* Search + Filter Row */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-400 border border-slate-700 focus:ring-2 focus:ring-purple-400 transition"
              placeholder="Search by token, address, or protocol"
            />
            <Search className="absolute right-2 top-2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        {/* Dynamic Protocol Filter Bubbles */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {vaultProtocols.map((protocol) => (
            <button
              key={protocol}
              className="bg-slate-700 px-3 py-1 rounded-full text-xs text-purple-200 cursor-not-allowed"
              disabled
            >
              {protocol}
            </button>
          ))}
        </div>
        {/* Vaults List - fixed height, scrollable */}
        <div className="flex-1 min-h-[305px] max-h-[305px] overflow-y-auto">
          {filteredVaults.length > 0 ? (
            filteredVaults.map(v => (
              <Link
                key={v.id}
                href={`/vaults/${v.id}`}
                className="flex items-center justify-between bg-slate-900/80 rounded-lg px-4 py-3 mb-2 hover:bg-purple-700/50 transition-colors cursor-pointer"
                aria-label={`Go to vault ${v.name}`}
              >
                <div className="flex-1 text-slate-100">{v.name}</div>
                <div className="flex gap-6 items-center text-slate-300 text-xs">
                  <span>APR: {v.apr !== undefined && v.apr !== null ? `${v.apr}%` : "-"}</span>
                  <span>Points: {v.points ?? "-"}</span>
                  <span>
                    Balance: {user && v.balance !== undefined && v.balance !== null ? `$${v.balance}` : "-"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-slate-500 py-4">No vaults found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}