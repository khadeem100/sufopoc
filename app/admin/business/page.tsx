import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Briefcase, GraduationCap, FileText, Users, LogOut, Check, X } from "lucide-react"

export default async function AdminBusinessPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Get all unverified businesses
  const unverifiedBusinesses = await prisma.user.findMany({
    where: { 
      role: "BUSINESS" as any,
      isBusinessVerified: false as any
    },
    orderBy: { createdAt: "desc" },
  })

  // Get all verified businesses
  const verifiedBusinesses = await prisma.user.findMany({
    where: { 
      role: "BUSINESS" as any,
      isBusinessVerified: true as any
    },
    orderBy: { createdAt: "desc" },
  })

  const handleVerifyBusiness = async (userId: string, verified: boolean) => {
    "use server"
    
    try {
      const response = await fetch("/api/admin/verify-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, verified }),
      })

      if (!response.ok) {
        throw new Error("Failed to update business verification status")
      }

      // Refresh the page
      redirect("/admin/business")
    } catch (error) {
      console.error("Error updating business verification:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-gray-600 mt-2">Manage business account verifications</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Unverified Businesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                Pending Verification
              </CardTitle>
              <CardDescription>
                Businesses awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unverifiedBusinesses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No businesses pending verification</p>
              ) : (
                <div className="space-y-4">
                  {unverifiedBusinesses.map((business) => (
                    <div key={business.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{(business as any).companyName || business.name}</h3>
                          <p className="text-sm text-gray-600">{business.email}</p>
                          {(business as any).companyWebsite && (
                            <p className="text-sm text-gray-500">{(business as any).companyWebsite}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <form action={() => handleVerifyBusiness(business.id, true)}>
                            <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                              <Check className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          </form>
                          <form action={() => handleVerifyBusiness(business.id, false)}>
                            <Button type="submit" size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Verified Businesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Verified Businesses
              </CardTitle>
              <CardDescription>
                Approved business accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verifiedBusinesses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No verified businesses</p>
              ) : (
                <div className="space-y-4">
                  {verifiedBusinesses.map((business) => (
                    <div key={business.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{(business as any).companyName || business.name}</h3>
                          <p className="text-sm text-gray-600">{business.email}</p>
                          {(business as any).companyWebsite && (
                            <p className="text-sm text-gray-500">{(business as any).companyWebsite}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <form action={() => handleVerifyBusiness(business.id, false)}>
                            <Button type="submit" size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
