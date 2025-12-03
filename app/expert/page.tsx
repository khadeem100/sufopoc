import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, LogOut } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default async function ExpertDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "EXPERT") {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: { title: true, id: true },
      },
      opleiding: {
        select: { title: true, id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Expert Dashboard</h1>
              <Link href="/jobs">
                <Button variant="ghost">Jobs</Button>
              </Link>
              <Link href="/opleidingen">
                <Button variant="ghost">Opleidingen</Button>
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black">Welcome, {session.user.name}!</h2>
          <p className="text-gray-600 mt-2">Expert profile and opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Experience:</span> {user?.yearsOfExperience || 0} years
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Expertise:</span> {user?.expertise?.length || 0} areas
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Portfolio:</span> {user?.portfolioLinks?.length || 0} links
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>{applications.length} total</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-gray-600 text-sm">No applications yet</p>
              ) : (
                <div className="space-y-2">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="text-sm">
                      <p className="font-semibold">
                        {app.job?.title || app.opleiding?.title}
                      </p>
                      <p className="text-gray-600 capitalize">{app.status.toLowerCase()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/jobs">
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/opleidingen">
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Browse Trainings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Latest Job Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="text-gray-600">No jobs available</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

