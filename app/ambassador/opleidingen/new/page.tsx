"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ProgramType } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, X } from "lucide-react"

const PROGRAM_TYPES = Object.values(ProgramType)
const REQUIRED_DOCUMENTS_OPTIONS = [
  "Paspoort",
  "Diploma's",
  "Transcript of Records",
  "Aanbevelingsbrief",
  "Motivatiebrief",
  "CV",
]

export default function NewOpleidingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basis informatie
    title: "",
    partnerCountry: "",
    partnerSchool: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    programType: "" as ProgramType | "",

    // School & Land informatie
    schoolAddress: "",
    schoolCity: "",
    schoolCountry: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolWebsite: "",
    admissionRequirements: "",

    // Studie details
    studyDurationYears: "",
    startDate: "",
    language: "",
    tuitionFeeYear: "",
    scholarships: "",
    requiredDocuments: [] as string[],

    // Application process
    applicationDeadline: "",
    processingTime: "",
    interviewRequired: false,
    intakeFormRequired: false,
    additionalTests: [] as string[],

    // Media
    thumbnailUrl: "",
    bannerUrl: "",
    promoVideoUrl: "",

    // Extra
    isVisible: true,
    tags: [] as string[],
    documents: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [newDocument, setNewDocument] = useState("")
  const [newTest, setNewTest] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const addDocument = () => {
    if (newDocument.trim() && !formData.documents.includes(newDocument.trim())) {
      setFormData({ ...formData, documents: [...formData.documents, newDocument.trim()] })
      setNewDocument("")
    }
  }

  const removeDocument = (doc: string) => {
    setFormData({ ...formData, documents: formData.documents.filter((d) => d !== doc) })
  }

  const addTest = () => {
    if (newTest.trim() && !formData.additionalTests.includes(newTest.trim())) {
      setFormData({ ...formData, additionalTests: [...formData.additionalTests, newTest.trim()] })
      setNewTest("")
    }
  }

  const removeTest = (test: string) => {
    setFormData({ ...formData, additionalTests: formData.additionalTests.filter((t) => t !== test) })
  }

  const toggleRequiredDocument = (doc: string) => {
    if (formData.requiredDocuments.includes(doc)) {
      setFormData({
        ...formData,
        requiredDocuments: formData.requiredDocuments.filter((d) => d !== doc),
      })
    } else {
      setFormData({
        ...formData,
        requiredDocuments: [...formData.requiredDocuments, doc],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate required fields
    if (!formData.title || !formData.partnerCountry || !formData.partnerSchool || 
        !formData.shortDescription || !formData.longDescription || !formData.category || 
        !formData.programType || !formData.admissionRequirements || !formData.language) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (!formData.thumbnailUrl) {
      setError("Thumbnail URL is required")
      setLoading(false)
      return
    }

    try {
      // Clean up data - convert empty strings to null
      const cleanedData = {
        ...formData,
        studyDurationYears: formData.studyDurationYears ? parseInt(formData.studyDurationYears) : null,
        tuitionFeeYear: formData.tuitionFeeYear ? parseFloat(formData.tuitionFeeYear) : null,
        startDate: formData.startDate && formData.startDate !== "" ? formData.startDate : null,
        applicationDeadline: formData.applicationDeadline && formData.applicationDeadline !== "" ? formData.applicationDeadline : null,
        schoolAddress: formData.schoolAddress || null,
        schoolCity: formData.schoolCity || null,
        schoolCountry: formData.schoolCountry || null,
        schoolEmail: formData.schoolEmail && formData.schoolEmail !== "" ? formData.schoolEmail : null,
        schoolPhone: formData.schoolPhone || null,
        schoolWebsite: formData.schoolWebsite && formData.schoolWebsite !== "" ? formData.schoolWebsite : null,
        scholarships: formData.scholarships || null,
        processingTime: formData.processingTime || null,
        bannerUrl: formData.bannerUrl && formData.bannerUrl !== "" ? formData.bannerUrl : null,
        promoVideoUrl: formData.promoVideoUrl && formData.promoVideoUrl !== "" ? formData.promoVideoUrl : null,
      }

      const response = await fetch("/api/opleidingen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.details 
          ? `${data.error}: ${JSON.stringify(data.details)}`
          : data.error || "Failed to create opleiding"
        throw new Error(errorMsg)
      }

      toast({
        title: "Success!",
        description: "Opleiding created successfully",
      })

      router.push("/ambassador")
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create opleiding. Please try again."
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

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/ambassador">
          <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Opleiding</CardTitle>
            <CardDescription>Step {currentStep} of 5</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Step 1: Basis Informatie */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basis Informatie</h3>
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel van de opleiding *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="partnerCountry">Partnerland *</Label>
                      <Input
                        id="partnerCountry"
                        value={formData.partnerCountry}
                        onChange={(e) => setFormData({ ...formData, partnerCountry: e.target.value })}
                        placeholder="bijv. Zweden, Portugal, Canada"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="partnerSchool">Partner-school naam *</Label>
                      <Input
                        id="partnerSchool"
                        value={formData.partnerSchool}
                        onChange={(e) => setFormData({ ...formData, partnerSchool: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Korte toelichting *</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Uitgebreide omschrijving *</Label>
                    <Textarea
                      id="longDescription"
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categorie *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="bijv. ICT, Zorg, Engineering"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="programType">Type opleiding *</Label>
                      <Select
                        value={formData.programType}
                        onValueChange={(value) => setFormData({ ...formData, programType: value as ProgramType })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROGRAM_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: School & Land Informatie */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">School & Land Informatie</h3>
                  <div className="space-y-2">
                    <Label htmlFor="schoolAddress">School adres</Label>
                    <Textarea
                      id="schoolAddress"
                      value={formData.schoolAddress}
                      onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolCity">Stad</Label>
                      <Input
                        id="schoolCity"
                        value={formData.schoolCity}
                        onChange={(e) => setFormData({ ...formData, schoolCity: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolCountry">Land</Label>
                      <Input
                        id="schoolCountry"
                        value={formData.schoolCountry}
                        onChange={(e) => setFormData({ ...formData, schoolCountry: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolWebsite">Website URL</Label>
                    <Input
                      id="schoolWebsite"
                      type="url"
                      value={formData.schoolWebsite}
                      onChange={(e) => setFormData({ ...formData, schoolWebsite: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolEmail">Contact email</Label>
                      <Input
                        id="schoolEmail"
                        type="email"
                        value={formData.schoolEmail}
                        onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolPhone">Contact telefoon</Label>
                      <Input
                        id="schoolPhone"
                        value={formData.schoolPhone}
                        onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admissionRequirements">Toelatingseisen *</Label>
                    <Textarea
                      id="admissionRequirements"
                      value={formData.admissionRequirements}
                      onChange={(e) => setFormData({ ...formData, admissionRequirements: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Studie Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Studie Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studyDurationYears">Studieduur in jaren</Label>
                      <Input
                        id="studyDurationYears"
                        type="number"
                        min="1"
                        value={formData.studyDurationYears}
                        onChange={(e) => setFormData({ ...formData, studyDurationYears: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Startdatum</Label>
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
                      <Label htmlFor="language">Taal van de opleiding *</Label>
                      <Input
                        id="language"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        placeholder="Nederlands/Engels/anders"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tuitionFeeYear">Collegegeld per jaar</Label>
                      <Input
                        id="tuitionFeeYear"
                        type="number"
                        step="0.01"
                        value={formData.tuitionFeeYear}
                        onChange={(e) => setFormData({ ...formData, tuitionFeeYear: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scholarships">Eventuele beurzen of subsidies</Label>
                    <Textarea
                      id="scholarships"
                      value={formData.scholarships}
                      onChange={(e) => setFormData({ ...formData, scholarships: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Benodigde documenten voor aanmelding</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {REQUIRED_DOCUMENTS_OPTIONS.map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                          <Checkbox
                            id={doc}
                            checked={formData.requiredDocuments.includes(doc)}
                            onCheckedChange={() => toggleRequiredDocument(doc)}
                          />
                          <Label htmlFor={doc} className="text-sm font-normal cursor-pointer">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Application Process */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Application Process</h3>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Deadline voor aanmelding</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingTime">Verwachte verwerkingstijd</Label>
                    <Input
                      id="processingTime"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                      placeholder="bijv. 4-8 weken"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interviewRequired"
                      checked={formData.interviewRequired}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, interviewRequired: checked as boolean })
                      }
                    />
                    <Label htmlFor="interviewRequired" className="cursor-pointer">
                      Interview verplicht?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="intakeFormRequired"
                      checked={formData.intakeFormRequired}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, intakeFormRequired: checked as boolean })
                      }
                    />
                    <Label htmlFor="intakeFormRequired" className="cursor-pointer">
                      Intake formulier nodig?
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Eventuele extra tests (IELTS, TOEFL, etc.)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTest}
                        onChange={(e) => setNewTest(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTest())}
                        placeholder="Voeg test toe"
                      />
                      <Button type="button" onClick={addTest} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.additionalTests.map((test) => (
                        <span
                          key={test}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center gap-1"
                        >
                          {test}
                          <button
                            type="button"
                            onClick={() => removeTest(test)}
                            className="hover:text-blue-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Media & Extra */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Media & Extra</h3>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail foto URL *</Label>
                    <Input
                      id="thumbnailUrl"
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bannerUrl">Banner afbeelding URL</Label>
                    <Input
                      id="bannerUrl"
                      type="url"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promoVideoUrl">Promo video URL</Label>
                    <Input
                      id="promoVideoUrl"
                      type="url"
                      value={formData.promoVideoUrl}
                      onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Voeg tag toe"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Documenten (PDF URLs)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDocument())}
                        placeholder="Voeg document URL toe"
                      />
                      <Button type="button" onClick={addDocument} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.documents.map((doc) => (
                        <span
                          key={doc}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm flex items-center gap-1"
                        >
                          {doc.substring(0, 30)}...
                          <button
                            type="button"
                            onClick={() => removeDocument(doc)}
                            className="hover:text-green-600"
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
                    <Label htmlFor="isVisible" className="cursor-pointer">
                      Is zichtbaar op de website
                    </Label>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {currentStep < 5 ? (
                    <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      {loading ? "Creating..." : "Create Opleiding"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
