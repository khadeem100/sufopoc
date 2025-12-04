"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationStatus } from "@prisma/client"
import { FileText, Briefcase, GraduationCap } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Application {
  id: string
  status: ApplicationStatus
  cvUrl: string | null
  coverLetter: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  job?: {
    id: string
    title: string
  } | null
  opleiding?: {
    id: string
    title: string
  } | null
}

interface AdminApplicationsContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  applications: Application[]
  jobs: Array<{ id: string; title: string }>
  opleidingen: Array<{ id: string; title: string }>
  searchParams: {
    status?: string
    type?: string
    jobId?: string
    opleidingId?: string
  }
}

export function AdminApplicationsContent({ session, links, applications, jobs, opleidingen, searchParams }: AdminApplicationsContentProps) {
  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "SUBMITTED").length,
    viewed: applications.filter((a) => a.status === "VIEWED").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    accepted: applications.filter((a) => a.status === "ACCEPTED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  }

  return (
    <DashboardLayout
      links={links}
      user={{
        name: session.user.name || null,
        email: session.user.email || "",
        image: session.user.image || null,
      }}
    >
      <div className="w-full">
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
              <div className="text-2xl font-bold text-gray-600">{stats.submitted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Viewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.viewed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.interview}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.rejected}</div>
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
                                  href={`/admin/jobs/${app.job.id}`}
                                  className="text-gray-600 hover:underline"
                                >
                                  {app.job.title}
                                </Link>
                              </div>
                            )}
                            {app.opleiding && (
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4" />
                                <Link
                                  href={`/admin/opleidingen/${app.opleiding.id}`}
                                  className="text-gray-600 hover:underline"
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
                              className="text-sm text-gray-600 hover:underline mt-2 block"
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
                            <Link href={`/admin/jobs/${app.job.id}`}>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </Link>
                          ) : app.opleiding ? (
                            <Link href={`/admin/opleidingen/${app.opleiding.id}`}>
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
    </DashboardLayout>
  )
}

