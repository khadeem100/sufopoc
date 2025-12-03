import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ProgramType } from "@prisma/client"

const opleidingSchema = z.object({
  // Basis informatie
  title: z.string().min(1),
  partnerCountry: z.string().min(1),
  partnerSchool: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  category: z.string().min(1),
  programType: z.nativeEnum(ProgramType),

  // School & Land informatie
  schoolAddress: z.string().nullable().optional(),
  schoolCity: z.string().nullable().optional(),
  schoolCountry: z.string().nullable().optional(),
  schoolEmail: z.string().email().nullable().optional(),
  schoolPhone: z.string().nullable().optional(),
  schoolWebsite: z.string().url().nullable().optional(),
  admissionRequirements: z.string().min(1),

  // Studie details
  studyDurationYears: z.number().int().positive().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  language: z.string().min(1),
  tuitionFeeYear: z.number().positive().nullable().optional(),
  scholarships: z.string().nullable().optional(),
  requiredDocuments: z.array(z.string()).default([]),

  // Application process
  applicationDeadline: z.string().datetime().nullable().optional(),
  processingTime: z.string().nullable().optional(),
  interviewRequired: z.boolean().default(false),
  intakeFormRequired: z.boolean().default(false),
  additionalTests: z.array(z.string()).default([]),

  // Media
  thumbnailUrl: z.string().url(),
  bannerUrl: z.string().url().nullable().optional(),
  promoVideoUrl: z.string().url().nullable().optional(),

  // Extra
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
          { error: "Your account must be verified to create opleidingen" },
          { status: 403 }
        )
      }
    }

    const body = await req.json()
    const validatedData = opleidingSchema.parse(body)

    const opleiding = await prisma.opleiding.create({
      data: {
        title: validatedData.title,
        partnerCountry: validatedData.partnerCountry,
        partnerSchool: validatedData.partnerSchool,
        shortDescription: validatedData.shortDescription,
        longDescription: validatedData.longDescription,
        category: validatedData.category,
        programType: validatedData.programType,
        schoolAddress: validatedData.schoolAddress || null,
        schoolCity: validatedData.schoolCity || null,
        schoolCountry: validatedData.schoolCountry || null,
        schoolEmail: validatedData.schoolEmail || null,
        schoolPhone: validatedData.schoolPhone || null,
        schoolWebsite: validatedData.schoolWebsite || null,
        admissionRequirements: validatedData.admissionRequirements,
        studyDurationYears: validatedData.studyDurationYears || null,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        language: validatedData.language,
        tuitionFeeYear: validatedData.tuitionFeeYear || null,
        scholarships: validatedData.scholarships || null,
        requiredDocuments: validatedData.requiredDocuments,
        applicationDeadline: validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : null,
        processingTime: validatedData.processingTime || null,
        interviewRequired: validatedData.interviewRequired,
        intakeFormRequired: validatedData.intakeFormRequired,
        additionalTests: validatedData.additionalTests,
        thumbnailUrl: validatedData.thumbnailUrl,
        bannerUrl: validatedData.bannerUrl || null,
        promoVideoUrl: validatedData.promoVideoUrl || null,
        isVisible: validatedData.isVisible,
        tags: validatedData.tags,
        documents: validatedData.documents,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(opleiding, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Opleiding creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
