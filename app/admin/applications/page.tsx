import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"
import { LayoutDashboard, Users, Briefcase, GraduationCap, FileText, LogOut } from "lucide-react"
import { AdminApplicationsContent } from "@/components/admin-applications-content"

interface ApplicationsPageProps {
  searchParams: {
    status?: string
    type?: string
    jobId?: string
    opleidingId?: string
  }
}

export default async function AdminApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Get all jobs and opleidingen for filtering
  const jobs = await prisma.job.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  })

  const opleidingen = await prisma.opleiding.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  })

  // Build where clause for applications
  const where: any = {}

  // Filter by status
  if (searchParams.status && searchParams.status !== "all") {
    where.status = searchParams.status as ApplicationStatus
  }

  // Filter by job
  if (searchParams.jobId && searchParams.jobId !== "all") {
    where.jobId = searchParams.jobId
  }

  // Filter by opleiding
  if (searchParams.opleidingId && searchParams.opleidingId !== "all") {
    where.opleidingId = searchParams.opleidingId
  }

  // Get applications
  const applications = await prisma.application.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
      opleiding: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Applications",
      href: "/admin/applications",
      icon: <FileText className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Jobs",
      href: "/admin/jobs",
      icon: <Briefcase className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Opleidingen",
      href: "/admin/opleidingen",
      icon: <GraduationCap className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/auth/signout",
      icon: <LogOut className="text-black h-5 w-5 flex-shrink-0" />,
    },
  ]

  return (
    <AdminApplicationsContent
      session={session}
      links={links}
      applications={applications}
      jobs={jobs}
      opleidingen={opleidingen}
      searchParams={searchParams}
    />
  )
}
