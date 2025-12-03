import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 })
  }

  const profiles = await sql`
    SELECT role FROM profiles WHERE id = ${(session.user as any).id}
  `

  const isAdmin = profiles[0]?.role === "admin"

  return NextResponse.json({ isAdmin })
}
