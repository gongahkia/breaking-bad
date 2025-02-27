import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Breaking Bad | Option Pricing Calculator",
  description: "Calculate option prices quickly and accurately with our neumorphic design calculator.",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="min-h-screen flex flex-col">
          <header className="py-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-md">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-center">Breaking Bad</h1>
              <p className="text-center text-gray-600 dark:text-gray-400">Option Pricing Calculator</p>
            </div>
          </header>

          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

          <footer className="py-6 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-inner">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Breaking Bad. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}