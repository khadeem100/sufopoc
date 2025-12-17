import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function BusinessJobsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role as string !== "BUSINESS") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Jobs</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Business job management coming soon...</p>
        </div>
      </div>
    </div>
  )
}
