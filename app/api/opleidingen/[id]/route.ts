import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { JobCategory } from "@prisma/client"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const opleiding = await prisma.opleiding.findUnique({
      where: { id: params.id },
    })

    if (!opleiding) {
      return NextResponse.json({ error: "Opleiding not found" }, { status: 404 })
    }

    return NextResponse.json(opleiding)
  } catch (error) {
    console.error("Opleiding fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

const updateOpleidingSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  requirements: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  category: z.nativeEnum(JobCategory).optional(),
  isExpired: z.boolean().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const opleiding = await prisma.opleiding.findUnique({
      where: { id: params.id },
    })

    if (!opleiding) {
      return NextResponse.json({ error: "Opleiding not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && opleiding.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = updateOpleidingSchema.parse(body)

    const updated = await prisma.opleiding.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Opleiding update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const opleiding = await prisma.opleiding.findUnique({
      where: { id: params.id },
    })

    if (!opleiding) {
      return NextResponse.json({ error: "Opleiding not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && opleiding.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.opleiding.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Opleiding deleted successfully" })
  } catch (error) {
    console.error("Opleiding deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

