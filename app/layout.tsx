import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import UserNav from "@/components/user-nav"
import AdminNav from "@/components/admin-nav"
import SessionProvider from "@/components/session-provider"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  weight: ["400", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Smart Biofloc Monitoring System",
  description: "AI-powered fish disease detection and water quality monitoring",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  let isAdmin = false
  if (user) {
    const profiles = await sql`
      SELECT role FROM profiles WHERE id = ${(user as any).id}
    `
    isAdmin = profiles[0]?.role === "admin"
  }

  return (
    <html lang="en">
      <body className={`font-sans ${workSans.variable} ${openSans.variable}`}>
        <SessionProvider session={session}>
          {user && (isAdmin ? <AdminNav /> : <UserNav />)}
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}
