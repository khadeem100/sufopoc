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
  startDate: z.string().nullable().optional(),
  language: z.string().min(1),
  tuitionFeeYear: z.number().positive().nullable().optional(),
  scholarships: z.string().nullable().optional(),
  requiredDocuments: z.array(z.string()).default([]),

  // Application process
  applicationDeadline: z.string().nullable().optional(),
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
    
    // Preprocess: convert empty strings to null for optional fields
    const preprocessedBody = {
      ...body,
      schoolEmail: body.schoolEmail === "" ? null : body.schoolEmail,
      schoolWebsite: body.schoolWebsite === "" ? null : body.schoolWebsite,
      bannerUrl: body.bannerUrl === "" ? null : body.bannerUrl,
      promoVideoUrl: body.promoVideoUrl === "" ? null : body.promoVideoUrl,
      schoolAddress: body.schoolAddress === "" ? null : body.schoolAddress,
      schoolCity: body.schoolCity === "" ? null : body.schoolCity,
      schoolCountry: body.schoolCountry === "" ? null : body.schoolCountry,
      schoolPhone: body.schoolPhone === "" ? null : body.schoolPhone,
      scholarships: body.scholarships === "" ? null : body.scholarships,
      processingTime: body.processingTime === "" ? null : body.processingTime,
      startDate: body.startDate === "" ? null : body.startDate,
      applicationDeadline: body.applicationDeadline === "" ? null : body.applicationDeadline,
    }
    
    const validatedData = opleidingSchema.parse(preprocessedBody)
    
    console.log("Creating opleiding with validated data keys:", Object.keys(validatedData))

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
        requiredDocuments: validatedData.requiredDocuments || [],
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
      console.error("Validation error:", error.errors)
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Opleiding creation error:", error)
    
    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      console.error("Prisma error code:", prismaError.code)
      console.error("Prisma error meta:", prismaError.meta)
      
      // Check for missing column/table error
      if (prismaError.code === 'P2022' || 
          prismaError.code === 'P2001' ||
          prismaError.message?.includes('column') || 
          prismaError.message?.includes('does not exist') ||
          prismaError.message?.includes('Unknown column') ||
          prismaError.meta?.column) {
        return NextResponse.json(
          { 
            error: "Database schema mismatch", 
            message: "The database needs to be migrated. The new Opleiding model fields are not in the database yet.",
            details: prismaError.message || `Column: ${prismaError.meta?.column}`,
            solution: "Run: npx prisma db push (for development) or npx prisma migrate dev (for production)"
          },
          { status: 500 }
        )
      }
      
      // Check for enum errors
      if (prismaError.code === 'P2003' || prismaError.message?.includes('enum') || prismaError.message?.includes('ProgramType')) {
        return NextResponse.json(
          { 
            error: "Database schema mismatch", 
            message: "The ProgramType enum needs to be created in the database.",
            details: prismaError.message,
            solution: "Run: npx prisma db push to sync the schema"
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
