import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Briefcase, GraduationCap, FileText, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default async function AmbassadorDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const jobs = await prisma.job.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const opleidingen = await prisma.opleiding.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const isVerified = user?.isVerified || session.user.role === "ADMIN"
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0) +
    opleidingen.reduce((sum, opleiding) => sum + opleiding.applications.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <div className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mr-4">
                <h1 className="text-lg font-bold text-white">Ambassador</h1>
              </div>
              <Link href="/ambassador/applications">
                <Button variant="ghost" className="hover:bg-gray-100">Applications</Button>
              </Link>
              <Link href="/jobs">
                <Button variant="ghost" className="hover:bg-gray-100">Browse Jobs</Button>
              </Link>
              <Link href="/opleidingen">
                <Button variant="ghost" className="hover:bg-gray-100">Browse Opleidingen</Button>
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
          <p className="text-gray-600 mt-2 text-lg">Manage your job postings and opleidingen</p>
        </div>

        {/* Verification Alert */}
        {!isVerified && (
          <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-yellow-800 font-medium">
                  Your account is pending verification. You'll be able to create postings once verified by an admin.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Jobs Created</CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{jobs.length}</div>
              <p className="text-xs text-gray-600 mt-1">Active job postings</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Opleidingen</CardTitle>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{opleidingen.length}</div>
              <p className="text-xs text-gray-600 mt-1">Training programs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Applications</CardTitle>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{totalApplications}</div>
              <p className="text-xs text-gray-600 mt-1">Total received</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs and Opleidingen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold">Jobs Created</CardTitle>
                  <CardDescription className="text-base">{jobs.length} total jobs</CardDescription>
                </div>
                {isVerified && (
                  <Link href="/ambassador/jobs/new">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="mr-2 h-4 w-4" />
                      New Job
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="text-gray-600 mt-4">No jobs created yet</p>
                  {isVerified && (
                    <Link href="/ambassador/jobs/new">
                      <Button className="mt-4" variant="outline">
                        Create your first job
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <Link href={`/ambassador/jobs/${job.id}`}>
                          <Button variant="outline" size="sm" className="ml-4">
                            Manage
                          </Button>
                        </Link>
                      </div>
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
                  <CardTitle className="text-xl font-bold">Opleidingen Created</CardTitle>
                  <CardDescription className="text-base">{opleidingen.length} total opleidingen</CardDescription>
                </div>
                {isVerified && (
                  <Link href="/ambassador/opleidingen/new">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      <Plus className="mr-2 h-4 w-4" />
                      New Opleiding
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {opleidingen.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="text-gray-600 mt-4">No opleidingen created yet</p>
                  {isVerified && (
                    <Link href="/ambassador/opleidingen/new">
                      <Button className="mt-4" variant="outline">
                        Create your first opleiding
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {opleidingen.map((opleiding) => (
                    <div key={opleiding.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{opleiding.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {opleiding.applications.length} application{opleiding.applications.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <Link href={`/ambassador/opleidingen/${opleiding.id}`}>
                          <Button variant="outline" size="sm" className="ml-4">
                            Manage
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
    </div>
  )
}
