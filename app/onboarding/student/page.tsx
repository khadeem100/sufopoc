"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { JobCategory } from "@prisma/client"

const steps = [
  { id: 1, title: "CV Upload" },
  { id: 2, title: "Skills" },
  { id: 3, title: "Education" },
  { id: 4, title: "Experience" },
  { id: 5, title: "Interests" },
]

export default function StudentOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    cvUrl: "",
    skills: [] as string[],
    skillInput: "",
    education: { degree: "", institution: "", year: "" },
    experience: { company: "", position: "", duration: "", description: "" },
    interests: [] as JobCategory[],
  })
  const [loading, setLoading] = useState(false)

  const addSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: "",
      })
    }
  }

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    })
  }

  const toggleInterest = (category: JobCategory) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(category)
        ? formData.interests.filter((c) => c !== category)
        : [...formData.interests, category],
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/onboarding/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvUrl: formData.cvUrl,
          skills: formData.skills,
          education: formData.education,
          experience: formData.experience,
          interests: formData.interests,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      router.push("/student")
      router.refresh()
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
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
          <CardTitle>Student Onboarding</CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
          <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cvUrl">CV URL</Label>
                <Input
                  id="cvUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.cvUrl}
                  onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.skillInput}
                    onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill"
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
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

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={formData.education.degree}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, degree: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.education.institution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, institution: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.education.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, year: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.experience.company}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: { ...formData.experience, company: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.experience.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: { ...formData.experience, position: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.experience.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: { ...formData.experience, duration: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.experience.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: { ...formData.experience, description: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <Label>Select your interests (job categories)</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(JobCategory).map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={formData.interests.includes(category) ? "default" : "outline"}
                    onClick={() => toggleInterest(category)}
                  >
                    {category.replace(/_/g, " ")}
                  </Button>
                ))}
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

