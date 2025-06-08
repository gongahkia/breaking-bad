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
    <div className="font-sans antialiased bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] text-gray-900 min-h-screen flex flex-col">
      <header className="py-10 bg-gradient-to-r from-[#f1f5f9] to-[#e0e7ef] shadow-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
              Breaking Bad
            </h1>
            <p className="text-gray-500 text-lg font-medium">
              Calculate option prices quickly and accurately.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          <div className="rounded-3xl bg-white/90 p-10 shadow-2xl border border-gray-100">
            <OptionCalculator />
          </div>
        </motion.div>
      </main>

      <footer className="py-6 bg-gradient-to-r from-[#f1f5f9] to-[#e0e7ef] border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500"
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
                Richard Lei
              </a>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}