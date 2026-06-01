"use client"

import { toast as sonnerToast } from "sonner"

// Generic Sonner toast hook
export function useToast() {
  return { toast: sonnerToast }
}

// DeFi-specific toast utilities for Nidus core
export function useNidusToast() {
  return {
    // Transaction success toast
    transactionSuccess: (message: string, txHash?: string) => {
      sonnerToast.success(
        <>
          ✅ Transaction Successful
          <br />
          {message}
          {txHash && (
            <>
              <br />
              <button
                onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, "_blank")}
                className="text-sm text-green-400 hover:text-green-300 underline"
              >
                View on Explorer
              </button>
            </>
          )}
        </>
      )
    },

    // Transaction error toast
    transactionError: (message: string) => {
      sonnerToast.error(
        <>
          ❌ Transaction Failed
          <br />
          {message}
        </>
      )
    },

    // Transaction pending toast
    transactionPending: (message: string) => {
      sonnerToast(
        <>
          ⏳ Transaction Pending
          <br />
          {message}
        </>,
        { duration: 30000 }
      )
    },

    // Wallet connection toast
    walletConnected: (address: string) => {
      sonnerToast.success(
        <>
          🔗 Wallet Connected
          <br />
          Connected to {address.slice(0, 6)}...{address.slice(-4)}
        </>
      )
    },

    // Wallet disconnection toast
    walletDisconnected: () => {
      sonnerToast("🔌 Wallet Disconnected", {
        description: "Your wallet has been disconnected"
      })
    },

    // NFT minted toast
    nftMinted: (tokenId: string, asset: string) => {
      sonnerToast(
        <>
          🎨 NFT Minted
          <br />
          {asset} NFT #{tokenId} has been credited to your wallet
        </>
      )
    },

    // Yield earned toast
    yieldEarned: (amount: string, asset: string) => {
      sonnerToast(
        <>
          💰 Yield Earned
          <br />
          You&apos;ve earned {amount} {asset} in yield rewards
        </>
      )
    },

    // Position liquidation warning
    liquidationWarning: (healthFactor: number) => {
      sonnerToast.error(
        <>
          ⚠️ Liquidation Risk
          <br />
          Your health factor is {healthFactor.toFixed(2)}. Consider adding collateral.
        </>
      )
    },

    // Market update toast
    marketUpdate: (message: string) => {
      sonnerToast(
        <>
          📊 Market Update
          <br />
          {message}
        </>
      )
    },

    // Generic success toast
    success: (title: string, description?: string) => {
      sonnerToast.success(
        <>
          ✅ {title}
          {description && (
            <>
              <br />
              {description}
            </>
          )}
        </>
      )
    },

    // Generic error toast
    error: (title: string, description?: string) => {
      sonnerToast.error(
        <>
          ❌ {title}
          {description && (
            <>
              <br />
              {description}
            </>
          )}
        </>
      )
    },

    // Generic info toast
    info: (title: string, description?: string) => {
      sonnerToast(
        <>
          ℹ️ {title}
          {description && (
            <>
              <br />
              {description}
            </>
          )}
        </>
      )
    },
  }
}

// For direct Sonner usage if needed
export { sonnerToast as toast }