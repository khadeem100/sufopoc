import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = "customer@sufopoc.com"
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@jobs.sufopoc.com"

interface SendEmailProps {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: SendEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.log("=== EMAIL MOCK ===")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log("==================")
    return { success: true }
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text: text || "",
      html: html,
    } as any)
    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export async function sendAdminNotification(subject: string, text: string) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Admin Notification] ${subject}`,
    text,
  })
}
