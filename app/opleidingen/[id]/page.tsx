import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, GraduationCap, Clock } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { ApplyOpleidingButton } from "@/components/apply-opleiding-button"

export default async function OpleidingDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const opleiding = await prisma.opleiding.findUnique({
    where: { id: params.id },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!opleiding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Opleiding not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/opleidingen">
          <Button variant="ghost" className="mb-4">← Back to Opleidingen</Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{opleiding.title}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Posted by {opleiding.createdBy.name}
                </CardDescription>
              </div>
              {session?.user && (session.user.role === "STUDENT" || session.user.role === "EXPERT") && (
                <ApplyOpleidingButton opleidingId={opleiding.id} userId={session.user.id} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {opleiding.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {opleiding.location}
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <GraduationCap className="h-5 w-5 mr-2" />
                {opleiding.category.replace("_", " ")}
              </div>
              {opleiding.duration && (
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  {opleiding.duration}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{opleiding.requirements}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

