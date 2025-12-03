import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Briefcase, GraduationCap, FileText } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default async function AmbassadorDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const jobs = await prisma.job.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const opleidingen = await prisma.opleiding.findMany({
    where: { createdById: session.user.id },
    include: {
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const isVerified = user?.isVerified || session.user.role === "ADMIN"

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Ambassador Dashboard</h1>
              <Link href="/jobs">
                <Button variant="ghost">Browse Jobs</Button>
              </Link>
              <Link href="/opleidingen">
                <Button variant="ghost">Browse Opleidingen</Button>
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black">Welcome, {session.user.name}!</h2>
          <p className="text-gray-600 mt-2">Manage your job postings and opleidingen</p>
        </div>

        {!isVerified && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                Your account is pending verification. You'll be able to create postings once verified by an admin.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Jobs Created</CardTitle>
                  <CardDescription>{jobs.length} total jobs</CardDescription>
                </div>
                {isVerified && (
                  <Link href="/ambassador/jobs/new">
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      New Job
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="text-gray-600">No jobs created yet</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {job.applications.length} applications
                          </p>
                        </div>
                        <Link href={`/ambassador/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Opleidingen Created</CardTitle>
                  <CardDescription>{opleidingen.length} total opleidingen</CardDescription>
                </div>
                {isVerified && (
                  <Link href="/ambassador/opleidingen/new">
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      New Opleiding
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {opleidingen.length === 0 ? (
                <p className="text-gray-600">No opleidingen created yet</p>
              ) : (
                <div className="space-y-4">
                  {opleidingen.map((opleiding) => (
                    <div key={opleiding.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{opleiding.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {opleiding.applications.length} applications
                          </p>
                        </div>
                        <Link href={`/ambassador/opleidingen/${opleiding.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
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

