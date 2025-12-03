import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const studentOnboardingSchema = z.object({
  cvUrl: z.string().url().optional(),
  skills: z.array(z.string()),
  education: z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  }),
  experience: z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    description: z.string(),
  }),
  interests: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = studentOnboardingSchema.parse(body)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        cvUrl: validatedData.cvUrl,
        skills: validatedData.skills,
        education: validatedData.education,
        experience: validatedData.experience,
        interests: validatedData.interests as any[],
      },
    })

    return NextResponse.json({ message: "Onboarding completed" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

