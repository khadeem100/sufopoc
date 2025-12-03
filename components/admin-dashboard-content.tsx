"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Briefcase, GraduationCap, CheckCircle, Plus, FileText, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface AdminDashboardContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  stats: {
    users: number
    jobs: number
    opleidingen: number
    applications: number
    pendingAmbassadors: Array<{
      id: string
      name: string | null
      email: string
      region: string | null
    }>
  }
}

export function AdminDashboardContent({ session, links, stats }: AdminDashboardContentProps) {
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
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Manage and monitor your platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{stats.users}</div>
              <p className="text-xs text-white mt-1">Active accounts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white">Total Jobs</CardTitle>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{stats.jobs}</div>
              <p className="text-xs text-white mt-1">Job postings</p>
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
              <div className="text-4xl font-bold text-white">{stats.opleidingen}</div>
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
              <div className="text-4xl font-bold text-white">{stats.applications}</div>
              <p className="text-xs text-white mt-1">Total submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Ambassadors Alert */}
        {stats.pendingAmbassadors.length > 0 && (
          <Card className="mb-8 border-2 border-gray-300 bg-gray-50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Ambassador Verifications</CardTitle>
                  <CardDescription className="text-base font-medium text-gray-600">
                    {stats.pendingAmbassadors.length} ambassador{stats.pendingAmbassadors.length > 1 ? 's' : ''} awaiting verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.pendingAmbassadors.map((ambassador) => (
                  <div key={ambassador.id} className="flex justify-between items-center p-4 bg-white/60 rounded-lg border border-gray-300/50">
                    <div>
                      <h4 className="font-semibold text-gray-900">{ambassador.name}</h4>
                      <p className="text-sm text-gray-600">{ambassador.email}</p>
                      {ambassador.region && (
                        <p className="text-sm text-gray-500 mt-1">📍 {ambassador.region}</p>
                      )}
                    </div>
                    <form action="/api/admin/verify-ambassador" method="POST">
                      <input type="hidden" name="userId" value={ambassador.id} />
                      <Button type="submit" size="sm" className="bg-black hover:bg-gray-800">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Applications</CardTitle>
              </div>
              <CardDescription>View all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/applications">
                <Button className="w-full bg-black hover:bg-gray-800">
                  View All
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Users</CardTitle>
              </div>
              <CardDescription>Manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full bg-black hover:bg-gray-800">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
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
                <Button className="w-full bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Opleidingen</CardTitle>
              </div>
                  <CardDescription>Manage study abroad programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/opleidingen">
                <Button className="w-full" variant="outline">
                  View All
                </Button>
              </Link>
              <Link href="/ambassador/opleidingen/new">
                <Button className="w-full bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Opleiding
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

