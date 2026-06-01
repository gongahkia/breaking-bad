"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Import Realtime Database specific functions and the database instance
import { ref, push, set } from "firebase/database"
import { database } from "@/lib/firebase" // Assuming database is exported from lib/firebase.ts

export function JoinForm() {
  const [isPending, setIsPending] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")
  const [dialogTitle, setDialogTitle] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const bitcoinWallet = formData.get("bitcoinWallet") as string

    if (!email || !bitcoinWallet) {
      setDialogTitle("Submission Failed")
      setDialogMessage("Email and Bitcoin Wallet are required.")
      setIsSuccess(false)
      setShowDialog(true)
      setIsPending(false)
      return
    }

    try {
      console.log("Submitting interest:", { email, bitcoinWallet });
      // Use Realtime Database to push new data step-by-step for better debugging
      const submissionsRef = ref(database, "interest_submissions")
      const newSubmissionRef = push(submissionsRef)
      console.log("Firebase push ref key:", newSubmissionRef.key)
      await set(newSubmissionRef, {
        email,
        bitcoinWallet,
        timestamp: Date.now(), // Use Date.now() for Realtime Database timestamp
      })
      console.log("Write succeeded.")
      setDialogTitle("Interest Confirmed!")
      setDialogMessage("Your interest has been successfully recorded!")
      setIsSuccess(true)
      setShowDialog(true)
      try {
        event.currentTarget.reset()
        console.log("Form reset succeeded.")
      } catch (resetError) {
        console.warn("Form reset error:", resetError)
      }
    } catch (error) {
      console.error("Error submitting interest:", error)
      setDialogTitle("Submission Failed")
      setDialogMessage("Failed to record interest. Please try again.")
      setIsSuccess(false)
      setShowDialog(true)
    } finally {
      setIsPending(false)
    }
  }

  const handleDialogClose = () => {
    setShowDialog(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <Label htmlFor="email" className="text-lg">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@example.com"
            required
            className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="bitcoinWallet" className="text-lg">
            Bitcoin Wallet Address
          </Label>
          <Input
            id="bitcoinWallet"
            name="bitcoinWallet"
            type="text"
            placeholder="bc1q..."
            required
            className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Indicate Interest"}
        </Button>
      </form>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className={isSuccess ? "text-green-400" : "text-red-400"}>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose} className="bg-purple-600 hover:bg-purple-700 text-white">
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
