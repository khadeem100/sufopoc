"use client"

import { UserCard } from "@/components/ui/user-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isVerified: boolean | null
  createdAt: Date
  image?: string | null
}

interface AdminUsersContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  users: User[]
}

export function AdminUsersContent({ session, links, users }: AdminUsersContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleVerify = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/verify-ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!res.ok) throw new Error("Failed to verify user")

      toast({
        title: "Success",
        description: "Ambassador verified successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify ambassador",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      (user.name?.toLowerCase() || "").includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
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
            <h2 className="text-3xl font-bold text-black">Users Management</h2>
            <p className="text-gray-600 mt-2">Manage all platform users</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="h-full">
              <UserCard
                id={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                isVerified={user.isVerified}
                createdAt={user.createdAt}
                imageUrl={user.image}
                onVerify={user.role === "AMBASSADOR" && !user.isVerified ? () => handleVerify(user.id) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

