"use client"

import React, { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X, AlertCircle } from "lucide-react"

const JOB_TYPES = ["full-time", "part-time", "contract", "internship", "freelance"]
const SENIORITY_LEVELS = ["junior", "mid-level", "senior", "lead"]
const EMPLOYMENT_TYPES = ["on-site", "hybrid", "remote"]
const CURRENCIES = ["EUR", "USD", "GBP", "SEK", "NOK", "DKK", "PLN", "CZK"]

export default function NewBusinessJobPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVerified, setIsVerified] = useState(true) // Default to true to avoid flash

  // Check if business is verified
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await fetch("/api/business/verification")
        const data = await response.json()
        
        if (!data.verified) {
          setError("Your business account is not yet verified. Please wait for admin approval before posting jobs.")
          setIsVerified(false)
        }
      } catch (error) {
        console.error("Error checking verification:", error)
        setError("Error checking account verification status.")
      }
    }
    
    if (status === "authenticated" && session?.user) {
      checkVerification()
    }
  }, [session, status, router])
  
  const [formData, setFormData] = useState({
    // Basic job info
    title: "",
    category: "",
    jobType: "",
    seniorityLevel: "",
    employmentType: "",

    // Location
    country: "",
    city: "",

    // Job description
    shortDescription: "",
    fullDescription: "",
    responsibilities: [] as string[],
    requirements: [] as string[],

    // Salary
    salaryMin: "",
    salaryMax: "",
    currency: "",

    // Application requirements
    requiredDocuments: [] as string[],

    // Process timeline
    applicationDeadline: "",
    positionsAvailable: "1",

    // Internal
    isVisible: true,
  })

  const [newResponsibility, setNewResponsibility] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newDocument, setNewDocument] = useState("")

  const addItem = (field: string, value: string, setter: (val: string) => void) => {
    const fieldValue = formData[field as keyof typeof formData]
    if (value.trim() && Array.isArray(fieldValue) && !fieldValue.includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...fieldValue, value.trim()],
      })
      setter("")
    }
  }

  const removeItem = (field: string, index: number) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])]
    newArray.splice(index, 1)
    setFormData({ ...formData, [field]: newArray })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent submission if not verified
    if (!isVerified) {
      setError("Your business account is not yet verified. Please wait for admin approval before posting jobs.")
      return
    }
    
    setLoading(true)
    setError("")

    // Validation
    if (!formData.title || !formData.category || !formData.jobType || 
        !formData.seniorityLevel || !formData.employmentType || !formData.country || 
        !formData.city || !formData.shortDescription || !formData.fullDescription) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
          salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
          positionsAvailable: parseInt(formData.positionsAvailable) || 1,
          applicationDeadline: formData.applicationDeadline || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create job")
      }

      toast({
        title: "Success!",
        description: "Job created successfully",
        variant: "success",
      })

      router.push("/business/jobs")
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create job. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/business/jobs">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Job</CardTitle>
            <CardDescription>
              Post a new job opportunity for candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerified && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Account Not Verified</h3>
                  <p className="text-sm">Your business account is pending verification. You cannot post jobs until your account is approved by an administrator.</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {error && error !== "Your business account is not yet verified. Please wait for admin approval before posting jobs." && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g., Healthcare, IT, Engineering"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jobType">Job Type *</Label>
                        <Select
                          value={formData.jobType}
                          onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seniorityLevel">Seniority Level *</Label>
                        <Select
                          value={formData.seniorityLevel}
                          onValueChange={(value) => setFormData({ ...formData, seniorityLevel: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select seniority" />
                          </SelectTrigger>
                          <SelectContent>
                            {SENIORITY_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1).replace("-", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employmentType">Employment Type *</Label>
                        <Select
                          value={formData.employmentType}
                          onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent>
                            {EMPLOYMENT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Job Description</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">Short Description *</Label>
                      <Textarea
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullDescription">Full Job Description *</Label>
                      <Textarea
                        id="fullDescription"
                        value={formData.fullDescription}
                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Responsibilities</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newResponsibility}
                          onChange={(e) => setNewResponsibility(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addItem("responsibilities", newResponsibility, setNewResponsibility)
                            }
                          }}
                          placeholder="Add responsibility"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("responsibilities", newResponsibility, setNewResponsibility)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.responsibilities.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeItem("responsibilities", idx)}
                              className="hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Requirements</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addItem("requirements", newRequirement, setNewRequirement)
                            }
                          }}
                          placeholder="Add requirement"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("requirements", newRequirement, setNewRequirement)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requirements.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeItem("requirements", idx)}
                              className="hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Salary (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Minimum Salary</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Maximum Salary</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((curr) => (
                            <SelectItem key={curr} value={curr}>
                              {curr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Application Requirements */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Application Requirements</h3>
                  <div className="space-y-2">
                    <Label>Required Documents</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("requiredDocuments", newDocument, setNewDocument)
                          }
                        }}
                        placeholder="e.g., CV, Cover Letter, Diploma"
                      />
                      <Button
                        type="button"
                        onClick={() => addItem("requiredDocuments", newDocument, setNewDocument)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.requiredDocuments.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItem("requiredDocuments", idx)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="applicationDeadline">Application Deadline (Optional)</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="positionsAvailable">Number of Positions</Label>
                    <Input
                      id="positionsAvailable"
                      type="number"
                      min="1"
                      value={formData.positionsAvailable}
                      onChange={(e) => setFormData({ ...formData, positionsAvailable: e.target.value })}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Job"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
