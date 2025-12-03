"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ApplicationStatus } from "@prisma/client"

interface ApplyOpleidingButtonProps {
  opleidingId: string
  userId: string
  existingApplication?: {
    id: string
    status: ApplicationStatus
  } | null
}

export function ApplyOpleidingButton({ opleidingId, userId, existingApplication }: ApplyOpleidingButtonProps) {
  const [open, setOpen] = useState(false)
  const [cvUrl, setCvUrl] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)
  const [userCvUrl, setUserCvUrl] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  // Fetch user's saved CV URL
  useEffect(() => {
    const fetchUserCv = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/cv`)
        if (response.ok) {
          const data = await response.json()
          if (data.cvUrl) {
            setUserCvUrl(data.cvUrl)
            setCvUrl(data.cvUrl)
          }
        }
      } catch (error) {
        // Silently fail - CV URL is optional
      }
    }
    fetchUserCv()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opleidingId,
          userId,
          cvUrl,
          coverLetter,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application")
      }

      setOpen(false)
      setCoverLetter("")
      toast({
        title: "Application submitted!",
        description: "Your application has been successfully submitted.",
      })
      router.refresh()
    } catch (error) {
      console.error("Application error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (existingApplication) {
    return (
      <Button disabled variant="outline">
        Applied - {existingApplication.status.replace(/_/g, " ")}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Apply Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for this Training</DialogTitle>
          <DialogDescription>
            Fill in your details to apply for this opleiding
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cvUrl">CV URL {userCvUrl && "(from profile)"}</Label>
            <Input
              id="cvUrl"
              type="url"
              placeholder="https://..."
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
            />
            {userCvUrl && (
              <p className="text-xs text-gray-500">
                Using your saved CV URL. You can override it above.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're interested..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

