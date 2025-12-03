import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Calendar, DollarSign, Building2, Globe, CheckCircle, XCircle, Clock, FileText, Award, Users, Plane, Home, Car } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { ApplyButton } from "@/components/apply-button"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  // Check if user has already applied
  let existingApplication = null
  if (session?.user) {
    existingApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        jobId: params.id,
      },
      select: {
        id: true,
        status: true,
      },
    })
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs">
          <Button variant="ghost" className="mb-4">← Back to Jobs</Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{job.title}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {job.companyName} • Posted by {job.createdBy.name || "Unknown"}
                </CardDescription>
              </div>
              {session?.user ? (
                session.user.role === "STUDENT" || session.user.role === "EXPERT" ? (
                  <ApplyButton 
                    jobId={job.id} 
                    userId={session.user.id}
                    existingApplication={existingApplication}
                  />
                ) : (
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Only students and experts can apply for jobs.</p>
                    <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(`/jobs/${job.id}`)}&role=STUDENT`}>
                      <Button variant="outline" size="sm">Create Student Account</Button>
                    </Link>
                  </div>
                )
              ) : (
                <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(`/jobs/${job.id}`)}&role=STUDENT`}>
                  <Button>Sign Up to Apply</Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Banner Image */}
            {job.bannerUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={job.bannerUrl} 
                  alt={job.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Company Logo */}
            {job.logoUrl && (
              <div className="mb-6 flex items-center gap-4">
                <img 
                  src={job.logoUrl} 
                  alt={job.companyName}
                  className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-semibold">{job.companyName}</h3>
                </div>
              </div>
            )}

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="font-medium">{job.city}, {job.country}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="font-medium">{job.category}</p>
                  <p className="text-sm text-gray-500">{job.jobType?.replace(/-/g, " ") || job.type?.replace(/_/g, " ")}</p>
                </div>
              </div>
              {job.seniorityLevel && (
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-2 text-gray-600" />
                  <p className="font-medium">{job.seniorityLevel.replace(/-/g, " ")}</p>
                </div>
              )}
              {job.employmentType && (
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-2 text-gray-600" />
                  <p className="font-medium">{job.employmentType.replace(/-/g, " ")}</p>
                </div>
              )}
              {job.salaryMin && job.salaryMax && (
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <p className="font-medium">
                      {job.currency || "EUR"} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                    </p>
                    {job.positionsAvailable > 1 && (
                      <p className="text-sm text-gray-500">{job.positionsAvailable} positions available</p>
                    )}
                  </div>
                </div>
              )}
              {job.startDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-gray-500">{new Date(job.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Short Description */}
            {job.shortDescription && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.shortDescription}</p>
              </div>
            )}

            {/* Full Description */}
            {job.fullDescription && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.fullDescription}</p>
              </div>
            )}

            {/* Legacy Description (fallback) */}
            {!job.fullDescription && job.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Requirements / Qualifications</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legacy Requirements (fallback) */}
            {(!job.requirements || job.requirements.length === 0) && job.requirements_legacy && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.requirements_legacy}</p>
              </div>
            )}

            {/* Required Languages */}
            {job.requiredLanguages && job.requiredLanguages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Required Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredLanguages.map((lang, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Skills */}
            {job.optionalSkills && job.optionalSkills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Optional Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.optionalSkills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Expat Details */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Location & Relocation Support</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {job.relocationSupport ? (
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-700">Relocation support provided</span>
                </div>
                <div className="flex items-center gap-2">
                  {job.visaSponsorship ? (
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-700">Visa/work permit sponsorship</span>
                  {job.visaType && (
                    <span className="text-sm text-gray-500">({job.visaType})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {job.housingSupport ? (
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-700">Housing support provided</span>
                </div>
                {job.relocationPackage && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Relocation Package</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.relocationPackage}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Salary & Benefits */}
            {(job.salaryMin || job.bonusOptions || (job.extraBenefits && job.extraBenefits.length > 0)) && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Salary & Benefits</h3>
                <div className="space-y-3">
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">
                        {job.currency || "EUR"} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} per year
                      </span>
                    </div>
                  )}
                  {job.bonusOptions && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Bonus Options</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{job.bonusOptions}</p>
                    </div>
                  )}
                  {job.extraBenefits && job.extraBenefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Additional Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {job.extraBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {benefit === "Health insurance" && <FileText className="h-4 w-4 text-gray-600" />}
                            {benefit === "Paid relocation" && <Plane className="h-4 w-4 text-gray-600" />}
                            {benefit === "Flight reimbursement" && <Plane className="h-4 w-4 text-gray-600" />}
                            {benefit === "Company housing" && <Home className="h-4 w-4 text-gray-600" />}
                            {benefit === "Transportation allowance" && <Car className="h-4 w-4 text-gray-600" />}
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Requirements */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Application Requirements</h3>
              <div className="space-y-3">
                {job.requiredDocuments && job.requiredDocuments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Required Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredDocuments.map((doc, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {job.interviewRequired ? (
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-700">Interview required</span>
                  {job.interviewRequired && job.interviewFormat && (
                    <span className="text-sm text-gray-500">({job.interviewFormat})</span>
                  )}
                </div>
                {job.additionalTests && job.additionalTests.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Additional Tests</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.additionalTests.map((test, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline & Process */}
            {(job.applicationDeadline || job.hiringTimeline || job.startDate) && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Timeline & Process</h3>
                <div className="space-y-2">
                  {job.applicationDeadline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">
                        Application Deadline: <strong>{new Date(job.applicationDeadline).toLocaleDateString()}</strong>
                      </span>
                    </div>
                  )}
                  {job.hiringTimeline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">
                        Expected Hiring Timeline: <strong>{job.hiringTimeline}</strong>
                      </span>
                    </div>
                  )}
                  {job.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">
                        Start Date: <strong>{new Date(job.startDate).toLocaleDateString()}</strong>
                      </span>
                    </div>
                  )}
                  {job.positionsAvailable > 1 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">
                        <strong>{job.positionsAvailable}</strong> positions available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {job.documents && job.documents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Related Documents</h3>
                <div className="space-y-2">
                  {job.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 underline"
                    >
                      <FileText className="h-4 w-4" />
                      {doc}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Video */}
            {job.promoVideoUrl && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Video Introduction</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={job.promoVideoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
