"use client"

import { JobCard } from "@/components/ui/job-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Job {
  id: string
  title: string
  companyName: string
  shortDescription?: string | null
  fullDescription?: string | null
  description?: string | null
  category: string
  jobType?: string | null
  employmentType?: string | null
  city?: string | null
  country?: string | null
  location?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  currency?: string | null
  tags?: string[]
  logoUrl?: string | null
  bannerUrl?: string | null
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
  const [searchQuery, setSearchQuery] = useState("")

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase()
    return (
      job.title.toLowerCase().includes(query) ||
      job.companyName.toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout
      links={links}
      user={{
        name: session.user.name || null,
        email: session.user.email || "",
        image: session.user.image || null,
      }}
    >
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-black">Jobs Management</h2>
            <p className="text-gray-600 mt-2">Manage all job postings</p>
          </div>
          <Link href="/admin/jobs/new">
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="h-full">
              <JobCard
                id={job.id}
                title={job.title}
                companyName={job.companyName}
                shortDescription={job.shortDescription || undefined}
                fullDescription={job.fullDescription || undefined}
                description={job.description || undefined}
                category={job.category}
                jobType={job.jobType || undefined}
                employmentType={job.employmentType || undefined}
                city={job.city || undefined}
                country={job.country || undefined}
                location={job.location || undefined}
                salaryMin={job.salaryMin}
                salaryMax={job.salaryMax}
                currency={job.currency || undefined}
                tags={job.tags}
                logoUrl={job.logoUrl || null}
                bannerUrl={job.bannerUrl || null}
                createdAt={job.createdAt}
                manageUrl={`/admin/jobs/${job.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

