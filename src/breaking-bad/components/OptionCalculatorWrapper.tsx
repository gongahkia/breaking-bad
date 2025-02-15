"use client";

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const OptionCalculator = dynamic(() => import('../components/option-calculator'), { ssr: false })

export default function OptionCalculatorWrapper() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-indigo-600 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-white">
            Breaking Bad
          </h1>
          <p className="mt-2 text-center text-indigo-200">
            Calculate option prices for you since 2024.
          </p>
        </div>
        <div className="p-6 sm:p-10">
          <OptionCalculator />
        </div>
      </motion.div>
    </motion.div>
  )
}