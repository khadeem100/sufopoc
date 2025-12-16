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
            <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-2 bg-blue-50 rounded-full mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{statusCounts.submitted}</div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Submitted</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-2 bg-indigo-50 rounded-full mb-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{statusCounts.viewed}</div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Viewed</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-2 bg-amber-50 rounded-full mb-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{statusCounts.interview}</div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Interview</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-2 bg-green-50 rounded-full mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{statusCounts.accepted}</div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Accepted</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-2 bg-red-50 rounded-full mb-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Rejected</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Applications */}
          <Card className="lg:col-span-2 border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Recent Applications</CardTitle>
              <CardDescription className="text-gray-500">Track your latest job and study abroad applications</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    Start applying to jobs and study programs to see your status here.
                  </p>
                  <Link href="/jobs">
                    <Button className="mt-6 bg-black text-white hover:bg-gray-800 rounded-full px-6">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg mt-1 ${
                          app.job ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {app.job ? <Briefcase className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {app.job?.title || app.opleiding?.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={app.job ? `/jobs/${app.job.id}` : `/opleidingen/${app.opleiding?.id}`}>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-100 shadow-sm rounded-xl h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              <CardDescription>Jump right into it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/jobs">
                <Button className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200 h-auto py-4 px-4 shadow-sm hover:shadow transition-all group" variant="outline">
                  <div className="bg-black text-white p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Browse Jobs</span>
                    <span className="block text-xs text-gray-500 font-normal">Find your next role</span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                </Button>
              </Link>
              <Link href="/opleidingen">
                <Button className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200 h-auto py-4 px-4 shadow-sm hover:shadow transition-all group" variant="outline">
                  <div className="bg-black text-white p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Study Abroad</span>
                    <span className="block text-xs text-gray-500 font-normal">Explore programs</span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Latest Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white border-b border-gray-50">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Latest Jobs</CardTitle>
                <CardDescription>New opportunities for you</CardDescription>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {jobs.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-500">No jobs available at the moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <Link href={`/jobs/${job.id}`}>
                           <span className="text-xs font-medium text-gray-400 hover:text-black cursor-pointer">View</span>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{job.location || "Remote"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white border-b border-gray-50">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Latest Opleidingen</CardTitle>
                <CardDescription>New study programs</CardDescription>
              </div>
              <Link href="/opleidingen">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {opleidingen.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-500">No programs available at the moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {opleidingen.slice(0, 3).map((opleiding) => (
                    <div key={opleiding.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{opleiding.title}</h4>
                         <Link href={`/opleidingen/${opleiding.id}`}>
                           <span className="text-xs font-medium text-gray-400 hover:text-black cursor-pointer">View</span>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{opleiding.category.replace(/_/g, " ").toLowerCase()}</span>
                      </div>
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

