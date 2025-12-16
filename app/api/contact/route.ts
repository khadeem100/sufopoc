import { NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail, sendAdminNotification } from "@/lib/mail"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = contactSchema.parse(body)

    const { name, email, subject, message } = validatedData

    // 1. Send confirmation to user
    await sendEmail({
      to: email,
      subject: `Received: ${subject}`,
      text: `Hi ${name},\n\nThank you for contacting us. We have received your message regarding "${subject}" and will get back to you shortly.\n\nYour Message:\n${message}\n\nBest regards,\nThe Team`,
    })

    // 2. Send notification to admin
    await sendAdminNotification(
      `New Contact Form Submission: ${subject}`,
      `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    )

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
