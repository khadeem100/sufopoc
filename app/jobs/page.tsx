import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"
import { JobCard } from "@/components/ui/job-card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LayoutDashboard, Briefcase, GraduationCap, LogOut, Shield, Users, FileText, Plus } from "lucide-react"

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
  const session = await getServerSession(authOptions)
  
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

  const allJobs = await prisma.job.findMany({
    where: { isExpired: false, isVisible: true },
    select: { category: true, country: true, jobType: true, employmentType: true },
  })
  
  const uniqueCategories = Array.from(new Set(allJobs.map(j => j.category).filter(Boolean)))
  const uniqueCountries = Array.from(new Set(allJobs.map(j => j.country).filter(Boolean)))
  const jobTypes = ["full-time", "part-time", "contract", "internship", "freelance"]
  const employmentTypes = ["on-site", "hybrid", "remote"]

  const PageContent = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">Browse Jobs</h1>
        <p className="text-gray-600 text-lg">Find your next opportunity</p>
      </div>

      {/* Filters */}
      <Card className="mb-12 border-gray-200 shadow-sm">
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

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-6 text-center text-gray-600">
            No jobs found. Try adjusting your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              companyName={job.companyName}
              shortDescription={job.shortDescription}
              fullDescription={job.fullDescription}
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
            />
          ))}
        </div>
      )}
    </div>
  )

  if (session) {
    const getLinks = (role: string) => {
      const common = [
        { label: "Browse Jobs", href: "/jobs", icon: <Briefcase className="text-black h-5 w-5 flex-shrink-0" /> },
        { label: "Study Abroad", href: "/opleidingen", icon: <GraduationCap className="text-black h-5 w-5 flex-shrink-0" /> },
      ]
      const logout = { label: "Logout", href: "/auth/signout", icon: <LogOut className="text-black h-5 w-5 flex-shrink-0" /> }

      switch (role) {
        case "ADMIN":
          return [
            { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" /> },
            { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="text-black h-5 w-5 flex-shrink-0" /> },
            { label: "Manage Opleidingen", href: "/admin/opleidingen", icon: <GraduationCap className="text-black h-5 w-5 flex-shrink-0" /> },
            { label: "Users", href: "/admin/users", icon: <Users className="text-black h-5 w-5 flex-shrink-0" /> },
            ...common,
            logout
          ]
        case "AMBASSADOR":
          return [
            { label: "Dashboard", href: "/ambassador", icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" /> },
            ...common,
            logout
          ]
        case "EXPERT":
          return [
            { label: "Dashboard", href: "/expert", icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" /> },
            ...common,
            logout
          ]
        case "STUDENT":
        default:
          return [
            { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" /> },
            ...common,
            logout
          ]
      }
    }

    return (
      <DashboardLayout
        links={getLinks(session.user.role)}
        user={{
          name: session.user.name || null,
          email: session.user.email || "",
          image: session.user.image || null,
        }}
      >
        <PageContent />
      </DashboardLayout>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />
      <PageContent />
    </div>
  )
}
