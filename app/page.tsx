import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Briefcase, GraduationCap, Users, TrendingUp } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-black" />
              <span className="ml-2 text-xl font-semibold text-black">JobPlatform</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/jobs">
                <Button variant="ghost">Jobs</Button>
              </Link>
              <Link href="/opleidingen">
                <Button variant="ghost">Opleidingen</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Find Your Dream Job or Training
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with opportunities that match your skills and ambitions. 
            Whether you're a student, expert, or looking to grow, we've got you covered.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/jobs">
              <Button size="lg">Browse Jobs</Button>
            </Link>
            <Link href="/opleidingen">
              <Button size="lg" variant="outline">Explore Trainings</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Briefcase className="h-10 w-10 text-black mb-4" />
              <CardTitle>Find Jobs</CardTitle>
              <CardDescription>
                Browse thousands of job opportunities from top companies
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-black mb-4" />
              <CardTitle>Learn & Grow</CardTitle>
              <CardDescription>
                Access professional training and development programs
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-black mb-4" />
              <CardTitle>Career Growth</CardTitle>
              <CardDescription>
                Track your applications and advance your career
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of professionals already using our platform
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 JobPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

