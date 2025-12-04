"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { MapPin, DollarSign, Briefcase, Calendar, Building2 } from "lucide-react"

export interface JobCardProps {
  id: string
  title: string
  companyName?: string | null
  shortDescription?: string | null
  fullDescription?: string | null
  description?: string | null
  category?: string | null
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
  createdAt?: Date | string
  clampLines?: number
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
  tags,
  logoUrl,
  bannerUrl,
  createdAt,
  clampLines = 3,
}: JobCardProps) {
  const cover = bannerUrl || logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"
  const excerpt = shortDescription || fullDescription || description || "No description available"
  const displayLocation = city && country ? `${city}, ${country}` : location || "Location not specified"
  const hasSalary = salaryMin && salaryMax

  // Validate URL format
  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const imageSrc = cover && isValidUrl(cover) ? cover : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"

  return (
    <Link href={`/jobs/${id}`}>
      <Card className="flex w-full max-w-sm flex-col gap-3 overflow-hidden rounded-3xl border p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        {imageSrc && (
          <CardHeader className="p-0">
            <div className="relative h-56 w-full">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="rounded-2xl object-cover"
                unoptimized={!imageSrc.includes('unsplash.com') && !imageSrc.includes('localhost')}
              />
            </div>
          </CardHeader>
        )}

        <CardContent className="flex-grow p-3">
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {category && (
              <Badge className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:text-black">
                {category}
              </Badge>
            )}
            {jobType && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">
                {jobType.replace(/-/g, " ")}
              </Badge>
            )}
          </div>

          <h2 className="mb-2 text-2xl font-bold leading-tight text-card-foreground">
            {title}
          </h2>

          {companyName && (
            <p className="text-sm text-gray-600 mb-3 font-medium">
              {companyName}
            </p>
          )}

          <div className="space-y-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{displayLocation}</span>
            </div>
            {employmentType && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{employmentType.replace(/-/g, " ")}</span>
              </div>
            )}
            {hasSalary && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  {currency || "EUR"} {salaryMin.toLocaleString()} - {salaryMax.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <p
            className={cn("text-gray-600 text-sm", {
              "overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [display:-webkit-box]":
                clampLines && clampLines > 0,
            })}
            style={{
              WebkitLineClamp: clampLines,
            }}
          >
            {excerpt}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {createdAt && (
          <CardFooter className="flex items-center justify-end p-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Posted</p>
              <p className="text-sm font-semibold text-gray-600">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

