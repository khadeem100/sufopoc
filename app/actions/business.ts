import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function isBusinessVerified() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role as string !== "BUSINESS") {
      return { verified: false, error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    return { verified: (user as any)?.isBusinessVerified || false, error: null }
  } catch (error) {
    console.error("Error checking business verification:", error)
    return { verified: false, error: "Internal server error" }
  }
}
