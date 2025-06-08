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
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] p-8 flex flex-col gap-6 overflow-hidden"
      >
        <header className="text-center flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Breaking Bad</h1>
          <p className="text-gray-500 text-base">Calculate option prices quickly and accurately.</p>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <OptionCalculator />
        </div>
        
        <footer className="text-center text-xs text-gray-400 flex-shrink-0">
          Made with <span className="text-red-500">❤️</span> by Gabriel Ong and Richard Lei
        </footer>
      </motion.div>
    </div>
  )
}