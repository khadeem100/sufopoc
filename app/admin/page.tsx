import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Briefcase, GraduationCap, CheckCircle, Plus, FileText, AlertCircle, LayoutDashboard, LogOut } from "lucide-react"
import { AdminDashboardContent } from "@/components/admin-dashboard-content"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const [users, jobs, opleidingen, applications, pendingAmbassadors] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.opleiding.count(),
    prisma.application.count(),
    prisma.user.findMany({
      where: {
        role: "AMBASSADOR",
        isVerified: false,
      },
    }),
  ])

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
    <AdminDashboardContent
      session={session}
      links={links}
      stats={{
        users,
        jobs,
        opleidingen,
        applications,
        pendingAmbassadors,
      }}
    />
  )
}
