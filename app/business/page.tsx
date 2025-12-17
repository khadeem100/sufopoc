import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Briefcase, FileText, LayoutDashboard } from "lucide-react"

export default async function BusinessDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role as string !== "BUSINESS") {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  // Check if business is verified
  if (!(user as any)?.isBusinessVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
            <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Account Pending Verification</h3>
          <p className="mt-2 text-gray-600">
            Your business account is currently pending verification. Our team will review your information and notify you once approved.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const jobs = await prisma.job.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {(user as any)?.companyName || session.user.name}!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalApplications}</p>
                <p className="text-gray-600">Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{(user as any)?.isBusinessVerified ? "Verified" : "Pending"}</p>
                <p className="text-gray-600">Account Status</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="flex flex-col items-center justify-center p-6 h-auto">
              <Link href="/business/jobs/new">
                <Plus className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-gray-900 font-medium">Post New Job</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-auto">
              <Link href="/business/jobs">
                <Briefcase className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-gray-900 font-medium">Manage Jobs</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-auto">
              <Link href="/business/applications">
                <FileText className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-gray-900 font-medium">View Applications</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-auto">
              <Link href="/business/profile">
                <LayoutDashboard className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-gray-900 font-medium">Company Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
