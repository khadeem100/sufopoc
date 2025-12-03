"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, FileText, ArrowRight, CheckCircle2, Clock, XCircle, LayoutDashboard, LogOut } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Application {
  id: string
  status: string
  createdAt: Date
  job?: { title: string; id: string } | null
  opleiding?: { title: string; id: string } | null
}

interface StudentDashboardContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  applications: Application[]
  jobs: Array<{ id: string; title: string; location: string | null }>
  opleidingen: Array<{ id: string; title: string; category: string }>
}

export function StudentDashboardContent({ session, links, applications, jobs, opleidingen }: StudentDashboardContentProps) {
  const statusCounts = {
    submitted: applications.filter(a => a.status === "SUBMITTED").length,
    viewed: applications.filter(a => a.status === "VIEWED").length,
    interview: applications.filter(a => a.status === "INTERVIEW").length,
    accepted: applications.filter(a => a.status === "ACCEPTED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED": return <Clock className="h-4 w-4 text-gray-600" />
      case "VIEWED": return <FileText className="h-4 w-4 text-gray-600" />
      case "INTERVIEW": return <CheckCircle2 className="h-4 w-4 text-gray-600" />
      case "ACCEPTED": return <CheckCircle2 className="h-4 w-4 text-gray-800" />
      case "REJECTED": return <XCircle className="h-4 w-4 text-gray-400" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-gray-100 text-gray-800"
      case "VIEWED": return "bg-gray-100 text-gray-800"
      case "INTERVIEW": return "bg-gray-200 text-gray-900"
      case "ACCEPTED": return "bg-gray-800 text-white"
      case "REJECTED": return "bg-gray-100 text-gray-500"
      default: return "bg-gray-100 text-gray-800"
    }
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
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-black">
            Welcome back, {session.user.name}!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Discover opportunities and track your applications</p>
        </div>

        {/* Application Stats */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-md bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-800">{statusCounts.submitted}</div>
                <p className="text-xs text-gray-600 mt-1">Submitted</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-800">{statusCounts.viewed}</div>
                <p className="text-xs text-gray-600 mt-1">Viewed</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-800">{statusCounts.interview}</div>
                <p className="text-xs text-gray-600 mt-1">Interview</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-800">{statusCounts.accepted}</div>
                <p className="text-xs text-gray-600 mt-1">Accepted</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-800">{statusCounts.rejected}</div>
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
              <CardDescription>Your latest job and study abroad applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-300" />
                  <p className="text-gray-600 mt-4 font-medium">No applications yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start applying to jobs and opleidingen</p>
                  <Link href="/jobs">
                    <Button className="mt-4 bg-black hover:bg-gray-800">
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200">
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
                <Button className="w-full justify-start bg-black hover:bg-gray-800" size="lg">
                  <Briefcase className="mr-3 h-5 w-5" />
                  Browse Jobs
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/opleidingen">
                <Button className="w-full justify-start bg-black hover:bg-gray-800" size="lg">
                  <GraduationCap className="mr-3 h-5 w-5" />
                  Study Abroad
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
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{job.location || "Location not specified"}</p>
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
                  <CardDescription>New study abroad opportunities</CardDescription>
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
                    <div key={opleiding.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200">
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
    </DashboardLayout>
  )
}

