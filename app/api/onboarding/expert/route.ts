import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const expertOnboardingSchema = z.object({
  expertise: z.array(z.string()),
  portfolioLinks: z.array(z.string().url()),
  yearsOfExperience: z.number(),
  jobPreferences: z.object({
    remote: z.boolean(),
    location: z.string(),
    salaryMin: z.string(),
  }),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      console.error("Onboarding attempt without session")
      return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 })
    }
    
    const body = await req.json()
    const validatedData = expertOnboardingSchema.parse(body)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        expertise: validatedData.expertise,
        portfolioLinks: validatedData.portfolioLinks,
        yearsOfExperience: validatedData.yearsOfExperience,
        jobPreferences: validatedData.jobPreferences,
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

