import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/mail"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const userId = formData.get("userId") as string
    const action = formData.get("action") as string

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (action === "decline") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "STUDENT" }, // Revert to student
      })

      await sendEmail({
        to: user.email,
        subject: "Ambassador Application Update",
        text: `Hi ${user.name},\n\nThank you for your interest in becoming an ambassador. After reviewing your application, we have decided not to proceed at this time.\n\nBest regards,\nThe Team`,
      })

      return NextResponse.json({ message: "Ambassador application declined" })
    }

    // Verify action (Start OTP flow)
    const verificationCode = crypto.randomInt(100000, 999999).toString()
    // Code expires in 24 hours
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode,
        verificationCodeExpires,
      },
    })

    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-ambassador`

    await sendEmail({
      to: user.email,
      subject: "Ambassador Application Approved - Action Required",
      text: `Hi ${user.name},\n\nCongratulations! Your application to become an ambassador has been approved.\n\nTo complete the process and activate your ambassador privileges, please verify your account using the following code:\n\nVerification Code: ${verificationCode}\n\nVisit this link to enter your code: ${verificationLink}\n\nThis code will expire in 24 hours.\n\nBest regards,\nThe Team`,
    })

    return NextResponse.json({ message: "Verification code sent to user" })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

