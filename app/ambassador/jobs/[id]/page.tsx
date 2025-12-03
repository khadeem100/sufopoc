"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationList } from "@/components/application-list"
import { Edit, Trash2, Archive, ArchiveRestore, MapPin, Briefcase, Calendar, DollarSign, Building2, Award, CheckCircle, XCircle, Clock, Users, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ApplicationStatus } from "@prisma/client"

interface Job {
  id: string
  title: string
  companyName?: string
  category: string
  jobType?: string
  seniorityLevel?: string
  employmentType?: string
  country?: string
  city?: string
  location?: string
  relocationSupport?: boolean
  visaSponsorship?: boolean
  visaType?: string | null
  housingSupport?: boolean
  relocationPackage?: string | null
  shortDescription?: string
  fullDescription?: string
  description?: string
  responsibilities?: string[]
  requirements?: string[]
  requirements_legacy?: string
  requiredLanguages?: string[]
  optionalSkills?: string[]
  salaryMin: number | null
  salaryMax: number | null
  currency?: string | null
  bonusOptions?: string | null
  extraBenefits?: string[]
  requiredDocuments?: string[]
  interviewRequired?: boolean
  interviewFormat?: string | null
  additionalTests?: string[]
  applicationDeadline?: string | Date | null
  hiringTimeline?: string | null
  startDate?: string | Date | null
  positionsAvailable?: number
  logoUrl?: string | null
  bannerUrl?: string | null
  promoVideoUrl?: string | null
  tags?: string[]
  documents?: string[]
  type?: string
  isExpired: boolean
  createdAt: string | Date
  applications: Array<{
    id: string
    status: ApplicationStatus
    cvUrl: string | null
    coverLetter: string | null
    createdAt: Date
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
        
        // Convert createdAt strings to Date objects
        const applicationsWithDates = applications.map((app: any) => ({
          ...app,
          createdAt: app.createdAt instanceof Date ? app.createdAt : new Date(app.createdAt || Date.now()),
        })) as Array<{
          id: string
          status: ApplicationStatus
          cvUrl: string | null
          coverLetter: string | null
          createdAt: Date
          user: {
            name: string | null
            email: string
          }
        }>
        
        setJob({ 
          ...jobData, 
          createdAt: jobData.createdAt instanceof Date ? jobData.createdAt : new Date(jobData.createdAt || Date.now()),
          applications: applicationsWithDates 
        })
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
        variant: "success",
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
      setJob({ ...job, ...updated })

      toast({
        title: "Success!",
        description: `Job ${updated.isExpired ? "marked as expired" : "reactivated"}`,
        variant: "success",
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Job not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/ambassador">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
          <div className="flex gap-2">
            {job.isExpired && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
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
              className="text-gray-600 hover:text-gray-700"
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
              <CardDescription className="mt-2">
                {job.companyName || "Company not specified"}
              </CardDescription>
              <CardDescription className="flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" />
                {job.city && job.country ? `${job.city}, ${job.country}` : job.location || "Location not specified"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span><span className="font-semibold">Category:</span> {job.category}</span>
                </div>
                {job.jobType && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span><span className="font-semibold">Type:</span> {job.jobType.replace(/-/g, " ")}</span>
                  </div>
                )}
                {job.seniorityLevel && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span><span className="font-semibold">Seniority:</span> {job.seniorityLevel.replace(/-/g, " ")}</span>
                  </div>
                )}
                {job.employmentType && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span><span className="font-semibold">Work Type:</span> {job.employmentType.replace(/-/g, " ")}</span>
                  </div>
                )}
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>
                      <span className="font-semibold">Salary:</span> {job.currency || "EUR"} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                )}
                {job.positionsAvailable && job.positionsAvailable > 1 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span><span className="font-semibold">Positions:</span> {job.positionsAvailable}</span>
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
              {/* Short Description */}
              {job.shortDescription && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.shortDescription}</p>
                </div>
              )}

              {/* Full Description */}
              {job.fullDescription && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.fullDescription}</p>
                </div>
              )}

              {/* Legacy Description (fallback) */}
              {!job.fullDescription && job.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legacy Requirements (fallback) */}
              {(!job.requirements || job.requirements.length === 0) && job.requirements_legacy && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.requirements_legacy}</p>
                </div>
              )}

              {/* Location & Expat Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location & Relocation Support</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {job.relocationSupport ? (
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Relocation support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.visaSponsorship ? (
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Visa sponsorship</span>
                    {job.visaType && <span className="text-xs text-gray-500">({job.visaType})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {job.housingSupport ? (
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Housing support</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {(job.applicationDeadline || job.hiringTimeline || job.startDate) && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {job.hiringTimeline && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Hiring Timeline: {job.hiringTimeline}</span>
                      </div>
                    )}
                    {job.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Start Date: {new Date(job.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
