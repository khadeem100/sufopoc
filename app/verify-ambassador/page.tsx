"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const otpSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
  email: z.string().email("Please enter your email to verify"),
})

type OtpFormData = z.infer<typeof otpSchema>

export default function VerifyAmbassadorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  })

  const onSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Verification failed")
      }

      setIsVerified(true)
      toast({
        title: "Verified!",
        description: "Your account is now fully verified as an Ambassador.",
      })
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/ambassador")
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isVerified) {
    return (
      <>
        <PageHeader />
        <div className="container mx-auto py-10 px-4 flex justify-center">
          <Card className="max-w-md w-full text-center py-10">
            <CardContent>
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verification Successful!</h2>
              <p className="text-gray-600 mb-6">
                You are now a verified Ambassador. You can now access your dashboard and post jobs.
              </p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader />
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Verify Account</CardTitle>
            <CardDescription>
              Enter your email and the 6-digit verification code sent to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input 
                  id="code" 
                  {...register("code")} 
                  placeholder="123456" 
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
