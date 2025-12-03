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
import { Briefcase, MapPin, DollarSign, Calendar } from "lucide-react"
import { JobType, JobCategory } from "@prisma/client"

interface JobsPageProps {
  searchParams: {
    search?: string
    location?: string
    category?: string
    type?: string
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const where: any = {}

  if (searchParams.search) {
    where.title = { contains: searchParams.search, mode: "insensitive" }
  }
  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: "insensitive" }
  }
  if (searchParams.category) {
    where.category = searchParams.category as JobCategory
  }
  if (searchParams.type) {
    where.type = searchParams.type as JobType
  }

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
            <form action="/jobs" method="get" className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                name="search"
                placeholder="Job title..."
                defaultValue={searchParams.search}
              />
              <Input
                name="location"
                placeholder="Location..."
                defaultValue={searchParams.location}
              />
              <Select name="category" defaultValue={searchParams.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {Object.values(JobCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="type" defaultValue={searchParams.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {Object.values(JobType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="md:col-span-4">Search</Button>
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
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.createdBy.name}
                      </CardDescription>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {job.category.replace("_", " ")}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {job.type.replace("_", " ")}
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-gray-700 line-clamp-2">{job.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

