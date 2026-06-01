"use client" 

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JoinForm } from "@/components/join-form"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2a] to-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gradient-to-r from-[#0a0a0a]/90 to-[#1a0a2a]/90 backdrop-blur-sm py-4">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo/nidus_logo_1.png"
              alt="Nidus Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NIDUS
            </h1>
            <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">v1.0</span>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#about" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="#team" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors">
              Team
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors">
              Features
            </Link>
          </nav>
          <Link href="#join" className="hidden md:block">
            <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">
              Join
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/40"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="mb-8">
              <Image
                src="/logo/nidus_logo_1.png"
                alt="Nidus Logo"
                width={120}
                height={120}
                className="mx-auto mb-6 rounded-2xl shadow-2xl border border-blue-500/30"
              />
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                NIDUS
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              The Platform for unlocking predictable, real-world yield from Singaporean insurance policies, 
              bridging traditional finance with DeFi through innovative blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#about">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Demo Section */}
            <div className="mt-16 md:mt-24">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-3xl"></div>
                <Image
                  src="/demo/nidus-demonstration.gif"
                  alt="NIDUS Dashboard Demo"
                  width={1200}
                  height={700}
                  className="relative rounded-xl shadow-2xl border border-blue-500/30 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-400 mt-4 text-center">
                Experience the future of insurance-linked DeFi
              </p>
            </div>
          </div>
        </section>

        {/* Features Section - NEW */}
        <section id="features" className="py-20 md:py-32 bg-gray-950/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Platform Features
              </span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <CardTitle className="text-white">Predictable Yields</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300">
                    Access stable, predictable returns backed by real-world insurance policies
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <CardTitle className="text-white">Regulated & Secure</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300">
                    Built on Singapore&apos;s robust regulatory framework with institutional-grade security
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-white">Community Driven</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300">
                    Join a growing community of DeFi enthusiasts and insurance professionals
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section - Enhanced */}
        <section id="about" className="py-20 md:py-32 bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About NIDUS
              </span>
            </h3>

            {/* The Problem Sub-section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="relative h-96 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"></div>
                <div className="relative h-full w-full bg-gray-800/50 rounded-2xl border border-blue-500/30 flex items-center justify-center">
                  <svg className="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-blue-400">THE PROBLEM</h4>
                <ul className="space-y-8">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-black mr-3 mt-1 text-sm font-bold">
                      1
                    </span>
                    <div>
                      <h5 className="text-2xl font-semibold mb-2 text-white">Low Yield Environment</h5>
                      <p className="text-gray-300 leading-relaxed">
                        Traditional savings and investment products offer minimal returns in today&apos;s low-interest rate environment
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-black mr-3 mt-1 text-sm font-bold">
                      2
                    </span>
                    <div>
                      <h5 className="text-2xl font-semibold mb-2 text-white">Limited Access to Insurance</h5>
                      <p className="text-gray-300 leading-relaxed">
                        Insurance-linked investment products are often restricted to high-net-worth individuals
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-black mr-3 mt-1 text-sm font-bold">
                      3
                    </span>
                    <div>
                      <h5 className="text-2xl font-semibold mb-2 text-white">DeFi Volatility</h5>
                      <p className="text-gray-300 leading-relaxed">
                        Most DeFi protocols offer high yields but come with significant volatility and risk
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* The Solution Sub-section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-green-400">THE SOLUTION</h4>
                <ul className="space-y-8">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-black mr-3 mt-1 text-sm font-bold">
                      1
                    </span>
                    <div>
                      <h5 className="text-2xl font-semibold mb-2 text-white">Insurance-Backed Yields</h5>
                      <p className="text-gray-300 leading-relaxed">
                        Access stable returns backed by real-world insurance policies and regulatory frameworks
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-black mr-3 mt-1 text-sm font-bold">
                      2
                    </span>
                    <div>
                      <h5 className="text-2xl font-semibold mb-2 text-white">Democratized Access</h5>
                      <p className="text-gray-300 leading-relaxed">
                        Blockchain technology enables fractional ownership and broader access to insurance products
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-black mr-3 mt-1 text-sm font-bold">
                      3
                    </span>
                    <div>
                      <h5 className="text-2xl font-semibold mb-2 text-white">Predictable Returns</h5>
                      <p className="text-gray-300 leading-relaxed">
                        Stable yields with lower volatility compared to traditional DeFi protocols
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative h-96 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl"></div>
                <div className="relative h-full w-full bg-gray-800/50 rounded-2xl border border-green-500/30 flex items-center justify-center">
                  <svg className="w-32 h-32 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - Enhanced */}
        <section id="team" className="py-20 md:py-32 bg-gray-950/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Richard Lei */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500/30">
                    <Image
                      src="/profile/richard.jpg"
                      alt="Richard Lei"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-white text-2xl">Richard Lei</CardTitle>
                  <p className="text-blue-400 font-semibold">CEO & Co-Founder</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 leading-relaxed">
                    Business and marketing expert with deep knowledge of the Singaporean insurance market. 
                    Leading NIDUS&apos;s strategic vision and market expansion.
                  </p>
                </CardContent>
              </Card>

              {/* Gabriel Ong */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-500/30">
                    <Image
                      src="/profile/gabriel.jpg"
                      alt="Gabriel Ong"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-white text-2xl">Gabriel Ong</CardTitle>
                  <p className="text-purple-400 font-semibold">CTO & Co-Founder</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 leading-relaxed">
                    Full-stack developer and DevOps specialist with expertise in blockchain technology. 
                    Architecting NIDUS&apos;s technical infrastructure and DeFi protocols.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section id="join" className="py-20 md:py-32 bg-gradient-to-br from-blue-950/50 to-purple-950/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to Start?
                </span>
              </h3>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Join NIDUS today and unlock the future of insurance-linked DeFi. 
                Experience predictable yields backed by real-world assets.
              </p>
              <JoinForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
