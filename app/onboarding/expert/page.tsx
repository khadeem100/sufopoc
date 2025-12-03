"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

const steps = [
  { id: 1, title: "Expertise" },
  { id: 2, title: "Portfolio" },
  { id: 3, title: "Experience" },
  { id: 4, title: "Preferences" },
]

export default function ExpertOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    expertise: [] as string[],
    expertiseInput: "",
    portfolioLinks: [] as string[],
    portfolioInput: "",
    yearsOfExperience: "",
    jobPreferences: { remote: false, location: "", salaryMin: "" },
  })
  const [loading, setLoading] = useState(false)

  const addExpertise = () => {
    if (formData.expertiseInput.trim()) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, formData.expertiseInput.trim()],
        expertiseInput: "",
      })
    }
  }

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index),
    })
  }

  const addPortfolio = () => {
    if (formData.portfolioInput.trim()) {
      setFormData({
        ...formData,
        portfolioLinks: [...formData.portfolioLinks, formData.portfolioInput.trim()],
        portfolioInput: "",
      })
    }
  }

  const removePortfolio = (index: number) => {
    setFormData({
      ...formData,
      portfolioLinks: formData.portfolioLinks.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/onboarding/expert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertise: formData.expertise,
          portfolioLinks: formData.portfolioLinks,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          jobPreferences: formData.jobPreferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save")
      }

      // Show success message
      toast({
        title: "Onboarding voltooid!",
        description: "Je profiel is succesvol aangemaakt. Je wordt doorgestuurd naar je dashboard.",
      })

      // Wait a moment to show the success message, then redirect
      setTimeout(() => {
        router.push("/expert")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Onboarding error:", error)
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Expert Onboarding</CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
          <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Expertise/Qualifications</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.expertiseInput}
                    onChange={(e) => setFormData({ ...formData, expertiseInput: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                    placeholder="Add expertise"
                  />
                  <Button type="button" onClick={addExpertise}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.expertise.map((exp, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="text-gray-500 hover:text-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Portfolio Links</Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={formData.portfolioInput}
                    onChange={(e) => setFormData({ ...formData, portfolioInput: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolio())}
                    placeholder="https://..."
                  />
                  <Button type="button" onClick={addPortfolio}>
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => removePortfolio(index)}
                        className="text-gray-500 hover:text-black"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="years">Years of Experience</Label>
                <Input
                  id="years"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Preferred Location</Label>
                <Input
                  id="location"
                  value={formData.jobPreferences.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jobPreferences: { ...formData.jobPreferences, location: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.jobPreferences.salaryMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jobPreferences: { ...formData.jobPreferences, salaryMin: e.target.value },
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={formData.jobPreferences.remote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jobPreferences: { ...formData.jobPreferences, remote: e.target.checked },
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="remote">Open to remote work</Label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={nextStep} disabled={loading}>
              {currentStep === steps.length ? (loading ? "Saving..." : "Complete") : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

