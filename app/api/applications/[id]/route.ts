import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"
import { z } from "zod"
import { sendEmail } from "@/lib/mail"

const updateSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission (ambassador/admin who created the job/opleiding)
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: { createdById: true },
        },
        opleiding: {
          select: { createdById: true },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const creatorId = application.job?.createdById || application.opleiding?.createdById
    if (
      session.user.role !== "ADMIN" &&
      creatorId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = updateSchema.parse(body)

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { status: validatedData.status },
      include: {
        user: { select: { email: true, name: true } },
        job: { select: { title: true } },
        opleiding: { select: { title: true } },
      },
    })

    // Send email notification
    const positionTitle = updated.job?.title || updated.opleiding?.title || "Application"
    let subject = `Application Update: ${positionTitle}`
    let message = `Hi ${updated.user.name},\n\nThe status of your application for ${positionTitle} has been updated to: ${updated.status}.`

    if (updated.status === 'REQUEST_INFO') {
      subject = `Action Required: Additional Documents for ${positionTitle}`
      message = `Hi ${updated.user.name},\n\nWe require some additional documents or information for your application to ${positionTitle}. Please log in to your dashboard to view the details and upload the requested files.\n\nBest regards,\nThe Team`
    } else if (updated.status === 'INTERVIEW') {
      message = `Hi ${updated.user.name},\n\nGood news! We would like to invite you for an interview for ${positionTitle}. We will contact you shortly to schedule a time.`
    } else if (updated.status === 'ACCEPTED') {
      message = `Hi ${updated.user.name},\n\nCongratulations! We are pleased to inform you that your application for ${positionTitle} has been accepted.`
    } else if (updated.status === 'REJECTED') {
      message = `Hi ${updated.user.name},\n\nThank you for your interest in ${positionTitle}. After careful consideration, we have decided not to proceed with your application at this time.`
    }

    await sendEmail({
      to: updated.user.email,
      subject,
      text: message,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Application update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

