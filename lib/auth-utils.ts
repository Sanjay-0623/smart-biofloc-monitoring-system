import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { sql } from "./db"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function getUserProfile(userId: string) {
  try {
    const profiles = await sql`
      SELECT * FROM profiles WHERE id = ${userId}
    `
    return profiles[0] || null
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

export async function requireAdmin() {
  const user = await requireAuth()
  const profile = await getUserProfile((user as any).id)

  if (!profile || profile.role !== "admin") {
    redirect("/user/dashboard")
  }

  return { user, profile }
}

export async function isAdmin(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === "admin"
}
