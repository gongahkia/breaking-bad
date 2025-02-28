"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"

const OptionCalculator = dynamic(() => import("./option-calculator"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 animate-pulse"></div>
      </div>
    </div>
  ),
})

export default function OptionCalculatorWrapper() {
  return (
    <div className="font-sans antialiased bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      <header className="py-8 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Breaking Bad</h1>
            <p className="text-gray-600 text-lg">Calculate option prices quickly and accurately.</p>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl bg-white p-8 shadow-[10px_10px_20px_rgba(0,0,0,0.1),-10px_-10px_20px_rgba(255,255,255,0.8)]">
            <OptionCalculator />
          </div>
        </motion.div>
      </main>

      <footer className="py-6 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            <p>
              Made with <span className="text-red-500">❤️</span> by{" "}
              <a
                href="https://github.com/gongahkia"
                className="text-blue-600 hover:underline font-medium transition-colors"
              >
                Gabriel Ong
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/richardleii58"
                className="text-blue-600 hover:underline font-medium transition-colors"
              >
                Richard Lim
              </a>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}