import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, FileText, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { LogoutButton } from "@/components/logout-button"

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "STUDENT") {
    redirect("/")
  }

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

  const opleidingen = await prisma.opleiding.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Student Dashboard</h1>
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
          <h2 className="text-3xl font-bold text-black">Welcome back, {session.user.name}!</h2>
          <p className="text-gray-600 mt-2">Manage your applications and discover opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job and training applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-gray-600">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {app.job?.title || app.opleiding?.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Status: <span className="capitalize">{app.status.toLowerCase()}</span>
                          </p>
                        </div>
                        <Link
                          href={app.job ? `/jobs/${app.job.id}` : `/opleidingen/${app.opleiding?.id}`}
                        >
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started quickly</CardDescription>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Jobs</CardTitle>
              <CardDescription>New opportunities for you</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="text-gray-600">No jobs available</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border-b pb-4 last:border-0">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest Opleidingen</CardTitle>
              <CardDescription>New training opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              {opleidingen.length === 0 ? (
                <p className="text-gray-600">No opleidingen available</p>
              ) : (
                <div className="space-y-4">
                  {opleidingen.map((opleiding) => (
                    <div key={opleiding.id} className="border-b pb-4 last:border-0">
                      <h4 className="font-semibold">{opleiding.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {opleiding.category.replace(/_/g, " ")}
                      </p>
                      <Link href={`/opleidingen/${opleiding.id}`}>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

