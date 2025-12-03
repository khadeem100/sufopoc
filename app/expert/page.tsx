import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, LogOut, ArrowRight, Award, Link2, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED": return <Clock className="h-4 w-4 text-blue-600" />
      case "VIEWED": return <Briefcase className="h-4 w-4 text-yellow-600" />
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
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg mr-4">
                <h1 className="text-lg font-bold text-white">Expert</h1>
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
            Welcome, {session.user.name}!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Expert profile and opportunities</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Experience</CardTitle>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{user?.yearsOfExperience || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Years of experience</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Expertise</CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{user?.expertise?.length || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Areas of expertise</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Portfolio</CardTitle>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Link2 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{user?.portfolioLinks?.length || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Portfolio links</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Applications */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Applications</CardTitle>
              <CardDescription>{applications.length} total applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-16 w-16 text-gray-300" />
                  <p className="text-gray-600 mt-4 font-medium">No applications yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start applying to opportunities</p>
                  <Link href="/jobs">
                    <Button className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all duration-200">
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
              <CardDescription>Explore opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/jobs">
                <Button className="w-full justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" size="lg">
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

        {/* Latest Job Opportunities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">Latest Job Opportunities</CardTitle>
                <CardDescription>New opportunities matching your expertise</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="mt-3 w-full">
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
  )
}
