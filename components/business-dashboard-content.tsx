"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Briefcase, FileText, AlertCircle, LayoutDashboard, LogOut } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Job {
  id: string
  title: string
  applications: Array<{ id: string }>
}

interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
  companyName?: string | null
  companyWebsite?: string | null
  companyLogo?: string | null
  isBusinessVerified?: boolean | null
}

interface BusinessDashboardContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  user: User | null
  jobs: Job[]
  totalApplications: number
}

export function BusinessDashboardContent({ session, links, user, jobs, totalApplications }: BusinessDashboardContentProps) {
  return (
    <DashboardLayout
      links={links}
      user={{
        name: user?.companyName || session.user.name || null,
        email: session.user.email || "",
        image: session.user.image || null,
      }}
    >
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-black">
            Welcome back, {user?.companyName || session.user.name}!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Manage your job postings and applications</p>
        </div>

        {/* Verification Notice */}
        {!user?.isBusinessVerified && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800">Account Verification Pending</h3>
                  <p className="text-yellow-700 mt-1 text-sm">
                    Your business account is pending verification. Some features may be limited until verified.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-gray-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-gray-600">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-gray-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{totalApplications}</p>
                  <p className="text-gray-600">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <LayoutDashboard className="h-8 w-8 text-gray-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{user?.isBusinessVerified ? "Verified" : "Pending"}</p>
                  <p className="text-gray-600">Account Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-24 flex flex-col items-center justify-center">
              <Link href="/business/jobs/new">
                <Plus className="h-6 w-6 mb-2" />
                <span>Post New Job</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Link href="/business/jobs">
                <Briefcase className="h-6 w-6 mb-2" />
                <span>Manage Jobs</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Link href="/business/applications">
                <FileText className="h-6 w-6 mb-2" />
                <span>View Applications</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Link href="/business/profile">
                <LayoutDashboard className="h-6 w-6 mb-2" />
                <span>Company Profile</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Jobs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-black">Recent Jobs</h3>
            <Button asChild variant="outline" size="sm">
              <Link href="/business/jobs">View All</Link>
            </Button>
          </div>
          
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.slice(0, 4).map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{job.applications.length} applications</span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/business/jobs/${job.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first job posting</p>
                <Button asChild>
                  <Link href="/business/jobs/new">Post Your First Job</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
