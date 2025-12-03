"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Briefcase, GraduationCap, FileText, AlertCircle, LayoutDashboard, LogOut } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Job {
  id: string
  title: string
  applications: Array<{ id: string }>
}

interface Opleiding {
  id: string
  title: string
  applications: Array<{ id: string }>
}

interface AmbassadorDashboardContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  isVerified: boolean
  jobs: Job[]
  opleidingen: Opleiding[]
  totalApplications: number
}

export function AmbassadorDashboardContent({ session, links, isVerified, jobs, opleidingen, totalApplications }: AmbassadorDashboardContentProps) {
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
          <p className="text-gray-600 mt-2 text-lg">Manage your job postings and opleidingen</p>
        </div>

        {/* Verification Alert */}
        {!isVerified && (
          <Card className="mb-8 border-2 border-gray-300 bg-gray-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-gray-600 font-medium">
                  Your account is pending verification. You'll be able to create postings once verified by an admin.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Jobs Created</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{jobs.length}</div>
              <p className="text-xs text-white mt-1">Active job postings</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Opleidingen</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{opleidingen.length}</div>
              <p className="text-xs text-white mt-1">Study abroad programs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Applications</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{totalApplications}</div>
              <p className="text-xs text-white mt-1">Total received</p>
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
                    <Button size="sm" className="bg-black hover:bg-gray-800">
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
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200">
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
                    <Button size="sm" className="bg-black hover:bg-gray-800">
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
                    <div key={opleiding.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200">
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
    </DashboardLayout>
  )
}

