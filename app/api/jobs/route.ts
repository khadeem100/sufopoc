import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const jobSchema = z.object({
  // Basic job info
  title: z.string().min(1),
  companyName: z.string().min(1),
  category: z.string().min(1),
  jobType: z.string().min(1),
  seniorityLevel: z.string().min(1),
  employmentType: z.string().min(1),

  // Location & expat-specific
  country: z.string().min(1),
  city: z.string().min(1),
  relocationSupport: z.boolean().default(false),
  visaSponsorship: z.boolean().default(false),
  visaType: z.string().nullable().optional(),
  housingSupport: z.boolean().default(false),
  relocationPackage: z.string().nullable().optional(),

  // Job description details
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  requiredLanguages: z.array(z.string()).default([]),
  optionalSkills: z.array(z.string()).default([]),

  // Salary & benefits
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  bonusOptions: z.string().nullable().optional(),
  extraBenefits: z.array(z.string()).default([]),

  // Application requirements
  requiredDocuments: z.array(z.string()).default([]),
  interviewRequired: z.boolean().default(false),
  interviewFormat: z.string().nullable().optional(),
  additionalTests: z.array(z.string()).default([]),

  // Process timeline
  applicationDeadline: z.date().nullable().optional(),
  hiringTimeline: z.string().nullable().optional(),
  startDate: z.date().nullable().optional(),
  positionsAvailable: z.number().int().positive().default(1),

  // Media
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  promoVideoUrl: z.string().nullable().optional(),

  // Internal
  isVisible: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "AMBASSADOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if ambassador is verified
    if (session.user.role === "AMBASSADOR") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })
      if (!user?.isVerified) {
        return NextResponse.json(
          { error: "Your account must be verified to create jobs" },
          { status: 403 }
        )
      }
    }

    const body = await req.json()

    // Preprocess data: convert empty strings to null for optional fields
    const preprocessedData = {
      ...body,
      visaType: body.visaType === "" ? null : body.visaType,
      relocationPackage: body.relocationPackage === "" ? null : body.relocationPackage,
      currency: body.currency === "" ? null : body.currency,
      bonusOptions: body.bonusOptions === "" ? null : body.bonusOptions,
      interviewFormat: body.interviewFormat === "" ? null : body.interviewFormat,
      hiringTimeline: body.hiringTimeline === "" ? null : body.hiringTimeline,
      logoUrl: body.logoUrl === "" ? null : body.logoUrl,
      bannerUrl: body.bannerUrl === "" ? null : body.bannerUrl,
      promoVideoUrl: body.promoVideoUrl === "" ? null : body.promoVideoUrl,
      applicationDeadline: body.applicationDeadline === "" ? null : (body.applicationDeadline ? new Date(body.applicationDeadline) : null),
      startDate: body.startDate === "" ? null : (body.startDate ? new Date(body.startDate) : null),
      salaryMin: body.salaryMin === "" || body.salaryMin === null ? null : parseFloat(body.salaryMin),
      salaryMax: body.salaryMax === "" || body.salaryMax === null ? null : parseFloat(body.salaryMax),
    }

    const validatedData = jobSchema.parse(preprocessedData)

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        applicationDeadline: validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : null,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors)
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      console.error("Prisma error code:", prismaError.code)
      console.error("Prisma error meta:", prismaError.meta)

      if (prismaError.code === 'P2022' || 
          prismaError.code === 'P2001' ||
          prismaError.message?.includes('column') || 
          prismaError.message?.includes('does not exist') ||
          prismaError.message?.includes('Unknown column') ||
          prismaError.meta?.column) {
        return NextResponse.json(
          {
            error: "Database schema mismatch. Please run database migration.",
            details: prismaError.message || `Column: ${prismaError.meta?.column}`,
            migrationHint: "Run: npx prisma db push or npx prisma migrate dev"
          },
          { status: 500 }
        )
      }

      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          {
            error: "User session invalid or user not found.",
            details: "The user account associated with this session no longer exists. Please sign out and sign in again.",
            code: "USER_NOT_FOUND"
          },
          { status: 401 }
        )
      }
    }

    console.error("Job creation error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined 
      },
      { status: 500 }
    )
  }
}
