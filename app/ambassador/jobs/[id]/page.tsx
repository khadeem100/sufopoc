"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationList } from "@/components/application-list"
import { Edit, Trash2, Archive, ArchiveRestore, MapPin, Briefcase, Calendar, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  salaryMin: number | null
  salaryMax: number | null
  type: string
  category: string
  isExpired: boolean
  createdAt: string
  applications: Array<{
    id: string
    status: string
    cvUrl: string | null
    coverLetter: string | null
    createdAt: string
    user: {
      name: string | null
      email: string
    }
  }>
}

export default function ManageJobPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch job")
        const jobData = await response.json()
        
        // Fetch applications
        const appsResponse = await fetch(`/api/jobs/${params.id}/applications`)
        const applications = appsResponse.ok ? await appsResponse.json() : []
        
        setJob({ ...jobData, applications })
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete job")
      }

      toast({
        title: "Success!",
        description: "Job deleted successfully",
      })

      router.push("/ambassador")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleExpired = async () => {
    if (!job) return
    
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isExpired: !job.isExpired }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update job")
      }

      const updated = await response.json()
      setJob(updated)

      toast({
        title: "Success!",
        description: `Job ${updated.isExpired ? "marked as expired" : "reactivated"}`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Job not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/ambassador">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
          <div className="flex gap-2">
            {job.isExpired && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Expired
              </span>
            )}
            <Link href={`/ambassador/jobs/${params.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleExpired}
              className={job.isExpired ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
            >
              {job.isExpired ? (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Reactivate
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Mark Expired
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" />
                {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span><span className="font-semibold">Category:</span> {job.category.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span><span className="font-semibold">Type:</span> {job.type.replace(/_/g, " ")}</span>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span><span className="font-semibold">Salary:</span> ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Applications ({job.applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationList applications={job.applications} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{job.title}"? This action cannot be undone and will also delete all associated applications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
