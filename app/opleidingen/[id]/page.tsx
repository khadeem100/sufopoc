import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, GraduationCap, Clock, Globe, Mail, Phone, Calendar, DollarSign, BookOpen, FileText, CheckCircle, XCircle } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { ApplyOpleidingButton } from "@/components/apply-opleiding-button"

export default async function OpleidingDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const opleiding = await prisma.opleiding.findUnique({
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
        opleidingId: params.id,
      },
      select: {
        id: true,
        status: true,
      },
    })
  }

  if (!opleiding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Opleiding not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/opleidingen">
          <Button variant="ghost" className="mb-4">← Back to Opleidingen</Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{opleiding.title}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Posted by {opleiding.createdBy.name || "Unknown"}
                </CardDescription>
              </div>
              {session?.user ? (
                session.user.role === "STUDENT" || session.user.role === "EXPERT" ? (
                  <ApplyOpleidingButton 
                    opleidingId={opleiding.id} 
                    userId={session.user.id}
                    existingApplication={existingApplication}
                  />
                ) : (
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Only students and experts can apply for opleidingen.</p>
                    <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(`/opleidingen/${opleiding.id}`)}&role=STUDENT`}>
                      <Button variant="outline" size="sm">Create Student Account</Button>
                    </Link>
                  </div>
                )
              ) : (
                <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(`/opleidingen/${opleiding.id}`)}&role=STUDENT`}>
                  <Button>Sign Up to Apply</Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
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

            {/* Thumbnail */}
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
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="font-medium">{opleiding.partnerCountry}</p>
                  {opleiding.schoolCity && <p className="text-sm text-gray-500">{opleiding.schoolCity}</p>}
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <GraduationCap className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="font-medium">{opleiding.partnerSchool}</p>
                  <p className="text-sm text-gray-500">{opleiding.category}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="font-medium">{opleiding.programType.replace(/_/g, " ")}</p>
                  {opleiding.studyDurationYears && (
                    <p className="text-sm text-gray-500">{opleiding.studyDurationYears} {opleiding.studyDurationYears === 1 ? 'year' : 'years'}</p>
                  )}
                </div>
              </div>
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
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{opleiding.shortDescription}</p>
              </div>
            )}

            {/* Long Description */}
            {opleiding.longDescription && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{opleiding.longDescription}</p>
              </div>
            )}

            {/* School Information */}
            {(opleiding.schoolAddress || opleiding.schoolEmail || opleiding.schoolPhone || opleiding.schoolWebsite) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">School Information</h3>
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
              </div>
            )}

            {/* Admission Requirements */}
            {opleiding.admissionRequirements && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Admission Requirements</h3>
                <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {opleiding.admissionRequirements}
                </div>
              </div>
            )}

            {/* Study Details */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {opleiding.processingTime && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-1">Processing Time</h4>
                  <p className="text-gray-700">{opleiding.processingTime}</p>
                </div>
              )}
              {opleiding.applicationDeadline && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-1">Application Deadline</h4>
                  <p className="text-gray-700">{new Date(opleiding.applicationDeadline).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Required Documents */}
            {opleiding.requiredDocuments && opleiding.requiredDocuments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Required Documents</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {opleiding.requiredDocuments.map((doc, index) => (
                    <li key={index}>{doc.replace(/_/g, " ")}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Tests */}
            {opleiding.additionalTests && opleiding.additionalTests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Additional Tests</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {opleiding.additionalTests.map((test, index) => (
                    <li key={index}>{test}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scholarships */}
            {opleiding.scholarships && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Scholarships & Financial Aid</h3>
                <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {opleiding.scholarships}
                </div>
              </div>
            )}

            {/* Application Process Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Application Process</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  {opleiding.interviewRequired ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-600" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  <span className={opleiding.interviewRequired ? "text-gray-700" : "text-gray-500"}>
                    Interview Required
                  </span>
                </div>
                <div className="flex items-center">
                  {opleiding.intakeFormRequired ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-600" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  <span className={opleiding.intakeFormRequired ? "text-gray-700" : "text-gray-500"}>
                    Intake Form Required
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {opleiding.tags && opleiding.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {opleiding.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Video */}
            {opleiding.promoVideoUrl && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Promotional Video</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={opleiding.promoVideoUrl}
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

