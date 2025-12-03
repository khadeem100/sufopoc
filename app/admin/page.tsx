import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Briefcase, GraduationCap, CheckCircle, XCircle, Plus, FileText } from "lucide-react"
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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <Link href="/admin/applications">
                <Button variant="ghost">Applications</Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost">Users</Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="ghost">Jobs</Button>
              </Link>
              <Link href="/admin/opleidingen">
                <Button variant="ghost">Opleidingen</Button>
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage the platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{jobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Opleidingen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{opleidingen}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Ambassadors */}
        {pendingAmbassadors.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pending Ambassador Verifications</CardTitle>
              <CardDescription>{pendingAmbassadors.length} ambassadors awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAmbassadors.map((ambassador) => (
                  <div key={ambassador.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                    <div>
                      <h4 className="font-semibold">{ambassador.name}</h4>
                      <p className="text-sm text-gray-600">{ambassador.email}</p>
                      {ambassador.region && (
                        <p className="text-sm text-gray-600">Region: {ambassador.region}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <form action="/api/admin/verify-ambassador" method="POST">
                        <input type="hidden" name="userId" value={ambassador.id} />
                        <Button type="submit" size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>View all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/applications">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Applications
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  View Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Jobs</CardTitle>
              <CardDescription>View and manage all jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/jobs">
                <Button className="w-full" variant="outline">
                  <Briefcase className="mr-2 h-4 w-4" />
                  View Jobs
                </Button>
              </Link>
              <Link href="/ambassador/jobs/new">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Job
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Opleidingen</CardTitle>
              <CardDescription>View and manage all opleidingen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/opleidingen">
                <Button className="w-full" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  View Opleidingen
                </Button>
              </Link>
              <Link href="/ambassador/opleidingen/new">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Opleiding
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

