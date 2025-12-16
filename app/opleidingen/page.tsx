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
import { OpleidingCard } from "@/components/ui/opleiding-card"
import { JobCategory } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LayoutDashboard, Briefcase, GraduationCap, LogOut, Shield, Users, FileText, Plus } from "lucide-react"

interface OpleidingenPageProps {
  searchParams: {
    search?: string
    location?: string
    category?: string
  }
}

export default async function OpleidingenPage({ searchParams }: OpleidingenPageProps) {
  const session = await getServerSession(authOptions)
  const where: any = {}

  if (searchParams.search) {
    where.title = { contains: searchParams.search, mode: "insensitive" }
  }
  if (searchParams.location) {
    where.OR = [
      { schoolCity: { contains: searchParams.location, mode: "insensitive" } },
      { schoolCountry: { contains: searchParams.location, mode: "insensitive" } },
      { partnerCountry: { contains: searchParams.location, mode: "insensitive" } },
      { location: { contains: searchParams.location, mode: "insensitive" } },
    ]
  }
  if (searchParams.category && searchParams.category !== "all") {
    where.category = searchParams.category as JobCategory
  }
  
  where.isExpired = false

  const opleidingen = await prisma.opleiding.findMany({
    where,
    select: {
      id: true,
      title: true,
      shortDescription: true,
      longDescription: true,
      description: true,
      category: true,
      programType: true,
      partnerCountry: true,
      partnerSchool: true,
      schoolCity: true,
      schoolCountry: true,
      location: true,
      studyDurationYears: true,
      duration: true,
      language: true,
      tuitionFeeYear: true,
      tags: true,
      thumbnailUrl: true,
      bannerUrl: true,
      createdAt: true,
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

  const PageContent = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">Browse Study Abroad Programs</h1>
        <p className="text-gray-600 text-lg">Discover study abroad and enrollment opportunities</p>
      </div>

      {/* Filters */}
      <Card className="mb-12 border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <form action="/opleidingen" method="get" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="search"
              placeholder="Program title..."
              defaultValue={searchParams.search}
            />
            <Input
              name="location"
              placeholder="Location..."
              defaultValue={searchParams.location}
            />
            <Select name="category" defaultValue={searchParams.category || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(JobCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="md:col-span-3 bg-black hover:bg-gray-800">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Opleidingen Grid */}
      {opleidingen.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-6 text-center text-gray-600">
            No study programs found. Try adjusting your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opleidingen.map((opleiding) => (
            <OpleidingCard
              key={opleiding.id}
              id={opleiding.id}
              title={opleiding.title}
              shortDescription={opleiding.shortDescription}
              longDescription={opleiding.longDescription}
              description={opleiding.description}
              category={opleiding.category}
              programType={opleiding.programType}
              partnerCountry={opleiding.partnerCountry}
              partnerSchool={opleiding.partnerSchool}
              schoolCity={opleiding.schoolCity}
              schoolCountry={opleiding.schoolCountry}
              location={opleiding.location}
              studyDurationYears={opleiding.studyDurationYears}
              duration={opleiding.duration}
              language={opleiding.language}
              tuitionFeeYear={opleiding.tuitionFeeYear}
              tags={opleiding.tags}
              thumbnailUrl={opleiding.thumbnailUrl}
              bannerUrl={opleiding.bannerUrl}
              createdAt={opleiding.createdAt}
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
