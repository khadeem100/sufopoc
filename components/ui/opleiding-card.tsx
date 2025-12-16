"use client"

import { PlaceCard } from "@/components/ui/place-card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface OpleidingCardProps {
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
  createdAt: string | Date
  manageUrl?: string
}

export function OpleidingCard({
  id,
  title,
  shortDescription,
  longDescription,
  description,
  category,
  programType,
  partnerCountry,
  partnerSchool,
  schoolCity,
  schoolCountry,
  location,
  studyDurationYears,
  duration,
  language,
  tuitionFeeYear,
  tags = [],
  thumbnailUrl,
  bannerUrl,
  createdAt,
  manageUrl,
}: OpleidingCardProps) {
  const router = useRouter()

  // Construct images array
  const images: string[] = []
  if (thumbnailUrl) images.push(thumbnailUrl)
  if (bannerUrl && bannerUrl !== thumbnailUrl) images.push(bannerUrl)
  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60")
  }

  // Construct tags
  const displayTags = [category]
  if (programType) displayTags.push(programType.replace(/_/g, " "))
  if (language) displayTags.push(language)
  if (tags && tags.length > 0) displayTags.push(...tags.slice(0, 2))

  // Construct location string
  const locationString = partnerCountry 
    ? (schoolCity ? `${schoolCity}, ${partnerCountry}` : partnerCountry)
    : location || "Location not specified"

  // Construct subtitle (School Name)
  const subtitle = partnerSchool || "Partner School"

  // Construct footer text (Duration & Price)
  const durationText = studyDurationYears 
    ? `${studyDurationYears} year${studyDurationYears !== 1 ? 's' : ''}`
    : duration || "Duration Varies"
    
  const priceText = tuitionFeeYear 
    ? `€${tuitionFeeYear.toLocaleString()}/year` 
    : "Tuition varies"

  const footerText = `${durationText} • ${priceText}`

  // Description priority
  const desc = shortDescription || description || longDescription || ""

  const cardContent = (
    <PlaceCard
      images={images}
      tags={displayTags}
      title={title}
      subtitle={subtitle}
      badgeText={locationString}
      description={desc}
      footerText={footerText}
      actionText="View Program"
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
          <Link href={`/opleidingen/${id}`}>
            <Button className="group" size="sm">
              View Program
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      ) : undefined}
    />
  );

  if (manageUrl) {
    return (
      <div className="block h-full cursor-pointer" onClick={() => router.push(`/opleidingen/${id}`)}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/opleidingen/${id}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
