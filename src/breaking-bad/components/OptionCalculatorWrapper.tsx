"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import OptionCalculator from "./option-calculator"
import { styles } from "../styles/design-system"

export default function OptionCalculatorWrapper() {
  return (
    <div className={styles.layout.container}>
      {/* Fixed Header */}
      <header className={styles.layout.header}>
        <h1 className={styles.typography.h1}>Option Calculator</h1>
        <p className={styles.typography.subtitle}>Calculate option prices and analyze trading strategies</p>
      </header>

      {/* Main Content */}
      <main className={styles.layout.main}>
        <div className={styles.layout.content}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OptionCalculator />
          </motion.div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className={styles.layout.footer}>
        <p>© 2024 Option Calculator. All rights reserved.</p>
      </footer>
    </div>
  )
}