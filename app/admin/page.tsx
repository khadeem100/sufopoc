import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Briefcase, GraduationCap, CheckCircle, XCircle, Plus, FileText, TrendingUp, AlertCircle } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const [users, jobs, opleidingen, applications, pendingAmbassadors] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.opleiding.count(),
    prisma.application.count(),
    prisma.user.findMany({
      where: {
        role: "AMBASSADOR",
        isVerified: false,
      },
    }),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-4">
                <h1 className="text-lg font-bold text-white">Admin</h1>
              </div>
              <Link href="/admin/applications">
                <Button variant="ghost" className="hover:bg-gray-100">Applications</Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" className="hover:bg-gray-100">Users</Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="ghost" className="hover:bg-gray-100">Jobs</Button>
              </Link>
              <Link href="/admin/opleidingen">
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
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Manage and monitor your platform</p>
        </div>

        {/* Stats Grid with Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{users}</div>
              <p className="text-xs text-gray-600 mt-1">Active accounts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Total Jobs</CardTitle>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{jobs}</div>
              <p className="text-xs text-gray-600 mt-1">Job postings</p>
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
              <div className="text-4xl font-bold text-gray-900">{opleidingen}</div>
              <p className="text-xs text-gray-600 mt-1">Training programs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Applications</CardTitle>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{applications}</div>
              <p className="text-xs text-gray-600 mt-1">Total submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Ambassadors Alert */}
        {pendingAmbassadors.length > 0 && (
          <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Ambassador Verifications</CardTitle>
                  <CardDescription className="text-base font-medium text-yellow-800">
                    {pendingAmbassadors.length} ambassador{pendingAmbassadors.length > 1 ? 's' : ''} awaiting verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingAmbassadors.map((ambassador) => (
                  <div key={ambassador.id} className="flex justify-between items-center p-4 bg-white/60 rounded-lg border border-yellow-200/50">
                    <div>
                      <h4 className="font-semibold text-gray-900">{ambassador.name}</h4>
                      <p className="text-sm text-gray-600">{ambassador.email}</p>
                      {ambassador.region && (
                        <p className="text-sm text-gray-500 mt-1">📍 {ambassador.region}</p>
                      )}
                    </div>
                    <form action="/api/admin/verify-ambassador" method="POST">
                      <input type="hidden" name="userId" value={ambassador.id} />
                      <Button type="submit" size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions with Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <Link href="/admin/applications">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </div>
                <CardDescription>View all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  View All
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <Link href="/admin/users">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Users</CardTitle>
                </div>
                <CardDescription>Manage all users</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Manage Users
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <Link href="/admin/jobs">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Jobs</CardTitle>
                </div>
                <CardDescription>Manage job postings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/jobs">
                  <Button className="w-full" variant="outline">
                    View Jobs
                  </Button>
                </Link>
                <Link href="/ambassador/jobs/new">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                  </Button>
                </Link>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <Link href="/admin/opleidingen">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Opleidingen</CardTitle>
                </div>
                <CardDescription>Manage training programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/opleidingen">
                  <Button className="w-full" variant="outline">
                    View All
                  </Button>
                </Link>
                <Link href="/ambassador/opleidingen/new">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Opleiding
                  </Button>
                </Link>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
