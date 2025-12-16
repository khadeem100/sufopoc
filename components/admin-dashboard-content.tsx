"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, XCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Briefcase, GraduationCap, CheckCircle, Plus, FileText, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

interface AdminDashboardContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  stats: {
    users: number
    jobs: number
    opleidingen: number
    applications: number
    pendingAmbassadors: Array<{
      id: string
      name: string | null
      email: string
      region: string | null
    }>
  }
}


export function AdminDashboardContent({ session, links, stats }: AdminDashboardContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAction = async (userId: string, action: "verify" | "decline") => {
    setProcessingId(userId)
    try {
      const formData = new FormData()
      formData.append("userId", userId)
      formData.append("action", action)

      const response = await fetch("/api/admin/verify-ambassador", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Action failed")
      }

      toast({
        title: action === "verify" ? "Verification Email Sent" : "Application Declined",
        description: data.message,
      })
      
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

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
        {/* ... existing header and stats grid ... */}

        {/* Pending Ambassadors Alert */}
        {stats.pendingAmbassadors.length > 0 && (
          <Card className="mb-8 border-2 border-gray-300 bg-gray-50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Ambassador Verifications</CardTitle>
                  <CardDescription className="text-base font-medium text-gray-600">
                    {stats.pendingAmbassadors.length} ambassador{stats.pendingAmbassadors.length > 1 ? 's' : ''} awaiting verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.pendingAmbassadors.map((ambassador) => (
                  <div key={ambassador.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white/60 rounded-lg border border-gray-300/50 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{ambassador.name}</h4>
                      <p className="text-sm text-gray-600">{ambassador.email}</p>
                      {ambassador.region && (
                        <p className="text-sm text-gray-500 mt-1">📍 {ambassador.region}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button 
                        onClick={() => handleAction(ambassador.id, "decline")}
                        variant="destructive"
                        size="sm"
                        disabled={processingId === ambassador.id}
                        className="flex-1 md:flex-none"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button 
                        onClick={() => handleAction(ambassador.id, "verify")}
                        size="sm" 
                        disabled={processingId === ambassador.id}
                        className="bg-black hover:bg-gray-800 flex-1 md:flex-none"
                      >
                        {processingId === ambassador.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Verify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ... existing quick actions ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Applications</CardTitle>
              </div>
              <CardDescription>View all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/applications">
                <Button className="w-full bg-black hover:bg-gray-800">
                  View All
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Users</CardTitle>
              </div>
              <CardDescription>Manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full bg-black hover:bg-gray-800">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Jobs</CardTitle>
              </div>
              <CardDescription>Manage job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/jobs">
                <Button className="w-full" variant="outline">
                  View Jobs
                </Button>
              </Link>
              <Link href="/admin/jobs/new">
                <Button className="w-full bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Opleidingen</CardTitle>
              </div>
                  <CardDescription>Manage study abroad programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/opleidingen">
                <Button className="w-full" variant="outline">
                  View All
                </Button>
              </Link>
              <Link href="/admin/opleidingen/new">
                <Button className="w-full bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Opleiding
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

