import { Resend } from "resend"

let resend: InstanceType<typeof Resend> | null = null;

function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

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

  const resendClient = getResendClient();
  if (!resendClient) {
    console.log("=== EMAIL MOCK (No Resend Client) ===")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log("==================")
    return { success: true }
  }

  try {
    const data = await resendClient.emails.send({
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
