import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationStatus } from "@prisma/client"
import { LogoutButton } from "@/components/logout-button"
import { FileText, Briefcase, GraduationCap } from "lucide-react"

interface ApplicationsPageProps {
  searchParams: {
    status?: string
    type?: string
    jobId?: string
    opleidingId?: string
  }
}

export default async function AdminApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Get all jobs and opleidingen for filtering
  const jobs = await prisma.job.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  })

  const opleidingen = await prisma.opleiding.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  })

  // Build where clause for applications
  const where: any = {}

  // Filter by status
  if (searchParams.status && searchParams.status !== "all") {
    where.status = searchParams.status as ApplicationStatus
  }

  // Filter by job
  if (searchParams.jobId && searchParams.jobId !== "all") {
    where.jobId = searchParams.jobId
  }

  // Filter by opleiding
  if (searchParams.opleidingId && searchParams.opleidingId !== "all") {
    where.opleidingId = searchParams.opleidingId
  }

  // Get applications
  const applications = await prisma.application.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
      opleiding: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get stats
  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "SUBMITTED").length,
    viewed: applications.filter((a) => a.status === "VIEWED").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    accepted: applications.filter((a) => a.status === "ACCEPTED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">All Applications</h1>
              <Link href="/admin">
                <Button variant="ghost">Dashboard</Button>
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
          <h2 className="text-3xl font-bold text-black">All Applications</h2>
          <p className="text-gray-600 mt-2">View and manage all applications across the platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Viewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.viewed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.interview}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/admin/applications" method="get" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  name="status"
                  defaultValue={searchParams.status || "all"}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Statuses</option>
                  {Object.values(ApplicationStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Job</label>
                <select
                  name="jobId"
                  defaultValue={searchParams.jobId || "all"}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Opleiding</label>
                <select
                  name="opleidingId"
                  defaultValue={searchParams.opleidingId || "all"}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Opleidingen</option>
                  {opleidingen.map((opleiding) => (
                    <option key={opleiding.id} value={opleiding.id}>
                      {opleiding.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <Button type="submit">Apply Filters</Button>
                <Link href="/admin/applications">
                  <Button type="button" variant="outline" className="ml-2">
                    Clear Filters
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({applications.length})</CardTitle>
            <CardDescription>
              {searchParams.status && searchParams.status !== "all"
                ? `Filtered by: ${searchParams.status.replace(/_/g, " ")}`
                : "All applications"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No applications found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchParams.status || searchParams.jobId || searchParams.opleidingId
                    ? "Try adjusting your filters"
                    : "No applications have been submitted yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{app.user.name || app.user.email}</h4>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                              {app.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{app.user.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            {app.job && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                <Link
                                  href={`/ambassador/jobs/${app.job.id}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {app.job.title}
                                </Link>
                              </div>
                            )}
                            {app.opleiding && (
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4" />
                                <Link
                                  href={`/ambassador/opleidingen/${app.opleiding.id}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {app.opleiding.title}
                                </Link>
                              </div>
                            )}
                          </div>
                          {app.cvUrl && (
                            <a
                              href={app.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline mt-2 block"
                            >
                              View CV
                            </a>
                          )}
                          {app.coverLetter && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                              <p className="text-sm text-gray-700 mt-1 line-clamp-3">{app.coverLetter}</p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          {app.job ? (
                            <Link href={`/ambassador/jobs/${app.job.id}`}>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </Link>
                          ) : app.opleiding ? (
                            <Link href={`/ambassador/opleidingen/${app.opleiding.id}`}>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

