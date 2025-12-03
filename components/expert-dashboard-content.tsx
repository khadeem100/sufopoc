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
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Experience</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{user.yearsOfExperience || 0}</div>
              <p className="text-xs text-white mt-1">Years of experience</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Expertise</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{user.expertise?.length || 0}</div>
              <p className="text-xs text-white mt-1">Areas of expertise</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Portfolio</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Link2 className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{user.portfolioLinks?.length || 0}</div>
              <p className="text-xs text-white mt-1">Portfolio links</p>
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
                  <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{job.location || "Location not specified"}</p>
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
    </DashboardLayout>
  )
}

