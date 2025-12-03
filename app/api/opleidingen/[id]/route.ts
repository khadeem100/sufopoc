import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ProgramType } from "@prisma/client"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const opleiding = await prisma.opleiding.findUnique({
      where: { id: params.id },
    })

    if (!opleiding) {
      return NextResponse.json({ error: "Opleiding not found" }, { status: 404 })
    }

    return NextResponse.json(opleiding)
  } catch (error) {
    console.error("Opleiding fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

const updateOpleidingSchema = z.object({
  // Basis informatie
  title: z.string().min(1).optional(),
  partnerCountry: z.string().min(1).optional(),
  partnerSchool: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  longDescription: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  programType: z.nativeEnum(ProgramType).optional(),

  // School & Land informatie
  schoolAddress: z.string().nullable().optional(),
  schoolCity: z.string().nullable().optional(),
  schoolCountry: z.string().nullable().optional(),
  schoolEmail: z.string().email().nullable().optional(),
  schoolPhone: z.string().nullable().optional(),
  schoolWebsite: z.string().url().nullable().optional(),
  admissionRequirements: z.string().min(1).optional(),

  // Studie details
  studyDurationYears: z.number().int().positive().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  language: z.string().min(1).optional(),
  tuitionFeeYear: z.number().positive().nullable().optional(),
  scholarships: z.string().nullable().optional(),
  requiredDocuments: z.array(z.string()).optional(),

  // Application process
  applicationDeadline: z.string().datetime().nullable().optional(),
  processingTime: z.string().nullable().optional(),
  interviewRequired: z.boolean().optional(),
  intakeFormRequired: z.boolean().optional(),
  additionalTests: z.array(z.string()).optional(),

  // Media
  thumbnailUrl: z.string().url().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  promoVideoUrl: z.string().url().nullable().optional(),

  // Extra
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

    const opleiding = await prisma.opleiding.findUnique({
      where: { id: params.id },
    })

    if (!opleiding) {
      return NextResponse.json({ error: "Opleiding not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && opleiding.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = updateOpleidingSchema.parse(body)

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.partnerCountry !== undefined) updateData.partnerCountry = validatedData.partnerCountry
    if (validatedData.partnerSchool !== undefined) updateData.partnerSchool = validatedData.partnerSchool
    if (validatedData.shortDescription !== undefined) updateData.shortDescription = validatedData.shortDescription
    if (validatedData.longDescription !== undefined) updateData.longDescription = validatedData.longDescription
    if (validatedData.category !== undefined) updateData.category = validatedData.category
    if (validatedData.programType !== undefined) updateData.programType = validatedData.programType
    if (validatedData.schoolAddress !== undefined) updateData.schoolAddress = validatedData.schoolAddress
    if (validatedData.schoolCity !== undefined) updateData.schoolCity = validatedData.schoolCity
    if (validatedData.schoolCountry !== undefined) updateData.schoolCountry = validatedData.schoolCountry
    if (validatedData.schoolEmail !== undefined) updateData.schoolEmail = validatedData.schoolEmail
    if (validatedData.schoolPhone !== undefined) updateData.schoolPhone = validatedData.schoolPhone
    if (validatedData.schoolWebsite !== undefined) updateData.schoolWebsite = validatedData.schoolWebsite
    if (validatedData.admissionRequirements !== undefined) updateData.admissionRequirements = validatedData.admissionRequirements
    if (validatedData.studyDurationYears !== undefined) updateData.studyDurationYears = validatedData.studyDurationYears
    if (validatedData.startDate !== undefined) updateData.startDate = validatedData.startDate ? new Date(validatedData.startDate) : null
    if (validatedData.language !== undefined) updateData.language = validatedData.language
    if (validatedData.tuitionFeeYear !== undefined) updateData.tuitionFeeYear = validatedData.tuitionFeeYear
    if (validatedData.scholarships !== undefined) updateData.scholarships = validatedData.scholarships
    if (validatedData.requiredDocuments !== undefined) updateData.requiredDocuments = validatedData.requiredDocuments
    if (validatedData.applicationDeadline !== undefined) updateData.applicationDeadline = validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : null
    if (validatedData.processingTime !== undefined) updateData.processingTime = validatedData.processingTime
    if (validatedData.interviewRequired !== undefined) updateData.interviewRequired = validatedData.interviewRequired
    if (validatedData.intakeFormRequired !== undefined) updateData.intakeFormRequired = validatedData.intakeFormRequired
    if (validatedData.additionalTests !== undefined) updateData.additionalTests = validatedData.additionalTests
    if (validatedData.thumbnailUrl !== undefined) updateData.thumbnailUrl = validatedData.thumbnailUrl
    if (validatedData.bannerUrl !== undefined) updateData.bannerUrl = validatedData.bannerUrl
    if (validatedData.promoVideoUrl !== undefined) updateData.promoVideoUrl = validatedData.promoVideoUrl
    if (validatedData.isVisible !== undefined) updateData.isVisible = validatedData.isVisible
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags
    if (validatedData.documents !== undefined) updateData.documents = validatedData.documents
    if (validatedData.isExpired !== undefined) updateData.isExpired = validatedData.isExpired

    const updated = await prisma.opleiding.update({
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

    console.error("Opleiding update error:", error)
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

    const opleiding = await prisma.opleiding.findUnique({
      where: { id: params.id },
    })

    if (!opleiding) {
      return NextResponse.json({ error: "Opleiding not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && opleiding.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.opleiding.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Opleiding deleted successfully" })
  } catch (error) {
    console.error("Opleiding deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
