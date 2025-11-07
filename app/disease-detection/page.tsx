import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import DiseaseDetectionUpload from "@/components/disease-detection-upload"

export default async function DiseaseDetectionPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Fish Disease Detection</h1>
          <p className="text-muted-foreground">
            Upload an image of your fish to detect potential diseases using AI-powered analysis
          </p>
        </div>

        <DiseaseDetectionUpload userId={user.id} />
      </div>
    </div>
  )
}
