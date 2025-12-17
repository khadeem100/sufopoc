import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function BusinessProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role as string !== "BUSINESS") {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">Manage your company information</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Your company details and verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{(user as any)?.companyName || "Not provided"}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Company Website</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {(user as any)?.companyWebsite ? (
                        <a href={(user as any)?.companyWebsite} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {(user as any)?.companyWebsite}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (user as any)?.isBusinessVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {(user as any)?.isBusinessVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button asChild>
                  <Link href="/business">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
