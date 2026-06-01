"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-900/80 dark:bg-slate-900/80 border-t border-slate-800 dark:border-slate-800 mt-8 text-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
            <div>
              <h3 className="font-semibold mb-2 text-slate-300">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about-nidus" className="text-slate-400 hover:text-purple-300 transition-colors">About us</Link>
                </li>
                <li>
                  <Link href="/help-support" className="text-slate-400 hover:text-purple-300 transition-colors">Contact us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-slate-300">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/product-guide" className="text-slate-400 hover:text-purple-300 transition-colors">Product Guide</Link>
                </li>
                <li>
                  <Link href="/docs/developer-guide" className="text-slate-400 hover:text-purple-300 transition-colors">Developer Guide</Link>
                </li>
                <li>
                  <Link href="/help" className="text-slate-400 hover:text-purple-300 transition-colors">Help Center</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-slate-300">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-slate-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-slate-400 hover:text-purple-300 transition-colors">Service Agreement</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 mt-8 mb-4">
          NIDUS is a next-generation decentralized lending platform bringing transparency, security, and flexibility to digital asset protection and yield generation.
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-200">NIDUS</span>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-block">
              <span className="inline-block bg-slate-800 text-white rounded p-1 text-xs font-bold" style={{fontSize:'1rem'}}>in</span>
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-block">
              <span className="inline-block bg-slate-800 text-white rounded p-1 text-xs font-bold" style={{fontSize:'1rem'}}>G</span>
            </a>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} NIDUS Pte. Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
