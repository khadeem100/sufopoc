import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Calendar, DollarSign, Building2, Globe, CheckCircle, XCircle, Clock, FileText, Award, Users, Plane, Home, Car } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { ApplyButton } from "@/components/apply-button"

import { JobDetailContent } from "@/components/job-detail-content"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const job = await prisma.job.findUnique({
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

  // Check if user has already applied
  let existingApplication = null
  if (session?.user) {
    existingApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        jobId: params.id,
      },
      select: {
        id: true,
        status: true,
      },
    })
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Job not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <JobDetailContent 
      job={job} 
      session={session} 
      existingApplication={existingApplication} 
    />
  )
}
