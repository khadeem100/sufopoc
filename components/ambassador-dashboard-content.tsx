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
                  Your account is pending verification. You&apos;ll be able to create postings once verified by an admin.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-50 rounded-full mb-3">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
              <p className="text-sm font-medium text-gray-500 mt-1">Active Job Postings</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="p-3 bg-purple-50 rounded-full mb-3">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{opleidingen.length}</div>
              <p className="text-sm font-medium text-gray-500 mt-1">Study Programs</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="p-3 bg-green-50 rounded-full mb-3">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalApplications}</div>
              <p className="text-sm font-medium text-gray-500 mt-1">Total Applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs and Opleidingen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white border-b border-gray-50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Jobs Created</CardTitle>
                <CardDescription className="text-gray-500">{jobs.length} total jobs</CardDescription>
              </div>
              {isVerified && (
                <Link href="/ambassador/jobs/new">
                  <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-full px-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Job
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {jobs.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="bg-gray-50 p-4 rounded-full mb-4 inline-block">
                    <Briefcase className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-600 font-medium">No jobs created yet</p>
                  {isVerified && (
                    <Link href="/ambassador/jobs/new">
                      <Button className="mt-4" variant="outline">
                        Create your first job
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                              <FileText className="h-3 w-3" />
                              {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <Link href={`/ambassador/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm" className="ml-4 text-gray-400 hover:text-black">
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

          <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white border-b border-gray-50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Opleidingen Created</CardTitle>
                <CardDescription className="text-gray-500">{opleidingen.length} total opleidingen</CardDescription>
              </div>
              {isVerified && (
                <Link href="/ambassador/opleidingen/new">
                  <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-full px-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Opleiding
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {opleidingen.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="bg-gray-50 p-4 rounded-full mb-4 inline-block">
                    <GraduationCap className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-600 font-medium">No opleidingen created yet</p>
                  {isVerified && (
                    <Link href="/ambassador/opleidingen/new">
                      <Button className="mt-4" variant="outline">
                        Create your first opleiding
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {opleidingen.map((opleiding) => (
                    <div key={opleiding.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{opleiding.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                              <FileText className="h-3 w-3" />
                              {opleiding.applications.length} application{opleiding.applications.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <Link href={`/ambassador/opleidingen/${opleiding.id}`}>
                          <Button variant="ghost" size="sm" className="ml-4 text-gray-400 hover:text-black">
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

