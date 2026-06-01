"use client"

import React from "react"

export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(30, 41, 59, 0.75)", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        borderRadius: "inherit",
        pointerEvents: "all",
      }}
    >
      <span className="text-white text-lg font-semibold drop-shadow-lg">{children}</span>
    </div>
  )
}