"use client"

import { OpleidingCard } from "@/components/ui/opleiding-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Session } from "next-auth"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

interface Opleiding {
  id: string
  title: string
  shortDescription?: string | null
  longDescription?: string | null
  description?: string | null
  category: string
  programType: string
  partnerCountry?: string | null
  partnerSchool?: string | null
  schoolCity?: string | null
  schoolCountry?: string | null
  location?: string | null
  studyDurationYears?: number | null
  duration?: string | null
  language?: string | null
  tuitionFeeYear?: number | null
  tags?: string[]
  thumbnailUrl?: string | null
  bannerUrl?: string | null
  isExpired: boolean
  createdAt: Date
  createdBy: {
    name: string | null
    email: string
  }
  applications: Array<{ id: string }>
}

interface AdminOpleidingenContentProps {
  session: Session
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  opleidingen: Opleiding[]
}

export function AdminOpleidingenContent({ session, links, opleidingen }: AdminOpleidingenContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOpleidingen = opleidingen.filter((opleiding) => {
    const query = searchQuery.toLowerCase()
    return (
      opleiding.title.toLowerCase().includes(query) ||
      opleiding.partnerSchool?.toLowerCase().includes(query) ||
      opleiding.category.toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout
      links={links}
      user={{
        name: session.user.name || null,
        email: session.user.email || "",
        image: session.user.image || null,
      }}
    >
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-black">Opleidingen Management</h2>
            <p className="text-gray-600 mt-2">Manage all opleidingen postings</p>
          </div>
          <Link href="/admin/opleidingen/new">
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Create New Opleiding
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search opleidingen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpleidingen.map((opleiding) => (
            <div key={opleiding.id} className="h-full">
              <OpleidingCard
                id={opleiding.id}
                title={opleiding.title}
                shortDescription={opleiding.shortDescription || undefined}
                longDescription={opleiding.longDescription || undefined}
                description={opleiding.description || undefined}
                category={opleiding.category}
                programType={opleiding.programType}
                partnerCountry={opleiding.partnerCountry || undefined}
                partnerSchool={opleiding.partnerSchool || undefined}
                schoolCity={opleiding.schoolCity || undefined}
                schoolCountry={opleiding.schoolCountry || undefined}
                location={opleiding.location || undefined}
                studyDurationYears={opleiding.studyDurationYears}
                duration={opleiding.duration || undefined}
                language={opleiding.language || undefined}
                tuitionFeeYear={opleiding.tuitionFeeYear}
                tags={opleiding.tags}
                thumbnailUrl={opleiding.thumbnailUrl || null}
                bannerUrl={opleiding.bannerUrl || null}
                createdAt={opleiding.createdAt}
                manageUrl={`/admin/opleidingen/${opleiding.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

