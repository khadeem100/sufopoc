"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Plus, X, ArrowLeft, ArrowRight } from "lucide-react"

const JOB_TYPES = ["full-time", "part-time", "contract", "internship", "freelance"]
const SENIORITY_LEVELS = ["junior", "mid-level", "senior", "lead"]
const EMPLOYMENT_TYPES = ["on-site", "hybrid", "remote"]
const CURRENCIES = ["EUR", "USD", "GBP", "SEK", "NOK", "DKK", "PLN", "CZK"]
const INTERVIEW_FORMATS = ["online", "physical"]
const REQUIRED_DOCUMENTS_OPTIONS = [
  "Passport",
  "CV",
  "Motivation letter",
  "Diploma",
  "Skills certificate",
]
const EXTRA_BENEFITS_OPTIONS = [
  "Health insurance",
  "Paid relocation",
  "Flight reimbursement",
  "Company housing",
  "Transportation allowance",
]

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    // Basic job info
    title: "",
    companyName: "",
    category: "",
    jobType: "",
    seniorityLevel: "",
    employmentType: "",

    // Location & expat-specific
    country: "",
    city: "",
    relocationSupport: false,
    visaSponsorship: false,
    visaType: "",
    housingSupport: false,
    relocationPackage: "",

    // Job description details
    shortDescription: "",
    fullDescription: "",
    responsibilities: [] as string[],
    requirements: [] as string[],
    requiredLanguages: [] as string[],
    optionalSkills: [] as string[],

    // Salary & benefits
    salaryMin: "",
    salaryMax: "",
    currency: "",
    bonusOptions: "",
    extraBenefits: [] as string[],

    // Application requirements
    requiredDocuments: [] as string[],
    interviewRequired: false,
    interviewFormat: "",
    additionalTests: [] as string[],

    // Process timeline
    applicationDeadline: "",
    hiringTimeline: "",
    startDate: "",
    positionsAvailable: "1",

    // Media
    logoUrl: "",
    bannerUrl: "",
    promoVideoUrl: "",

    // Internal
    isVisible: true,
    tags: [] as string[],
    documents: [] as string[],
  })

  const [newResponsibility, setNewResponsibility] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newTest, setNewTest] = useState("")
  const [newDocument, setNewDocument] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch job")
        const job = await response.json()
        
        // Format dates for input fields
        const formatDate = (date: string | Date | null) => {
          if (!date) return ""
          const d = new Date(date)
          return d.toISOString().split('T')[0]
        }

        setFormData({
          title: job.title || "",
          companyName: job.companyName || "",
          category: job.category || "",
          jobType: job.jobType || "",
          seniorityLevel: job.seniorityLevel || "",
          employmentType: job.employmentType || "",
          country: job.country || "",
          city: job.city || "",
          relocationSupport: job.relocationSupport || false,
          visaSponsorship: job.visaSponsorship || false,
          visaType: job.visaType || "",
          housingSupport: job.housingSupport || false,
          relocationPackage: job.relocationPackage || "",
          shortDescription: job.shortDescription || "",
          fullDescription: job.fullDescription || "",
          responsibilities: job.responsibilities || [],
          requirements: job.requirements || [],
          requiredLanguages: job.requiredLanguages || [],
          optionalSkills: job.optionalSkills || [],
          salaryMin: job.salaryMin?.toString() || "",
          salaryMax: job.salaryMax?.toString() || "",
          currency: job.currency || "",
          bonusOptions: job.bonusOptions || "",
          extraBenefits: job.extraBenefits || [],
          requiredDocuments: job.requiredDocuments || [],
          interviewRequired: job.interviewRequired || false,
          interviewFormat: job.interviewFormat || "",
          additionalTests: job.additionalTests || [],
          applicationDeadline: formatDate(job.applicationDeadline),
          hiringTimeline: job.hiringTimeline || "",
          startDate: formatDate(job.startDate),
          positionsAvailable: job.positionsAvailable?.toString() || "1",
          logoUrl: job.logoUrl || "",
          bannerUrl: job.bannerUrl || "",
          promoVideoUrl: job.promoVideoUrl || "",
          isVisible: job.isVisible !== undefined ? job.isVisible : true,
          tags: job.tags || [],
          documents: job.documents || [],
        })
      } catch (error) {
        setError("Failed to load job data")
      } finally {
        setFetching(false)
      }
    }
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

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

  const toggleArrayItem = (field: string, value: string) => {
    const current = formData[field as keyof typeof formData] as string[]
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((item) => item !== value) })
    } else {
      setFormData({ ...formData, [field]: [...current, value] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
          salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
          positionsAvailable: parseInt(formData.positionsAvailable) || 1,
          visaType: formData.visaType || null,
          relocationPackage: formData.relocationPackage || null,
          currency: formData.currency || null,
          bonusOptions: formData.bonusOptions || null,
          interviewFormat: formData.interviewFormat || null,
          hiringTimeline: formData.hiringTimeline || null,
          logoUrl: formData.logoUrl || null,
          bannerUrl: formData.bannerUrl || null,
          promoVideoUrl: formData.promoVideoUrl || null,
          applicationDeadline: formData.applicationDeadline || null,
          startDate: formData.startDate || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update job")
      }

      toast({
        title: "Success!",
        description: "Job updated successfully",
        variant: "success",
      })

      router.push(`/ambassador/jobs/${params.id}`)
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update job. Please try again."
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

  if (!mounted || fetching) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const totalSteps = 6

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/ambassador/jobs/${params.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Job</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps}: {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Location & Expat Details"}
              {currentStep === 3 && "Job Description"}
              {currentStep === 4 && "Salary & Benefits"}
              {currentStep === 5 && "Application Requirements"}
              {currentStep === 6 && "Media & Final Details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
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

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
              )}

              {/* Step 2: Location & Expat Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
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

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="relocationSupport"
                        checked={formData.relocationSupport}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, relocationSupport: checked as boolean })
                        }
                      />
                      <Label htmlFor="relocationSupport">Does the company provide relocation support?</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visaSponsorship"
                        checked={formData.visaSponsorship}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, visaSponsorship: checked as boolean })
                        }
                      />
                      <Label htmlFor="visaSponsorship">Does the company sponsor visas/work permits?</Label>
                    </div>

                    {formData.visaSponsorship && (
                      <div className="space-y-2">
                        <Label htmlFor="visaType">Type of visa provided</Label>
                        <Input
                          id="visaType"
                          value={formData.visaType}
                          onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                          placeholder="e.g., EU Blue Card, Work Permit"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="housingSupport"
                        checked={formData.housingSupport}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, housingSupport: checked as boolean })
                        }
                      />
                      <Label htmlFor="housingSupport">Is housing support provided?</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relocationPackage">Relocation Package Description</Label>
                      <Textarea
                        id="relocationPackage"
                        value={formData.relocationPackage}
                        onChange={(e) => setFormData({ ...formData, relocationPackage: e.target.value })}
                        rows={4}
                        placeholder="Describe the relocation package..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Job Description */}
              {currentStep === 3 && (
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
                      rows={8}
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
                    <Label>Requirements / Qualifications</Label>
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

                  <div className="space-y-2">
                    <Label>Required Languages</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("requiredLanguages", newLanguage, setNewLanguage)
                          }
                        }}
                        placeholder="e.g., English B2, Dutch A2"
                      />
                      <Button
                        type="button"
                        onClick={() => addItem("requiredLanguages", newLanguage, setNewLanguage)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.requiredLanguages.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItem("requiredLanguages", idx)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Optional Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("optionalSkills", newSkill, setNewSkill)
                          }
                        }}
                        placeholder="Add skill"
                      />
                      <Button
                        type="button"
                        onClick={() => addItem("optionalSkills", newSkill, setNewSkill)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.optionalSkills.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItem("optionalSkills", idx)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Salary & Benefits */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Salary Minimum</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Salary Maximum</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="bonusOptions">Bonus Options</Label>
                    <Textarea
                      id="bonusOptions"
                      value={formData.bonusOptions}
                      onChange={(e) => setFormData({ ...formData, bonusOptions: e.target.value })}
                      rows={3}
                      placeholder="Describe bonus options..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Benefits</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {EXTRA_BENEFITS_OPTIONS.map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-2">
                          <Checkbox
                            id={`benefit-${benefit}`}
                            checked={formData.extraBenefits.includes(benefit)}
                            onCheckedChange={() => toggleArrayItem("extraBenefits", benefit)}
                          />
                          <Label htmlFor={`benefit-${benefit}`} className="text-sm font-normal">
                            {benefit}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Application Requirements */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Required Documents</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {REQUIRED_DOCUMENTS_OPTIONS.map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                          <Checkbox
                            id={`doc-${doc}`}
                            checked={formData.requiredDocuments.includes(doc)}
                            onCheckedChange={() => toggleArrayItem("requiredDocuments", doc)}
                          />
                          <Label htmlFor={`doc-${doc}`} className="text-sm font-normal">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interviewRequired"
                      checked={formData.interviewRequired}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, interviewRequired: checked as boolean })
                      }
                    />
                    <Label htmlFor="interviewRequired">Interview required?</Label>
                  </div>

                  {formData.interviewRequired && (
                    <div className="space-y-2">
                      <Label htmlFor="interviewFormat">Interview Format</Label>
                      <Select
                        value={formData.interviewFormat}
                        onValueChange={(value) => setFormData({ ...formData, interviewFormat: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          {INTERVIEW_FORMATS.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format.charAt(0).toUpperCase() + format.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Additional Tests</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTest}
                        onChange={(e) => setNewTest(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("additionalTests", newTest, setNewTest)
                          }
                        }}
                        placeholder="e.g., Language test, Technical test"
                      />
                      <Button
                        type="button"
                        onClick={() => addItem("additionalTests", newTest, setNewTest)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.additionalTests.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItem("additionalTests", idx)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicationDeadline">Application Deadline</Label>
                      <Input
                        id="applicationDeadline"
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hiringTimeline">Expected Hiring Timeline</Label>
                      <Input
                        id="hiringTimeline"
                        value={formData.hiringTimeline}
                        onChange={(e) => setFormData({ ...formData, hiringTimeline: e.target.value })}
                        placeholder="e.g., 3-6 weeks"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="positionsAvailable">Number of Available Positions</Label>
                      <Input
                        id="positionsAvailable"
                        type="number"
                        min="1"
                        value={formData.positionsAvailable}
                        onChange={(e) => setFormData({ ...formData, positionsAvailable: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Media & Final Details */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Company Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bannerUrl">Banner Image URL</Label>
                    <Input
                      id="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promoVideoUrl">Promo Video URL (Optional)</Label>
                    <Input
                      id="promoVideoUrl"
                      value={formData.promoVideoUrl}
                      onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("tags", newTag, setNewTag)
                          }
                        }}
                        placeholder="Add tag"
                      />
                      <Button
                        type="button"
                        onClick={() => addItem("tags", newTag, setNewTag)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItem("tags", idx)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Documents (PDF URLs)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("documents", newDocument, setNewDocument)
                          }
                        }}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        onClick={() => addItem("documents", newDocument, setNewDocument)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.documents.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItem("documents", idx)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVisible"
                      checked={formData.isVisible}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isVisible: checked as boolean })
                      }
                    />
                    <Label htmlFor="isVisible">Job visibility (visible on website)</Label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                    className="bg-black hover:bg-gray-800"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800">
                    {loading ? "Updating..." : "Update Job"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
