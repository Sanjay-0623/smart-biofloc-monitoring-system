import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth-simple"
import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileImage, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== "admin") {
    redirect("/auth/login")
  }

  // Fetch statistics
  const userCount = await sql`SELECT COUNT(*) as count FROM profiles`
  const totalUsers = userCount[0]?.count || 0

  const detectionCount = await sql`SELECT COUNT(*) as count FROM fish_disease_detections`
  const totalDiseaseDetections = detectionCount[0]?.count || 0

  // Fetch recent activity
  const recentDiseases = await sql`
    SELECT d.*, p.full_name 
    FROM fish_disease_detections d
    LEFT JOIN profiles p ON d.user_id = p.id
    ORDER BY d.created_at DESC 
    LIMIT 5
  `

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, view analytics, and monitor system activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disease Detections</CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDiseaseDetections}</div>
              <p className="text-xs text-muted-foreground">Total analyses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disease Detections</CardTitle>
              <CardDescription>Review all fish disease analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/disease-detections">
                  <FileImage className="mr-2 h-4 w-4" />
                  View Detections
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Disease Detections</CardTitle>
            <CardDescription>Latest fish health analyses across all users</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDiseases && recentDiseases.length > 0 ? (
              <div className="space-y-3">
                {recentDiseases.map((detection: any) => (
                  <div key={detection.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{detection.disease_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {detection.full_name || "Unknown User"} • {new Date(detection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{(detection.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
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
