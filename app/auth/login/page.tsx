"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { signIn, useSession } from "next-auth/react"
import { Fish, AlertCircle, LogIn, CheckCircle2 } from "lucide-react"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const signupSuccess = searchParams.get("signup")

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/user/dashboard")
    }
  }, [status, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email.trim()) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    if (!password) {
      setError("Please enter your password")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting login for:", email)

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 15000))

      const signInPromise = signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      const result = (await Promise.race([signInPromise, timeoutPromise])) as any

      console.log("[v0] SignIn result:", result)

      if (result?.error) {
        console.log("[v0] Login error:", result.error)
        setError("Invalid email or password. Please try again.")
      } else if (result?.ok) {
        console.log("[v0] Login successful, redirecting...")
        window.location.href = "/user/dashboard"
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (error: any) {
      console.error("[v0] Login exception:", error)
      if (error?.message === "Request timed out") {
        setError("Login request timed out. Please check your connection and try again.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/modern-aquaculture-facility.jpg"
          alt="Aquaculture facility"
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-card" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary animate-float cursor-pointer transition-transform hover:scale-110">
                <Fish className="h-8 w-8 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold gradient-text">Smart Biofloc System</h1>
          </div>

          <Card className="glass-effect p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="mt-2 text-sm text-muted-foreground">Sign in to access your aquaculture dashboard</p>
            </div>

            {signupSuccess === "success" && (
              <Alert className="mb-6 border-secondary bg-secondary/10 animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <AlertDescription className="text-secondary">
                  Account created successfully! Please sign in to continue.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 transition-all focus:bg-background"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 transition-all focus:bg-background"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                Create one now
              </Link>
            </div>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">Secure authentication powered by NextAuth.js</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
