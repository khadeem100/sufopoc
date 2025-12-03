"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    // Sign out and redirect to home page
    signOut({ callbackUrl: "/", redirect: true })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  )
}

