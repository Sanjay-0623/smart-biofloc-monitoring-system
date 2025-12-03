import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM profiles WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = nanoid()

    // Create user
    await sql`
      INSERT INTO profiles (id, email, password_hash, full_name, role, created_at, updated_at)
      VALUES (
        ${userId},
        ${email},
        ${passwordHash},
        ${fullName || ""},
        'user',
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({ success: true, message: "User created successfully" })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
