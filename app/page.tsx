import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import HeroSection from "@/components/ui/hero-section"
import { DevelopmentNotice } from "@/components/development-notice"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Redirect to appropriate dashboard if logged in
  if (session?.user) {
    const role = session.user.role
    if (role === "ADMIN") redirect("/admin")
    if (role === "AMBASSADOR") redirect("/ambassador")
    if (role === "EXPERT") redirect("/expert")
    if (role === "STUDENT") redirect("/student")
  }

  return (
    <>
      <HeroSection />
      <DevelopmentNotice />
    </>
  )
}
