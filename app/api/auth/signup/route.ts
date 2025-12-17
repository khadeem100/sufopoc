import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { sendEmail, sendAdminNotification } from "@/lib/mail"

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "EXPERT", "AMBASSADOR", "BUSINESS"]),
  // Business-specific fields (optional for now)
  companyName: z.string().optional(),
  companyWebsite: z.string().url().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role as any,
        // Business-specific fields
        companyName: validatedData.companyName as any,
        companyWebsite: validatedData.companyWebsite as any,
        // Set business verification to false by default
        isBusinessVerified: (validatedData.role as any) === "BUSINESS" ? false : null as any,
      },
    })

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: "Welcome to Sufopoc!",
      text: `Hi ${user.name},

Welcome to Sufopoc! We are excited to have you on board.

Your account has been created successfully.

Best regards,
The Team`,
    })

    // Notify admin
    let notificationText = `New user registered:
Name: ${user.name}
Email: ${user.email}
Role: ${user.role}`
    
    // Special notification for business users
    if ((user.role as string) === "BUSINESS") {
      notificationText += `

Company Name: ${(user as any).companyName || 'Not provided'}
Company Website: ${(user as any).companyWebsite || 'Not provided'}

This business account requires verification. Please review and verify the company.`
    }

    await sendAdminNotification(
      `New User Signup${(user.role as string) === "BUSINESS" ? " - Business Account" : ""}`,
      notificationText
    )

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

