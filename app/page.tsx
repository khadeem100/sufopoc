import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import HeroSection from "@/components/ui/hero-section"
import { DevelopmentNotice } from "@/components/development-notice"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Redirect to appropriate dashboard if logged in
  if (session?.user) {
    const role = session.user.role
    if (role === "ADMIN") redirect("/admin")
    if (role === "AMBASSADOR") redirect("/ambassador")
    if (role === "EXPERT") redirect("/expert")
    if (role === "STUDENT") redirect("/student")
    if (role === "BUSINESS") redirect("/business")
  }

  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Are you a business looking to hire?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Sign up to post jobs and showcase your company to our talented pool of candidates.
        </p>
        <Button asChild>
          <Link href="/auth/signup/business">Post Jobs as a Business</Link>
        </Button>
      </div>
      <DevelopmentNotice />
    </>
  )
}
