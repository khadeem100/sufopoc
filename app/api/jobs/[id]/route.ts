import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Job fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

const updateJobSchema = z.object({
  // Basic job info
  title: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  jobType: z.string().min(1).optional(),
  seniorityLevel: z.string().min(1).optional(),
  employmentType: z.string().min(1).optional(),

  // Location & expat-specific
  country: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  relocationSupport: z.boolean().optional(),
  visaSponsorship: z.boolean().optional(),
  visaType: z.string().nullable().optional(),
  housingSupport: z.boolean().optional(),
  relocationPackage: z.string().nullable().optional(),

  // Job description details
  shortDescription: z.string().min(1).optional(),
  fullDescription: z.string().min(1).optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  requiredLanguages: z.array(z.string()).optional(),
  optionalSkills: z.array(z.string()).optional(),

  // Salary & benefits
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  bonusOptions: z.string().nullable().optional(),
  extraBenefits: z.array(z.string()).optional(),

  // Application requirements
  requiredDocuments: z.array(z.string()).optional(),
  interviewRequired: z.boolean().optional(),
  interviewFormat: z.string().nullable().optional(),
  additionalTests: z.array(z.string()).optional(),

  // Process timeline
  applicationDeadline: z.string().nullable().optional(),
  hiringTimeline: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  positionsAvailable: z.number().int().positive().optional(),

  // Media
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  promoVideoUrl: z.string().nullable().optional(),

  // Internal
  isVisible: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  isExpired: z.boolean().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && job.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()

    // Preprocess data: convert empty strings to null for optional fields
    const preprocessedData: any = { ...body }
    
    if ('visaType' in body) preprocessedData.visaType = body.visaType === "" ? null : body.visaType
    if ('relocationPackage' in body) preprocessedData.relocationPackage = body.relocationPackage === "" ? null : body.relocationPackage
    if ('currency' in body) preprocessedData.currency = body.currency === "" ? null : body.currency
    if ('bonusOptions' in body) preprocessedData.bonusOptions = body.bonusOptions === "" ? null : body.bonusOptions
    if ('interviewFormat' in body) preprocessedData.interviewFormat = body.interviewFormat === "" ? null : body.interviewFormat
    if ('hiringTimeline' in body) preprocessedData.hiringTimeline = body.hiringTimeline === "" ? null : body.hiringTimeline
    if ('logoUrl' in body) preprocessedData.logoUrl = body.logoUrl === "" ? null : body.logoUrl
    if ('bannerUrl' in body) preprocessedData.bannerUrl = body.bannerUrl === "" ? null : body.bannerUrl
    if ('promoVideoUrl' in body) preprocessedData.promoVideoUrl = body.promoVideoUrl === "" ? null : body.promoVideoUrl
    
    if ('applicationDeadline' in body && body.applicationDeadline !== null && body.applicationDeadline !== "") {
      preprocessedData.applicationDeadline = new Date(body.applicationDeadline)
    } else if ('applicationDeadline' in body && body.applicationDeadline === "") {
      preprocessedData.applicationDeadline = null
    }
    
    if ('startDate' in body && body.startDate !== null && body.startDate !== "") {
      preprocessedData.startDate = new Date(body.startDate)
    } else if ('startDate' in body && body.startDate === "") {
      preprocessedData.startDate = null
    }

    if ('salaryMin' in body) {
      preprocessedData.salaryMin = body.salaryMin === "" || body.salaryMin === null ? null : parseFloat(body.salaryMin)
    }
    if ('salaryMax' in body) {
      preprocessedData.salaryMax = body.salaryMax === "" || body.salaryMax === null ? null : parseFloat(body.salaryMax)
    }

    const validatedData = updateJobSchema.parse(preprocessedData)

    // Convert date strings to Date objects if present
    const updateData: any = { ...validatedData }
    if (validatedData.applicationDeadline !== undefined) {
      updateData.applicationDeadline = validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : null
    }
    if (validatedData.startDate !== undefined) {
      updateData.startDate = validatedData.startDate ? new Date(validatedData.startDate) : null
    }

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Job update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && job.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.job.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Job deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
