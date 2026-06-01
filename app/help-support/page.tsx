"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export default function HelpSupportPage() {
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
              <Link href="/about-nidus" className="text-slate-300 hover:text-purple-300 transition-colors">
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
            <HelpCircle className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white">Help &amp; Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Welcome to NIDUS Help &amp; Support. Here you can find answers to frequently asked questions and contact our support team for more assistance.
            </p>
            <ul className="list-disc ml-5 text-slate-400">
              <li>How to use your dashboard and manage your portfolio</li>
              <li>Troubleshooting common issues</li>
            </ul>
            <div className="mt-6">
              <p className="text-slate-300 font-semibold">Need more help?</p>
              <p className="text-slate-400">
                Contact us at{" "}
                <a href="mailto:nidussg@gmail.com" className="text-purple-400 underline">
                  nidussg@gmail.com
                </a>{" "}
                or use the in-app chat for real-time assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}