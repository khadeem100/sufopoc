import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LayoutDashboard, Users, Briefcase, GraduationCap, FileText, LogOut } from "lucide-react"
import { AdminUsersContent } from "@/components/admin-users-content"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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
    <AdminUsersContent
      session={session}
      links={links}
      users={users}
    />
  )
}
