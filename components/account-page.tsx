"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, HelpCircle, Shield, Bell, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { ref, onValue, set } from 'firebase/database'
import { database } from '@/lib/firebase'
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  displayName: string
  email: string
  walletAddress: string
  joinDate: number
  preferences: {
    notifications: boolean
    autoCompound: boolean
  }
  portfolio: {
    annuity: number
    endowment: number
    xsgd: number,
    lp: number
  }
  assets?: string[]  
}

// type CurrencyCode = 'SGD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY'
//   | 'HKD' // Hong Kong Dollar
//   | 'NZD' // New Zealand Dollar
//   | 'SEK' // Swedish Krona
//   | 'KRW' // South Korean Won
//   | 'INR' // Indian Rupee
//   | 'MXN' // Mexican Peso
//   | 'TWD' // Taiwan Dollar
//   | 'THB' // Thai Baht
//   | 'MYR' // Malaysian Ringgit
//   | 'IDR' // Indonesian Rupiah

// const exchangeRates: Record<CurrencyCode, number> = {
//   SGD: 1,
//   USD: 0.74,
//   EUR: 0.68,
//   GBP: 0.59,
//   JPY: 81,
//   AUD: 1.03,
//   CAD: 0.96,
//   CHF: 0.69,
//   CNY: 5.08,
//   HKD: 5.75,
//   NZD: 1.19,
//   SEK: 7.07,
//   KRW: 989,
//   INR: 61.59,
//   MXN: 12.69,
//   TWD: 23.5,
//   THB: 27.01,
//   MYR: 3.50,
//   IDR: 11.668
// }

export function AccountPage() {
  const { user, signIn, signUp, signOut } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)

  // State to track which extra currencies user has toggled on for display (beside SGD and USD)
  // const [visibleCurrencies, setVisibleCurrencies] = useState<CurrencyCode[]>(['SGD', 'USD'])

  useEffect(() => {
    if (!user) return

    const userRef = ref(database, `users/${user.uid}`)

    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setUserProfile({
          displayName: data.displayName || "",
          email: data.email || "",
          walletAddress: data.walletAddress || "",
          joinDate: data.joinDate || 0,
          preferences: {
            notifications: data.preferences?.notifications ?? false,
            autoCompound: data.preferences?.autoCompound ?? false,
          },
          portfolio: {
            annuity: data.portfolio?.annuity ?? 0,
            endowment: data.portfolio?.endowment ?? 0,
            xsgd: data.portfolio?.xsgd ?? 0,
            lp: data.portfolio?.lp ?? 0
          },
          assets: data.assets || []  
        })
      }
    })

    return () => {
      unsubscribeUser()
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user || !userProfile) return
    const userRef = ref(database, `users/${user.uid}`)
    await set(userRef, {
      ...userProfile,
    })
    setIsEditing(false)
  }

  const handlePreferenceChange = async (key: keyof UserProfile["preferences"], value: boolean) => {
    if (!userProfile || !user) return
    const updatedProfile = {
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        [key]: value,
      },
    }
    setUserProfile(updatedProfile)
    const userRef = ref(database, `users/${user.uid}`)
    await set(userRef, updatedProfile)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    try {
      if (authMode === "signin") {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      setEmail("")
      setPassword("")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message)
      } else {
        setAuthError("Authentication failed")
      }
    }
  }

  // Handle toggling a currency on/off for display
  // const toggleCurrencyVisibility = (currency: CurrencyCode) => {
  //   setVisibleCurrencies(prev => {
  //     if (prev.includes(currency)) {
  //       // remove
  //       return prev.filter(c => c !== currency)
  //     } else {
  //       // add
  //       return [...prev, currency]
  //     }
  //   })
  // }

  if (!user) {
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
                <Link href="/vaults" className="text-slate-300 hover:text-purple-300 transition-colors">
                  Vaults
                </Link>
                <Link href="/points" className="text-slate-300 hover:text-purple-300 transition-colors">
                  Points
                </Link>
                <Link href="/about-nidus" className="text-white hover:text-purple-300 transition-colors">
                  Mission
                </Link>
                <Link href="/account" className="text-slate-300 hover:text-purple-300 transition-colors">
                  Account
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <Card className="bg-slate-800/50 border-slate-700 w-full max-w-md">
              <CardContent className="p-8">
                <User className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {authMode === "signin" ? "Sign In" : "Sign Up"}
                </h3>
                <p className="text-slate-400 mb-4">
                  {authMode === "signin"
                    ? "Sign in to access your account"
                    : "Create an account to get started"}
                </p>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  {authError && (
                    <div className="text-red-500 text-sm">{authError}</div>
                  )}
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    {authMode === "signin" ? "Sign In" : "Sign Up"}
                  </Button>
                  <div className="text-slate-400 text-sm text-center mt-2">
                    {authMode === "signin" ? (
                      <>
                        Don&#39;t have an account?{" "}
                        <button
                          type="button"
                          className="text-purple-400 underline"
                          onClick={() => setAuthMode("signup")}
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="text-purple-400 underline"
                          onClick={() => setAuthMode("signin")}
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
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
              <Link href="/vaults" className="text-slate-300 hover:text-purple-300 transition-colors">
                Vaults
              </Link>
              <Link href="/points" className="text-slate-300 hover:text-purple-300 transition-colors">
                Points
              </Link>
              <Link href="/account" className="text-white hover:text-purple-300 transition-colors">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-white">
                  {isEditing ? (
                    <Input
                      value={userProfile?.displayName || ""}
                      onChange={e =>
                        userProfile && setUserProfile({ ...userProfile, displayName: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  ) : (
                    userProfile?.displayName
                  )}
                </CardTitle>
                <p className="text-slate-400 text-sm">{userProfile?.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {/* Total Portfolio Value with SGD and USD */}
                  <p className="text-sm text-slate-400 mb-1">Total Portfolio Value</p>
                  <div className="flex justify-center items-baseline space-x-6">
                    <p className="text-2xl font-bold text-white">
                      S${(userProfile?.portfolio.xsgd || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Member since</span>
                    <span className="text-white">
                      {userProfile && new Date(userProfile.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Wallet</span>
                    <span className="text-white font-mono">{userProfile?.walletAddress}</span>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4 justify-center items-center">
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Sign Out
                  </Button>
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/help-support" passHref>
                  <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                    <span>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </span>
                  </Button>
                </Link>
                <Link href="/about-nidus" passHref>
                  <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                    <span>
                      <Shield className="h-4 w-4 mr-2" />
                      About NIDUS
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="portfolio" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Portfolio Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

{/* 
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      {visibleCurrencies.map(currency => {
                        // handle safe null userProfile
                        const baseValue = userProfile?.portfolio.xsgd || 0
                        // convert base SGD to target currency
                        const valueInCurrency = baseValue * exchangeRates[currency]
                        return (
                          <div
                            key={currency}
                            className={`p-4 rounded-lg ${
                              currency === 'SGD' ? 'bg-green-600/20' : 'bg-blue-600/20'
                            }`}
                          >
                            <p className="text-sm text-green-300 capitalize">{currency}</p>
                            <p className="text-2xl font-bold text-white">
                              {currency === "USD" || currency === "SGD"
                                ? (currency === "SGD" ? 'S$' : 'U$')
                                : currency + ' '}
                              {valueInCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        )
                      })}
                    </div> 
*/}

                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white">Your Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* NEW: Redesigned Assets Card to match Portfolio styling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* XSGD Asset */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-green-300 font-medium">XSGD</p>
                          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                            Stable
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          S${(userProfile?.portfolio.xsgd || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-400 mt-1">
                          Singapore Dollar Stablecoin
                        </p>
                      </div>

                      {/* LP Asset */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-blue-300 font-medium">LP</p>
                          <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                            Yield
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          S${(userProfile?.portfolio.lp || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-400 mt-1">
                          Liquidity Provider Tokens
                        </p>
                      </div>

                      {/* Annuity Asset */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-purple-300 font-medium">Annuity</p>
                          <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full">
                            Long-term
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          S${(userProfile?.portfolio.annuity || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-400 mt-1">
                          Insurance Annuity Products
                        </p>
                      </div>

                      {/* Endowment Asset */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-orange-300 font-medium">Endowment</p>
                          <span className="text-xs text-orange-400 bg-orange-900/30 px-2 py-1 rounded-full">
                            Growth
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          S${(userProfile?.portfolio.endowment || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-orange-400 mt-1">
                          Endowment Insurance Plans
                        </p>
                      </div>
                    </div>

                    {/* Fallback for custom assets */}
                    {userProfile?.assets && userProfile.assets.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <h4 className="text-white font-medium mb-3">Additional Assets</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {userProfile.assets.map((asset, index) => (
                            <div key={index} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                              <p className="text-white font-medium">{asset}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Settings className="h-5 w-5 mr-2" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="displayName" className="text-slate-300">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          value={userProfile?.displayName || ""}
                          onChange={(e) =>
                            userProfile &&
                            setUserProfile({
                              ...userProfile,
                              displayName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-slate-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={userProfile?.email || ""}
                          disabled
                          className="bg-slate-700 border-slate-600 text-white opacity-50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Bell className="h-5 w-5 mr-2" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-400">Receive updates about your positions</p>
                      </div>
                    <Switch
                      checked={userProfile?.preferences.notifications || false}
                      onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                        ${(userProfile?.preferences.notifications || false) ? 'bg-purple-600' : 'bg-gray-700'}
                      `}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                          ${(userProfile?.preferences.notifications || false) ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </Switch>
                    </div>
                    {/* 
                    <Separator className="bg-slate-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Auto-Compound Rewards</p>
                        <p className="text-sm text-slate-400">Automatically reinvest earned yields</p>
                      </div>
                    <Switch
                      checked={userProfile?.preferences.autoCompound || false}
                      onCheckedChange={(checked) => handlePreferenceChange("autoCompound", checked)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                        ${(userProfile?.preferences.autoCompound || false) ? 'bg-purple-600' : 'bg-gray-700'}
                      `}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                          ${(userProfile?.preferences.autoCompound || false) ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </Switch>
                    </div>
                    */}
                  </CardContent>
                </Card>

                {/* New: Currency Management */}
                {/* <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Manage Currencies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-slate-400 mb-4">Toggle currencies to display their portfolio values.</p>
                    {(['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SEK', 'KRW', 'INR', 'MXN', 'TWD', 'THB', 'MYR', 'IDR'] as CurrencyCode[]).map(currency => (
                      <div key={currency} className="flex items-center justify-between py-1">
                        <span className="text-white font-medium capitalize">{currency}</span>
                        <Switch
                          checked={visibleCurrencies.includes(currency)}
                          onCheckedChange={() => toggleCurrencyVisibility(currency)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                            ${visibleCurrencies.includes(currency) ? 'bg-purple-600' : 'bg-gray-700'}
                          `}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                              ${visibleCurrencies.includes(currency) ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                        </Switch>
                      </div>
                    ))}
                  </CardContent>
                </Card> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
