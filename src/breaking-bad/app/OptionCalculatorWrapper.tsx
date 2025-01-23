"use client";

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const OptionCalculator = dynamic(() => import('./option-calculator'), { ssr: false })

export default function OptionCalculatorWrapper() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
    >
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">Option Calculator</h1>
      <OptionCalculator />
    </motion.div>
  )
}