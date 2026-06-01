"use client"

export function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
      <div className="relative bg-slate-900 border border-purple-600 rounded-lg shadow-lg px-6 py-6 min-w-[320px] max-w-[90vw]">
        <button className="absolute top-2 right-3 text-xl text-slate-400" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}