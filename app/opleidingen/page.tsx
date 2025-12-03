import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { GraduationCap, MapPin, Clock } from "lucide-react"
import { JobCategory } from "@prisma/client"

interface OpleidingenPageProps {
  searchParams: {
    search?: string
    location?: string
    category?: string
  }
}

export default async function OpleidingenPage({ searchParams }: OpleidingenPageProps) {
  const where: any = {}

  if (searchParams.search) {
    where.title = { contains: searchParams.search, mode: "insensitive" }
  }
  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: "insensitive" }
  }
  if (searchParams.category && searchParams.category !== "all") {
    where.category = searchParams.category as JobCategory
  }
  
  // Filter out expired opleidingen
  // IMPORTANT: Run migration first: npx prisma db push
  where.isExpired = false

  const opleidingen = await prisma.opleiding.findMany({
    where,
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Browse Opleidingen</h1>
          <p className="text-gray-600">Discover training and development opportunities</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form action="/opleidingen" method="get" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="search"
                placeholder="Training title..."
                defaultValue={searchParams.search}
              />
              <Input
                name="location"
                placeholder="Location..."
                defaultValue={searchParams.location}
              />
              <Select name="category" defaultValue={searchParams.category || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.values(JobCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="md:col-span-3">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Opleidingen List */}
        <div className="space-y-4">
          {opleidingen.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No opleidingen found. Try adjusting your filters.
              </CardContent>
            </Card>
          ) : (
            opleidingen.map((opleiding) => (
              <Card key={opleiding.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{opleiding.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {opleiding.createdBy.name || "Unknown"}
                      </CardDescription>
                    </div>
                    <Link href={`/opleidingen/${opleiding.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    {opleiding.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {opleiding.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {opleiding.category.replace(/_/g, " ")}
                    </div>
                    {opleiding.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {opleiding.duration}
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-gray-700 line-clamp-2">{opleiding.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

