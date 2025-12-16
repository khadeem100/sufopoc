"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, ArrowRight, Award, Link2, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Application {
  id: string
  status: string
  job?: { title: string; id: string } | null
  opleiding?: { title: string; id: string } | null
}

interface ExpertDashboardContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  user: {
    yearsOfExperience: number | null
    expertise: string[]
    portfolioLinks: string[]
  }
  applications: Application[]
  jobs: Array<{ id: string; title: string; location: string | null }>
}

export function ExpertDashboardContent({ session, links, user, applications, jobs }: ExpertDashboardContentProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED": return <Clock className="h-4 w-4 text-gray-600" />
      case "VIEWED": return <Briefcase className="h-4 w-4 text-gray-600" />
      case "INTERVIEW": return <CheckCircle2 className="h-4 w-4 text-gray-600" />
      case "ACCEPTED": return <CheckCircle2 className="h-4 w-4 text-gray-600" />
      case "REJECTED": return <XCircle className="h-4 w-4 text-gray-600" />
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
            Welcome, {session.user.name}!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Expert profile and opportunities</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-50 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{user.yearsOfExperience || 0}</div>
              <p className="text-sm font-medium text-gray-500 mt-1">Years of Experience</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="p-3 bg-purple-50 rounded-full mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{user.expertise?.length || 0}</div>
              <p className="text-sm font-medium text-gray-500 mt-1">Areas of Expertise</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="p-3 bg-green-50 rounded-full mb-3">
                <Link2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{user.portfolioLinks?.length || 0}</div>
              <p className="text-sm font-medium text-gray-500 mt-1">Portfolio Links</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Applications */}
          <Card className="lg:col-span-2 border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Recent Applications</CardTitle>
              <CardDescription className="text-gray-500">{applications.length} total applications</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Briefcase className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    Start applying to opportunities to track them here.
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
              <CardDescription>Explore opportunities</CardDescription>
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

        {/* Latest Job Opportunities */}
        <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white border-b border-gray-50">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Latest Job Opportunities</CardTitle>
              <CardDescription>New opportunities matching your expertise</CardDescription>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6 bg-gray-50/30">
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No jobs available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-5 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {job.location || "Location not specified"}
                    </p>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="w-full hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

