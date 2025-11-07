import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return profile
}

export async function requireAdmin() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return { user, profile }
}

export async function isAdmin(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === "admin"
}
