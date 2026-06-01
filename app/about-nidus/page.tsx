"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button"; 
import { useRouter } from "next/navigation"; 

export default function AboutNidusPage() {
  const router = useRouter(); 

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
        <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700">
          <CardHeader className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white">About NIDUS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              <strong>NIDUS</strong> is a next-generation decentralized lending platform. We bring transparency, security, and flexibility to the world of digital asset protection and yield generation.
            </p>
            <ul className="list-disc ml-5 text-slate-400">
              <li>Competitive lending and borrowing rates</li>
              <li>Secure and user-friendly dashboard</li>
              <li>Transparent, on-chain liquidity pools</li>
              <li>Decentralized, non-custodial platform</li>
            </ul>
            <div className="mt-6">
              <p className="text-slate-300 font-semibold">Our Mission</p>
              <p className="text-slate-400">
                Empower users to manage and protect their digital wealth with confidence and ease.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => router.push('/landing')}
                variant="secondary"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full"
              >
                Learn more
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meet the Team Section */}
        <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700 mt-10">
          <CardHeader>
            <CardTitle className="text-white text-xl">Meet the Team</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
              {/* Richard Lei */}
              <div className="flex flex-col items-center text-center flex-1">
                <Image
                  src="/profile/richard.jpg"
                  alt="Richard Lei"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-purple-600 shadow-lg"
                />
                <div className="text-white font-semibold text-lg">Richard Lei</div>
                <div className="text-slate-400 text-sm mb-2">Chief Executive Officer</div>
                <p className="text-slate-400 text-xs">
                  Richard leads NIDUS business and marketing with a vision for transparent, secure, and innovative DeFi lending solutions.
                </p>
              <div className="flex space-x-4 text-gray-300 mt-2">
                <Link href="https://www.linkedin.com/in/richard-lei-01a77118b/" className="hover:text-white" aria-label="LinkedIn">
                  {/* LinkedIn icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v8h-4v-8a2 2 0 00-4 0v8h-4v-8a6 6 0 016-6zM2 9h4v12H2zM4 3a2 2 0 110 4 2 2 0 010-4z"/></svg>
                </Link>
                <Link href="https://github.com/richardleii58" className="hover:text-white" aria-label="GitHub">
                  {/* GitHub icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.49v-1.79c-2.78.6-3.37-1.34-3.37-1.34-.45-1.13-1.11-1.43-1.11-1.43-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.08 2.94.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 7a9.5 9.5 0 012.5.35c1.9-1.29 2.74-1.02 2.74-1.02.55 1.41.2 2.45.1 2.71.64.7 1.03 1.6 1.03 2.68 0 3.86-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .28.18.59.69.49A10 10 0 0012 2z"/></svg>
                </Link>
              </div>
              </div>
              {/* Gabriel Ong */}
              <div className="flex flex-col items-center text-center flex-1">
              <Image
                src="/profile/gabriel.jpg"
                alt="Gabriel Ong"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-purple-600 shadow-lg"
              />
              <div className="text-white font-semibold text-lg">Gabriel Ong</div>
              <div className="text-slate-400 text-sm mb-2">Chief Technology Officer</div>
              <p className="text-slate-400 text-xs">
                Gabriel leads the technical development and engineering at NIDUS, ensuring robust, scalable, and user-focused DeFi infrastructure.
              </p>
              <div className="flex space-x-4 text-gray-300 mt-2">
                <Link href="https://www.linkedin.com/in/gabriel-zmong/" className="hover:text-white" aria-label="LinkedIn">
                  {/* LinkedIn icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v8h-4v-8a2 2 0 00-4 0v8h-4v-8a6 6 0 016-6zM2 9h4v12H2zM4 3a2 2 0 110 4 2 2 0 010-4z"/></svg>
                </Link>
                <Link href="https://github.com/gongahkia" className="hover:text-white" aria-label="GitHub">
                  {/* GitHub icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.49v-1.79c-2.78.6-3.37-1.34-3.37-1.34-.45-1.13-1.11-1.43-1.11-1.43-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.08 2.94.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 7a9.5 9.5 0 012.5.35c1.9-1.29 2.74-1.02 2.74-1.02.55 1.41.2 2.45.1 2.71.64.7 1.03 1.6 1.03 2.68 0 3.86-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .28.18.59.69.49A10 10 0 0012 2z"/></svg>
                </Link>
                <Link href="https://www.gabrielongzm.com" className="hover:text-white" aria-label="Website">
                  {/* Globe icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </Link>
              </div>
            </div> 
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer/>
    </div>
  );
}