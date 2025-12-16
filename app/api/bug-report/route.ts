import { NextResponse } from "next/server"
import { z } from "zod"
import { sendAdminNotification } from "@/lib/mail"

const bugReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  steps: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = bugReportSchema.parse(body)
    
    const { title, description, steps, email } = validatedData

    // Get user info if available (from headers or session)
    const userAgent = req.headers.get("user-agent") || "Unknown"
    const referer = req.headers.get("referer") || "Unknown"
    const timestamp = new Date().toISOString()

    const emailBody = `
Bug Report Submitted

Title: ${title}

Description:
${description}

${steps ? `Steps to Reproduce:\n${steps}` : ""}

${email ? `Reporter Email: ${email}` : "Reporter Email: Not provided"}

---
Additional Information:
- Timestamp: ${timestamp}
- Page URL: ${referer}
- User Agent: ${userAgent}
`

    await sendAdminNotification(`Bug Report: ${title}`, emailBody)

    return NextResponse.json({
      success: true,
      message: "Bug report submitted successfully",
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error processing bug report:", error)
    return NextResponse.json(
      { error: "Failed to process bug report" },
      { status: 500 }
    )
  }
}
