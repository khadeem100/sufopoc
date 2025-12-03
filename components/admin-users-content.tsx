"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isVerified: boolean | null
  createdAt: Date
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
  return (
    <DashboardLayout
      links={links}
      user={{
        name: session.user.name || null,
        email: session.user.email || "",
        image: session.user.image || null,
      }}
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black">Users Management</h2>
          <p className="text-gray-600 mt-2">Manage all platform users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{user.name || "No name"}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        Role: <span className="capitalize">{user.role.toLowerCase()}</span>
                      </p>
                      {user.role === "AMBASSADOR" && (
                        <p className="text-sm text-gray-600">
                          Verified: {user.isVerified ? "Yes" : "No"}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

