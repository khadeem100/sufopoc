import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LayoutDashboard, Briefcase, GraduationCap, LogOut } from "lucide-react"
import { StudentDashboardContent } from "@/components/student-dashboard-content"

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "STUDENT") {
    redirect("/")
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: { title: true, id: true },
      },
      opleiding: {
        select: { title: true, id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const jobs = await prisma.job.findMany({
    where: { isExpired: false },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      location: true,
    },
  })

  const opleidingen = await prisma.opleiding.findMany({
    where: { isExpired: false },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      category: true,
    },
  })

  const links = [
    {
      label: "Dashboard",
      href: "/student",
      icon: <LayoutDashboard className="text-black h-5 w-5 flex-shrink-0" />,
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
    <StudentDashboardContent
      session={session}
      links={links}
      applications={applications}
      jobs={jobs}
      opleidingen={opleidingen}
    />
  )
}
