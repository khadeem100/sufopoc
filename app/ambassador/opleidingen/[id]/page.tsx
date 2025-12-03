import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationList } from "@/components/application-list"

export default async function ManageOpleidingPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
    redirect("/")
  }

  const opleiding = await prisma.opleiding.findUnique({
    where: { id: params.id },
    include: {
      applications: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!opleiding || (opleiding.createdById !== session.user.id && session.user.role !== "ADMIN")) {
    redirect("/ambassador")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/ambassador">
          <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{opleiding.title}</CardTitle>
              {opleiding.location && (
                <CardDescription>{opleiding.location}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Category:</span> {opleiding.category.replace(/_/g, " ")}</p>
                {opleiding.duration && (
                  <p><span className="font-semibold">Duration:</span> {opleiding.duration}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Applications ({opleiding.applications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationList applications={opleiding.applications} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

