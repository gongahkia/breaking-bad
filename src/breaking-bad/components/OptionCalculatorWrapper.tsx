"use client";

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const OptionCalculator = dynamic(() => import('../components/option-calculator'), { ssr: false })

export default function OptionCalculatorWrapper() {
  return (
    <div className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-center">
            Option Calculator
          </h1>
          <p className="text-gray-600 text-center mt-1">
            Calculate option prices quickly and accurately.
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6">
          <OptionCalculator />
        </div>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Made with love by <a href="https://github.com/gongahkia" className="text-blue-500 hover:underline">Gabriel Ong</a> and <a href="https://github.com/richardleii58" className="text-blue-500 hover:underline">Richard Lim</a>
        </div>
      </footer>
    </div>
  )
}