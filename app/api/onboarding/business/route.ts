import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const businessOnboardingSchema = z.object({
  bio: z.string().optional(),
  industry: z.string().optional(),
  employeeCount: z.number().nullable().optional(),
  companyWebsite: z.string().url().optional(),
  companyLogo: z.string().url().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a business
    if (session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = businessOnboardingSchema.parse(body)

    // Update user with business information
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: validatedData.bio,
        industry: validatedData.industry,
        employeeCount: validatedData.employeeCount,
        companyWebsite: validatedData.companyWebsite,
        companyLogo: validatedData.companyLogo,
      },
    })

    return NextResponse.json({ message: "Onboarding completed successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Business onboarding error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
