import type { NextAuthOptions } from "next-auth"
import { sql } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("[v0] Auth attempt for email:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("[v0] Missing credentials")
          throw new Error("Missing email or password")
        }

        try {
          const users = await sql`
            SELECT * FROM profiles WHERE email = ${credentials.email}
          `
          console.log("[v0] User query result:", users.length > 0 ? "User found" : "No user found")

          const user = users[0]

          if (!user || !user.password_hash) {
            console.log("[v0] Invalid user or no password hash")
            throw new Error("Invalid email or password")
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash)
          console.log("[v0] Password validation:", isValidPassword ? "Success" : "Failed")

          if (!isValidPassword) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.full_name,
            role: user.role || "user",
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          throw error
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("[v0] JWT callback - adding user to token:", user.email)
        token.id = user.id
        token.role = (user as any).role
        token.email = user.email
        token.name = user.name
      }
      console.log("[v0] JWT token created/updated")
      return token
    },
    async session({ session, token }) {
      console.log("[v0] Session callback - creating session for:", token.email)
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      console.log("[v0] Session created successfully")
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log("[v0] Redirect callback - url:", url, "baseUrl:", baseUrl)
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/user/dashboard`
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days session
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  debug: true, // Always enable debug for better logging
}
