import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required. Please fill in your full name, email, and password." },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM profiles WHERE email = ${email.toLowerCase().trim()}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please try logging in." },
        { status: 400 },
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = nanoid()

    // Create user
    await sql`
      INSERT INTO profiles (id, email, password_hash, full_name, role, created_at, updated_at)
      VALUES (
        ${userId},
        ${email.toLowerCase().trim()},
        ${passwordHash},
        ${fullName.trim()},
        'user',
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now sign in.",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "We encountered an error while creating your account. Please try again later." },
      { status: 500 },
    )
  }
}
