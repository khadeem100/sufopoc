import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Briefcase, MapPin, DollarSign, Calendar, Building2, Award } from "lucide-react"

interface JobsPageProps {
  searchParams: {
    search?: string
    location?: string
    category?: string
    type?: string
    country?: string
    employmentType?: string
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const where: any = {}

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { companyName: { contains: searchParams.search, mode: "insensitive" } },
      { shortDescription: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }
  if (searchParams.location) {
    where.OR = [
      ...(where.OR || []),
      { city: { contains: searchParams.location, mode: "insensitive" } },
      { country: { contains: searchParams.location, mode: "insensitive" } },
    ]
  }
  if (searchParams.country) {
    where.country = { contains: searchParams.country, mode: "insensitive" }
  }
  if (searchParams.category && searchParams.category !== "all") {
    where.category = searchParams.category
  }
  if (searchParams.type && searchParams.type !== "all") {
    where.jobType = searchParams.type
  }
  if (searchParams.employmentType && searchParams.employmentType !== "all") {
    where.employmentType = searchParams.employmentType
  }
  
  // Filter out expired jobs and only show visible jobs
  where.isExpired = false
  where.isVisible = true

  const jobs = await prisma.job.findMany({
    where,
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get unique categories and countries for filters
  const allJobs = await prisma.job.findMany({
    where: { isExpired: false, isVisible: true },
    select: { category: true, country: true, jobType: true, employmentType: true },
  })
  
  const uniqueCategories = Array.from(new Set(allJobs.map(j => j.category).filter(Boolean)))
  const uniqueCountries = Array.from(new Set(allJobs.map(j => j.country).filter(Boolean)))
  const jobTypes = ["full-time", "part-time", "contract", "internship", "freelance"]
  const employmentTypes = ["on-site", "hybrid", "remote"]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form action="/jobs" method="get" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Input
                name="search"
                placeholder="Job title or company..."
                defaultValue={searchParams.search}
                className="lg:col-span-2"
              />
              <Input
                name="location"
                placeholder="City or country..."
                defaultValue={searchParams.location}
              />
              <Select name="category" defaultValue={searchParams.category || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="type" defaultValue={searchParams.type || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="employmentType" defaultValue={searchParams.employmentType || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Types</SelectItem>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="lg:col-span-6 bg-black hover:bg-gray-800">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No jobs found. Try adjusting your filters.
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.companyName || job.createdBy.name || "Unknown"}
                      </CardDescription>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button className="bg-black hover:bg-gray-800">View Details</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.city && job.country ? `${job.city}, ${job.country}` : job.location || `${job.city || ""} ${job.country || ""}`.trim() || "Location not specified"}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {job.category || "N/A"}
                    </div>
                    {job.jobType && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {job.jobType.replace(/-/g, " ")}
                      </div>
                    )}
                    {job.employmentType && (
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        {job.employmentType.replace(/-/g, " ")}
                      </div>
                    )}
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>
                        {job.currency || "EUR"} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {job.shortDescription ? (
                    <p className="text-gray-700 line-clamp-2">{job.shortDescription}</p>
                  ) : job.fullDescription ? (
                    <p className="text-gray-700 line-clamp-2">{job.fullDescription}</p>
                  ) : job.description ? (
                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                  ) : null}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.tags.slice(0, 5).map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
