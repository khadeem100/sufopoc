import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LayoutDashboard, Briefcase, GraduationCap, FileText, LogOut } from "lucide-react"
import { AmbassadorDashboardContent } from "@/components/ambassador-dashboard-content"

export default async function AmbassadorDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const jobs = await prisma.job.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const opleidingen = await prisma.opleiding.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const isVerified = user?.isVerified || session.user.role === "ADMIN"
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0) +
    opleidingen.reduce((sum, opleiding) => sum + opleiding.applications.length, 0)

  const links = [
    {
      label: "Dashboard",
      href: "/ambassador",
      icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Applications",
      href: "/ambassador/applications",
      icon: <FileText className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Jobs",
      href: "/jobs",
      icon: <Briefcase className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Opleidingen",
      href: "/opleidingen",
      icon: <GraduationCap className="text-black h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/auth/signout",
      icon: <LogOut className="text-black h-5 w-5 flex-shrink-0" />,
    },
  ]

  return (
    <AmbassadorDashboardContent
      session={session}
      links={links}
      isVerified={isVerified}
      jobs={jobs}
      opleidingen={opleidingen}
      totalApplications={totalApplications}
    />
  )
}
