"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface Opleiding {
  id: string
  title: string
  isExpired: boolean
  createdAt: Date
  createdBy: {
    name: string | null
    email: string
  }
  applications: Array<{ id: string }>
}

interface AdminOpleidingenContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  opleidingen: Opleiding[]
}

export function AdminOpleidingenContent({ session, links, opleidingen }: AdminOpleidingenContentProps) {
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-black">Opleidingen Management</h2>
            <p className="text-gray-600 mt-2">Manage all opleidingen postings</p>
          </div>
          <Link href="/ambassador/opleidingen/new">
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Create New Opleiding
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Opleidingen ({opleidingen.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opleidingen.map((opleiding) => (
                <div key={opleiding.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{opleiding.title}</h4>
                      <p className="text-sm text-gray-600">
                        Created by: {opleiding.createdBy.name || opleiding.createdBy.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Applications: {opleiding.applications.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted: {new Date(opleiding.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {opleiding.isExpired && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          Expired
                        </span>
                      )}
                      <Link href={`/opleidingen/${opleiding.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/ambassador/opleidingen/${opleiding.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
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

