import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const ambassadorOnboardingSchema = z.object({
  bio: z.string(),
  region: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = ambassadorOnboardingSchema.parse(body)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: validatedData.bio,
        region: validatedData.region,
        isVerified: false, // Requires admin approval
      },
    })

    return NextResponse.json({ message: "Onboarding completed. Pending verification." })
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

