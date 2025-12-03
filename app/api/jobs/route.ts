import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { JobType, JobCategory } from "@prisma/client"

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().min(1),
  location: z.string().min(1),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  type: z.nativeEnum(JobType),
  category: z.nativeEnum(JobCategory),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if ambassador is verified
    if (session.user.role === "AMBASSADOR") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })
      if (!user?.isVerified) {
        return NextResponse.json(
          { error: "Your account must be verified to create jobs" },
          { status: 403 }
        )
      }
    }

    const body = await req.json()
    const validatedData = jobSchema.parse(body)

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Job creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

