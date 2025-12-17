import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifyBusinessSchema = z.object({
  userId: z.string(),
  verified: z.boolean(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = verifyBusinessSchema.parse(body)

    // Update business verification status
    const user = await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        isBusinessVerified: validatedData.verified as any,
      } as any,
    })

    // Send email notification to business if approved
    if (validatedData.verified) {
      const { sendEmail } = await import("@/lib/mail")
      
      await sendEmail({
        to: user.email,
        subject: "Your Business Account Has Been Approved!",
        text: `Congratulations! Your business account has been approved.

You can now log in to your dashboard and start posting jobs.

Best regards,
The Team`,
      })
    }

    return NextResponse.json({ 
      message: `Business ${validatedData.verified ? 'verified' : 'unverified'} successfully`,
      user 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Business verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
