import { type NextRequest, NextResponse } from "next/server"
import { validateCredentials, createSession } from "@/lib/auth-simple"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    let user
    try {
      user = await validateCredentials(email, password)
    } catch (dbError) {
      console.error("[v0] Database error during login:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed. Please check if DATABASE_URL is set in .env.local",
          details: "See VSCODE_SETUP_GUIDE.md for setup instructions",
        },
        { status: 500 },
      )
    }

    if (!user) {
      console.log("[v0] Invalid credentials")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("[v0] Login successful for:", user.email)

    await createSession(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        error: "Login failed. Please try again.",
        hint: "Check terminal logs for details",
      },
      { status: 500 },
    )
  }
}
