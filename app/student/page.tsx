import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, FileText, LogOut, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react"
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

  const statusCounts = {
    submitted: applications.filter(a => a.status === "SUBMITTED").length,
    viewed: applications.filter(a => a.status === "VIEWED").length,
    interview: applications.filter(a => a.status === "INTERVIEW").length,
    accepted: applications.filter(a => a.status === "ACCEPTED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED": return <Clock className="h-4 w-4 text-blue-600" />
      case "VIEWED": return <FileText className="h-4 w-4 text-yellow-600" />
      case "INTERVIEW": return <CheckCircle2 className="h-4 w-4 text-purple-600" />
      case "ACCEPTED": return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "REJECTED": return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-blue-100 text-blue-800"
      case "VIEWED": return "bg-yellow-100 text-yellow-800"
      case "INTERVIEW": return "bg-purple-100 text-purple-800"
      case "ACCEPTED": return "bg-green-100 text-green-800"
      case "REJECTED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg mr-4">
                <h1 className="text-lg font-bold text-white">Student</h1>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" className="hover:bg-gray-100">Jobs</Button>
              </Link>
              <Link href="/opleidingen">
                <Button variant="ghost" className="hover:bg-gray-100">Opleidingen</Button>
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back, {session.user.name}!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Discover opportunities and track your applications</p>
        </div>

        {/* Application Stats */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{statusCounts.submitted}</div>
                <p className="text-xs text-gray-600 mt-1">Submitted</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.viewed}</div>
                <p className="text-xs text-gray-600 mt-1">Viewed</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">{statusCounts.interview}</div>
                <p className="text-xs text-gray-600 mt-1">Interview</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
                <p className="text-xs text-gray-600 mt-1">Accepted</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                <p className="text-xs text-gray-600 mt-1">Rejected</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Applications */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Applications</CardTitle>
              <CardDescription>Your latest job and training applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-300" />
                  <p className="text-gray-600 mt-4 font-medium">No applications yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start applying to jobs and opleidingen</p>
                  <Link href="/jobs">
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(app.status)}
                            <h4 className="font-semibold text-gray-900">
                              {app.job?.title || app.opleiding?.title}
                            </h4>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status.replace(/_/g, " ")}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={app.job ? `/jobs/${app.job.id}` : `/opleidingen/${app.opleiding?.id}`}>
                          <Button variant="outline" size="sm" className="ml-4">
                            View
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
              <CardDescription>Get started quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/jobs">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" size="lg">
                  <Briefcase className="mr-3 h-5 w-5" />
                  Browse Jobs
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/opleidingen">
                <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" size="lg">
                  <GraduationCap className="mr-3 h-5 w-5" />
                  Browse Trainings
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Latest Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold">Latest Jobs</CardTitle>
                  <CardDescription>New opportunities for you</CardDescription>
                </div>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No jobs available</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="mt-3">
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold">Latest Opleidingen</CardTitle>
                  <CardDescription>New training opportunities</CardDescription>
                </div>
                <Link href="/opleidingen">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {opleidingen.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No opleidingen available</p>
              ) : (
                <div className="space-y-3">
                  {opleidingen.map((opleiding) => (
                    <div key={opleiding.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200">
                      <h4 className="font-semibold text-gray-900">{opleiding.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {opleiding.category.replace(/_/g, " ")}
                      </p>
                      <Link href={`/opleidingen/${opleiding.id}`}>
                        <Button variant="outline" size="sm" className="mt-3">
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
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
