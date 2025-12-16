"use client"

import { PlaceCard } from "@/components/ui/place-card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface JobCardProps {
  id: string
  title: string
  companyName: string
  shortDescription?: string | null
  fullDescription?: string | null
  description?: string | null
  category: string
  jobType?: string | null
  employmentType?: string | null
  city?: string | null
  country?: string | null
  location?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  currency?: string | null
  tags?: string[]
  logoUrl?: string | null
  bannerUrl?: string | null
  createdAt: string | Date
  manageUrl?: string
}

export function JobCard({
  id,
  title,
  companyName,
  shortDescription,
  fullDescription,
  description,
  category,
  jobType,
  employmentType,
  city,
  country,
  location,
  salaryMin,
  salaryMax,
  currency,
  tags = [],
  logoUrl,
  bannerUrl,
  createdAt,
  manageUrl,
}: JobCardProps) {
  const router = useRouter()

  // Construct images array - prioritize banner, fallback to logo or placeholders
  const images: string[] = []
  if (bannerUrl) images.push(bannerUrl)
  if (logoUrl) images.push(logoUrl)
  if (images.length === 0) {
    // Add a default placeholder if no images
    images.push("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60")
  }

  // Construct tags
  const displayTags = [category]
  if (jobType) displayTags.push(jobType.replace("-", " "))
  if (employmentType) displayTags.push(employmentType)
  if (tags && tags.length > 0) displayTags.push(...tags.slice(0, 2))

  // Construct location string
  const locationString = city && country ? `${city}, ${country}` : location || "Remote"

  // Construct salary string
  const salaryString = salaryMin && salaryMax 
    ? `${currency || "€"}${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}` 
    : "Salary not specified"

  // Description priority
  const desc = shortDescription || description || fullDescription || ""

  const cardContent = (
    <PlaceCard
      images={images}
      tags={displayTags}
      title={title}
      subtitle={companyName}
      badgeText={locationString}
      description={desc}
      footerText={salaryString}
      actionText="View Job"
      className="h-full max-w-full"
      extraActions={manageUrl ? (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(manageUrl)
            }}
          >
            Manage
          </Button>
          <Link href={`/jobs/${id}`}>
            <Button className="group" size="sm">
              View Job
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      ) : undefined}
    />
  );

  if (manageUrl) {
    return (
      <div className="block h-full cursor-pointer" onClick={() => router.push(`/jobs/${id}`)}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/jobs/${id}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
