import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Calendar, DollarSign } from "lucide-react"
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
                  Posted by {job.createdBy.name || "Unknown"}
                </CardDescription>
              </div>
              {session?.user && (session.user.role === "STUDENT" || session.user.role === "EXPERT") && (
                <ApplyButton jobId={job.id} userId={session.user.id} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-5 w-5 mr-2" />
                {job.category.replace(/_/g, " ")}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                {job.type.replace(/_/g, " ")}
              </div>
              {job.salaryMin && job.salaryMax && (
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2" />
                  ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

