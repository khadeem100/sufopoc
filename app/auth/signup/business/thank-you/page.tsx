"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function BusinessThankYouPage() {
  const router = useRouter()

  // Auto redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-center">Thank You for Registering!</CardTitle>
          <CardDescription className="text-center">
            Your business account is being reviewed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              We&apos;ve received your business registration and sent a notification to our team for verification.
            </p>
            <p className="text-gray-600 text-center">
              You&apos;ll receive an email once your account has been approved.
            </p>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Redirecting to home page in 10 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
