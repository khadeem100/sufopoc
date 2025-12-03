import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { Plus } from "lucide-react"

export default async function AdminJobsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const jobs = await prisma.job.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin">
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost">Users</Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="ghost">Jobs</Button>
              </Link>
              <Link href="/admin/opleidingen">
                <Button variant="ghost">Opleidingen</Button>
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-black">Jobs Management</h2>
            <p className="text-gray-600 mt-2">Manage all job postings</p>
          </div>
          <Link href="/ambassador/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Jobs ({jobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.location}</p>
                      <p className="text-sm text-gray-600">
                        Created by: {job.createdBy.name || job.createdBy.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Applications: {job.applications.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {job.isExpired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          Expired
                        </span>
                      )}
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/ambassador/jobs/${job.id}`}>
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
    </div>
  )
}

