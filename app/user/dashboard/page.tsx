import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth-simple"
import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, FileImage, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function UserDashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch statistics
  const diseaseDetections = await sql`
    SELECT COUNT(*) as count FROM fish_disease_detections WHERE user_id = ${user.id}
  `
  const diseaseCount = diseaseDetections[0]?.count || 0

  // Fetch recent detections
  const recentDiseases = await sql`
    SELECT * FROM fish_disease_detections 
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC 
    LIMIT 3
  `

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.full_name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your detections and view your analysis history</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fish Disease Scans</CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diseaseCount}</div>
              <p className="text-xs text-muted-foreground">Total analyses performed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biofloc Monitoring</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Real-time water quality tracking</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Fish Disease Detection</CardTitle>
              <CardDescription>Upload fish images for AI-powered disease analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/disease-detection">
                  <FileImage className="mr-2 h-4 w-4" />
                  Start Detection
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biofloc Monitoring</CardTitle>
              <CardDescription>Monitor water quality and predict system health</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Activity className="mr-2 h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Disease Detections</CardTitle>
            <CardDescription>Your latest fish health analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDiseases && recentDiseases.length > 0 ? (
              <div className="space-y-4">
                {recentDiseases.map((detection: any) => (
                  <div key={detection.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{detection.disease_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(detection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{(detection.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/user/disease-history">View All</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No detections yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
