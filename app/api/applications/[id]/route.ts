import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"
import { z } from "zod"

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

