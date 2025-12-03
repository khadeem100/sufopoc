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
import { MapPin, GraduationCap, Clock, Globe } from "lucide-react"

export interface OpleidingCardProps {
  id: string
  title: string
  shortDescription?: string | null
  longDescription?: string | null
  description?: string | null
  category?: string | null
  programType?: string | null
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
  createdAt?: Date | string
  clampLines?: number
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
  tags,
  thumbnailUrl,
  bannerUrl,
  createdAt,
  clampLines = 3,
}: OpleidingCardProps) {
  const cover = bannerUrl || thumbnailUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop"
  const excerpt = shortDescription || longDescription || description || "No description available"
  const displayLocation = schoolCity && schoolCountry 
    ? `${schoolCity}, ${schoolCountry}` 
    : partnerCountry 
    ? partnerCountry 
    : location || "Location not specified"
  const displaySchool = partnerSchool || "Study Program"

  return (
    <Link href={`/opleidingen/${id}`}>
      <Card className="flex w-full max-w-sm flex-col gap-3 overflow-hidden rounded-3xl border p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        {cover && (
          <CardHeader className="p-0">
            <div className="relative h-56 w-full">
              <Image
                src={cover}
                alt={title}
                fill
                className="rounded-2xl object-cover"
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
            {programType && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">
                {programType}
              </Badge>
            )}
          </div>

          <h2 className="mb-2 text-2xl font-bold leading-tight text-card-foreground">
            {title}
          </h2>

          {displaySchool && (
            <p className="text-sm text-gray-600 mb-3 font-medium">
              {displaySchool}
            </p>
          )}

          <div className="space-y-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{displayLocation}</span>
            </div>
            {language && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{language}</span>
              </div>
            )}
            {(studyDurationYears || duration) && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {studyDurationYears ? `${studyDurationYears} year${studyDurationYears > 1 ? 's' : ''}` : duration}
                </span>
              </div>
            )}
            {tuitionFeeYear && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>€{tuitionFeeYear.toLocaleString()}/year</span>
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

