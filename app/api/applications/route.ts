import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const applicationSchema = z.object({
  jobId: z.string().optional(),
  opleidingId: z.string().optional(),
  userId: z.string(),
  cvUrl: z.string().url().optional(),
  coverLetter: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    if (session.user.id !== body.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const validatedData = applicationSchema.parse(body)

    // Ensure either jobId or opleidingId is provided
    if (!validatedData.jobId && !validatedData.opleidingId) {
      return NextResponse.json(
        { error: "Either jobId or opleidingId must be provided" },
        { status: 400 }
      )
    }

    // Check for duplicate application
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: validatedData.userId,
        ...(validatedData.jobId
          ? { jobId: validatedData.jobId }
          : { opleidingId: validatedData.opleidingId }),
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 400 }
      )
    }

    // Get user's saved CV URL if not provided
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { cvUrl: true },
    })

    const finalCvUrl = validatedData.cvUrl || user?.cvUrl || null

    const application = await prisma.application.create({
      data: {
        userId: validatedData.userId,
        jobId: validatedData.jobId || null,
        opleidingId: validatedData.opleidingId || null,
        cvUrl: finalCvUrl,
        coverLetter: validatedData.coverLetter,
        status: "SUBMITTED",
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Application error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

