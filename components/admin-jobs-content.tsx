"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Job {
  id: string
  title: string
  location: string | null
  city?: string | null
  country?: string | null
  isExpired: boolean
  createdAt: Date
  createdBy: {
    name: string | null
    email: string
  }
  applications: Array<{ id: string }>
}

interface AdminJobsContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  jobs: Job[]
}

export function AdminJobsContent({ session, links, jobs }: AdminJobsContentProps) {
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-black">Jobs Management</h2>
            <p className="text-gray-600 mt-2">Manage all job postings</p>
          </div>
          <Link href="/ambassador/jobs/new">
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Jobs ({jobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-gray-600">
                        {job.city && job.country 
                          ? `${job.city}, ${job.country}` 
                          : job.location || "Location not specified"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created by: {job.createdBy.name || job.createdBy.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Applications: {job.applications.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {job.isExpired && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          Expired
                        </span>
                      )}
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/ambassador/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

