import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { title, description, steps, email } = await req.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Get user info if available (from headers or session)
    const userAgent = req.headers.get("user-agent") || "Unknown"
    const referer = req.headers.get("referer") || "Unknown"
    const timestamp = new Date().toISOString()

    // Format the email content
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

    const emailSubject = `Bug Report: ${title}`
    const recipientEmail = "khadeemsmarty@gmail.com"

    // Try to send email using Resend API (recommended for production)
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "Bug Reports <onboarding@resend.dev>",
            to: [recipientEmail],
            subject: emailSubject,
            text: emailBody,
          }),
        })

        if (emailResponse.ok) {
          return NextResponse.json({
            success: true,
            message: "Bug report submitted successfully",
          })
        }
      } catch (error) {
        console.error("Resend API error:", error)
      }
    }

    // Fallback: Log to console (for development)
    // In production, configure RESEND_API_KEY in your .env file
    console.log("=== BUG REPORT ===")
    console.log(`To: ${recipientEmail}`)
    console.log(`Subject: ${emailSubject}`)
    console.log(emailBody)
    console.log("==================")

    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "⚠️  RESEND_API_KEY not configured. Bug reports are logged to console only.\n" +
        "To enable email sending, add RESEND_API_KEY to your .env file.\n" +
        "Get your API key from: https://resend.com/api-keys"
      )
    }

    // Return success even if email service is not configured
    // (bug report is logged to console)
    return NextResponse.json({
      success: true,
      message: "Bug report submitted successfully",
    })
  } catch (error: any) {
    console.error("Error processing bug report:", error)
    return NextResponse.json(
      { error: "Failed to process bug report" },
      { status: 500 }
    )
  }
}
