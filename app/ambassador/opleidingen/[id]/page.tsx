"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationList } from "@/components/application-list"
import { Edit, Trash2, Archive, ArchiveRestore, MapPin, GraduationCap, Clock, Globe, Mail, Phone, Calendar, DollarSign, BookOpen, FileText, CheckCircle, XCircle } from "lucide-react"
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

interface Opleiding {
  id: string
  title: string
  partnerCountry?: string
  partnerSchool?: string
  shortDescription?: string
  longDescription?: string
  category: string
  programType?: string
  schoolAddress?: string | null
  schoolCity?: string | null
  schoolCountry?: string | null
  schoolEmail?: string | null
  schoolPhone?: string | null
  schoolWebsite?: string | null
  admissionRequirements?: string
  studyDurationYears?: number | null
  startDate?: string | Date | null
  language?: string
  tuitionFeeYear?: number | null
  scholarships?: string | null
  requiredDocuments?: string[]
  applicationDeadline?: string | Date | null
  processingTime?: string | null
  interviewRequired?: boolean
  intakeFormRequired?: boolean
  additionalTests?: string[]
  thumbnailUrl?: string | null
  bannerUrl?: string | null
  promoVideoUrl?: string | null
  tags?: string[]
  // Legacy fields
  description?: string | null
  requirements?: string | null
  location?: string | null
  duration?: string | null
  isExpired: boolean
  createdAt: string | Date
  applications?: Array<{
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

export default function ManageOpleidingPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [opleiding, setOpleiding] = useState<Opleiding | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Determine dashboard URL based on user role
  const dashboardUrl = session?.user?.role === "ADMIN" ? "/admin" : "/ambassador"

  useEffect(() => {
    const fetchOpleiding = async () => {
      try {
        const response = await fetch(`/api/opleidingen/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch opleiding")
        const opleidingData = await response.json()
        
        // Fetch applications
        const appsResponse = await fetch(`/api/opleidingen/${params.id}/applications`)
        const applications = appsResponse.ok ? await appsResponse.json() : []
        
        // Convert createdAt strings to Date objects - ensure it's always a Date
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
        
        setOpleiding({ ...opleidingData, applications: applicationsWithDates || [] })
      } catch (error) {
        console.error("Error fetching opleiding:", error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchOpleiding()
    }
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/opleidingen/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete opleiding")
      }

      toast({
        title: "Success!",
        description: "Opleiding deleted successfully",
      })

      router.push(dashboardUrl)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete opleiding",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleExpired = async () => {
    if (!opleiding) return
    
    try {
      const response = await fetch(`/api/opleidingen/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isExpired: !opleiding.isExpired }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update opleiding")
      }

      const updated = await response.json()
      setOpleiding(updated)

      toast({
        title: "Success!",
        description: `Opleiding ${updated.isExpired ? "marked as expired" : "reactivated"}`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update opleiding",
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

  if (!opleiding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Opleiding not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={dashboardUrl}>
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
          <div className="flex gap-2">
            {opleiding.isExpired && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Expired
              </span>
            )}
            <Link href={`${dashboardUrl}/opleidingen/${params.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleExpired}
              className={opleiding.isExpired ? "text-gray-600 hover:text-gray-700" : "text-gray-600 hover:text-gray-700"}
            >
              {opleiding.isExpired ? (
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

        {/* Banner Image */}
        {opleiding.bannerUrl && (
          <div className="mb-6 rounded-lg overflow-hidden relative h-64">
            <Image 
              src={opleiding.bannerUrl} 
              alt={opleiding.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Thumbnail if no banner */}
        {opleiding.thumbnailUrl && !opleiding.bannerUrl && (
          <div className="mb-6 rounded-lg overflow-hidden relative h-64">
            <Image 
              src={opleiding.thumbnailUrl} 
              alt={opleiding.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {opleiding.partnerCountry && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <p className="font-medium">{opleiding.partnerCountry}</p>
                {opleiding.schoolCity && <p className="text-sm text-gray-500">{opleiding.schoolCity}</p>}
              </div>
            </div>
          )}
          {opleiding.partnerSchool && (
            <div className="flex items-center text-gray-600">
              <GraduationCap className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <p className="font-medium">{opleiding.partnerSchool}</p>
                <p className="text-sm text-gray-500">{opleiding.category?.replace(/_/g, " ")}</p>
              </div>
            </div>
          )}
          {opleiding.programType && (
            <div className="flex items-center text-gray-600">
              <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <p className="font-medium">{opleiding.programType.replace(/_/g, " ")}</p>
                {opleiding.studyDurationYears && (
                  <p className="text-sm text-gray-500">{opleiding.studyDurationYears} {opleiding.studyDurationYears === 1 ? 'year' : 'years'}</p>
                )}
              </div>
            </div>
          )}
          {opleiding.startDate && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-sm text-gray-500">{new Date(opleiding.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          {opleiding.language && (
            <div className="flex items-center text-gray-600">
              <Globe className="h-5 w-5 mr-2 text-gray-600" />
              <p className="font-medium">{opleiding.language}</p>
            </div>
          )}
          {opleiding.tuitionFeeYear && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <p className="font-medium">Tuition Fee</p>
                <p className="text-sm text-gray-500">€{opleiding.tuitionFeeYear.toLocaleString()}/year</p>
              </div>
            </div>
          )}
        </div>

        {/* Short Description */}
        {opleiding.shortDescription && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.shortDescription}</p>
            </CardContent>
          </Card>
        )}

        {/* Long Description */}
        {opleiding.longDescription && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.longDescription}</p>
            </CardContent>
          </Card>
        )}

        {/* Legacy Description (fallback) */}
        {!opleiding.longDescription && !opleiding.shortDescription && opleiding.description && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.description}</p>
            </CardContent>
          </Card>
        )}

        {/* School Information */}
        {(opleiding.schoolAddress || opleiding.schoolEmail || opleiding.schoolPhone || opleiding.schoolWebsite) && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {opleiding.schoolAddress && (
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-600" />
                    <p>{opleiding.schoolAddress}</p>
                  </div>
                )}
                {opleiding.schoolEmail && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 mr-2 text-gray-600" />
                    <a href={`mailto:${opleiding.schoolEmail}`} className="hover:underline">
                      {opleiding.schoolEmail}
                    </a>
                  </div>
                )}
                {opleiding.schoolPhone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-2 text-gray-600" />
                    <a href={`tel:${opleiding.schoolPhone}`} className="hover:underline">
                      {opleiding.schoolPhone}
                    </a>
                  </div>
                )}
                {opleiding.schoolWebsite && (
                  <div className="flex items-center text-gray-700">
                    <Globe className="h-5 w-5 mr-2 text-gray-600" />
                    <a href={opleiding.schoolWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600">
                      {opleiding.schoolWebsite}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admission Requirements */}
        {opleiding.admissionRequirements && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Admission Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {opleiding.admissionRequirements}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legacy Requirements (fallback) */}
        {!opleiding.admissionRequirements && opleiding.requirements && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.requirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Study Details */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {opleiding.processingTime && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{opleiding.processingTime}</p>
              </CardContent>
            </Card>
          )}
          {opleiding.applicationDeadline && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Application Deadline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{new Date(opleiding.applicationDeadline).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Required Documents */}
        {opleiding.requiredDocuments && opleiding.requiredDocuments.length > 0 && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {opleiding.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Additional Tests */}
        {opleiding.additionalTests && opleiding.additionalTests.length > 0 && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Additional Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {opleiding.additionalTests.map((test, index) => (
                  <li key={index}>{test}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Scholarships */}
        {opleiding.scholarships && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Scholarships</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.scholarships}</p>
            </CardContent>
          </Card>
        )}

        {/* Application Process */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {opleiding.interviewRequired ? (
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">Interview Required</span>
              </div>
              <div className="flex items-center gap-2">
                {opleiding.intakeFormRequired ? (
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">Intake Form Required</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {opleiding.tags && opleiding.tags.length > 0 && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {opleiding.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Promo Video */}
        {opleiding.promoVideoUrl && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Promotional Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                <iframe
                  src={opleiding.promoVideoUrl}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Applications ({opleiding.applications?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationList applications={opleiding.applications || []} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Opleiding</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{opleiding.title}&quot;? This action cannot be undone and will also delete all associated applications.
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
