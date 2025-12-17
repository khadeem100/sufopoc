"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Construction",
  "Transportation",
  "Media",
  "Other",
]

export default function BusinessOnboarding() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bio: "",
    industry: "",
    employeeCount: "",
    companyWebsite: "",
    companyLogo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/onboarding/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to complete onboarding")
      }

      // Update session to reflect onboarding completion
      await update({
        ...session,
        user: {
          ...session?.user,
        },
      })

      // Redirect to business dashboard
      router.push("/business")
      router.refresh()
    } catch (error) {
      console.error("Onboarding error:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Business Profile Setup</CardTitle>
          <CardDescription className="text-center">
            Complete your business profile to start posting jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Company Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your company..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                type="url"
                placeholder="https://company.com"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo URL</Label>
              <Input
                id="companyLogo"
                type="url"
                placeholder="https://company.com/logo.png"
                value={formData.companyLogo}
                onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
