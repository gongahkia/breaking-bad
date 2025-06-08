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
    <div className="w-screen h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Fixed Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-6 bg-white shadow-sm border-b border-gray-200 flex-shrink-0"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Breaking Bad</h1>
        <p className="text-gray-500 text-base">Calculate option prices quickly and accurately.</p>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 bg-white shadow-2xl m-4 rounded-3xl overflow-hidden"
      >
        <div className="h-full p-8">
          <OptionCalculator />
        </div>
      </motion.div>

      {/* Fixed Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4 bg-white border-t border-gray-200 text-xs text-gray-400 flex-shrink-0"
      >
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
      </motion.footer>
    </div>
  )
}