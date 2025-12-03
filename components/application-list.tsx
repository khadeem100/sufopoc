"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationStatus } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Application {
  id: string
  status: ApplicationStatus
  cvUrl: string | null
  coverLetter: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
}

interface ApplicationListProps {
  applications: Application[]
}

export function ApplicationList({ applications }: ApplicationListProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (applicationId: string, status: ApplicationStatus) => {
    setUpdating(applicationId)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update")

      router.refresh()
    } catch (error) {
      console.error("Update error:", error)
    } finally {
      setUpdating(null)
    }
  }

  if (applications.length === 0) {
    return <p className="text-gray-600">No applications yet</p>
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{app.user.name || app.user.email}</h4>
                <p className="text-sm text-gray-600">{app.user.email}</p>
                {app.cvUrl && (
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:underline mt-2 block"
                  >
                    View CV
                  </a>
                )}
                {app.coverLetter && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{app.coverLetter}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4">
                <Select
                  value={app.status}
                  onValueChange={(value) => updateStatus(app.id, value as ApplicationStatus)}
                  disabled={updating === app.id}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ApplicationStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

