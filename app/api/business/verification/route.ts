import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role as string !== "BUSINESS") {
      return NextResponse.json({ verified: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    return NextResponse.json({ verified: (user as any)?.isBusinessVerified || false })
  } catch (error) {
    console.error("Error checking business verification:", error)
    return NextResponse.json({ verified: false, error: "Internal server error" }, { status: 500 })
  }
}
