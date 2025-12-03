"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut({ redirect: false })
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoading}>
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
