"use client"

import { PlaceCard } from "@/components/ui/place-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { User, Shield, CheckCircle, XCircle } from "lucide-react"

interface UserCardProps {
  id: string
  name: string | null
  email: string
  role: string
  isVerified?: boolean | null
  createdAt: string | Date
  imageUrl?: string | null
  onVerify?: () => void
  onDelete?: () => void
}

export function UserCard({
  id,
  name,
  email,
  role,
  isVerified,
  createdAt,
  imageUrl,
  onVerify,
  onDelete,
}: UserCardProps) {
  const router = useRouter()

  const images = imageUrl ? [imageUrl] : [
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&auto=format&fit=crop&q=60"
  ]

  const displayTags = [role.toLowerCase().replace("_", " ")]
  if (role === "AMBASSADOR") {
    displayTags.push(isVerified ? "Verified" : "Not Verified")
  }

  const roleIcon = role === "ADMIN" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />

  return (
    <PlaceCard
      images={images}
      tags={displayTags}
      title={name || "No Name"}
      subtitle={email}
      badgeText={new Date(createdAt).toLocaleDateString()}
      description={`User Role: ${role}`}
      footerText={isVerified === false && role === "AMBASSADOR" ? "Pending Verification" : "Active"}
      actionText="Manage"
      className="h-full w-full"
      extraActions={
        <div className="flex gap-2">
          {role === "AMBASSADOR" && !isVerified && onVerify && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-green-200 hover:bg-green-50 text-green-700"
              onClick={(e) => {
                e.preventDefault()
                onVerify()
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verify
            </Button>
          )}
          {onDelete && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-200 hover:bg-red-50 text-red-700"
              onClick={(e) => {
                e.preventDefault()
                onDelete()
              }}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      }
    />
  )
}
