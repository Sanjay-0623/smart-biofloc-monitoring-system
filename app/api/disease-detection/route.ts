import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"

function getImageHash(imageData: string): number {
  let hash = 0
  for (let i = 0; i < Math.min(imageData.length, 100); i++) {
    const char = imageData.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

async function detectFishDiseaseWithAI(
  imageUrl: string,
  imageData?: ArrayBuffer,
): Promise<{
  disease: string
  confidence: number
  description: string
  treatment: string
}> {
  try {
    console.log("[v0] Starting AI vision analysis")

    const models = ["openai/gpt-4o", "anthropic/claude-sonnet-4", "openai/gpt-4-turbo"]

    for (const model of models) {
      try {
        console.log("[v0] Attempting analysis with model:", model)

        const result = await generateText({
          model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert aquatic veterinarian. Analyze this fish image carefully for ANY signs of disease or health issues.

Look specifically for:
- White spots on body/fins (Ich/White Spot Disease)
- Ragged, frayed, or discolored fins (Fin Rot)
- Cotton-like white/gray patches (Fungal Infection)
- Swollen body with protruding scales (Dropsy)
- Red streaks or inflamed areas (Bacterial Infection)
- Clamped fins, lethargy, loss of appetite
- Clear eyes, intact fins, normal coloration (Healthy)

IMPORTANT: Return ONLY ONE disease diagnosis - the most likely condition based on the image.

Respond with valid JSON only:
{
  "disease": "exact disease name or Healthy",
  "confidence": 0.75,
  "description": "specific observations from the image",
  "treatment": "detailed treatment recommendations"
}`,
                },
                {
                  type: "image",
                  image: imageUrl,
                },
              ],
            },
          ],
          maxTokens: 500,
        })

        console.log("[v0] AI response received, parsing...")

        const jsonMatch = result.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          console.log("[v0] Successfully parsed AI response:", parsed.disease)
          return {
            disease: parsed.disease || "Unknown",
            confidence: parsed.confidence || 0.7,
            description: parsed.description || "Analysis completed",
            treatment: parsed.treatment || "Consult veterinarian",
          }
        }

        // Fallback if no JSON found
        console.log("[v0] No JSON found, analyzing text response")
        const text = result.text.toLowerCase()

        if (text.includes("healthy") && !text.includes("not healthy")) {
          return {
            disease: "Healthy",
            confidence: 0.75,
            description: "Fish appears to be in good health with no visible signs of disease. Continue monitoring.",
            treatment: "Maintain optimal water quality and balanced nutrition.",
          }
        }

        return {
          disease: "Analysis Incomplete",
          confidence: 0.5,
          description: result.text.substring(0, 300),
          treatment: "Please consult an aquatic veterinarian for proper diagnosis.",
        }
      } catch (modelError) {
        console.error(`[v0] Model ${model} failed:`, modelError)
        continue
      }
    }

    console.log("[v0] All AI models unavailable")
    return {
      disease: "Manual Inspection Required",
      confidence: 0,
      description:
        "AI analysis is currently unavailable. Please consult with an aquatic veterinarian or experienced aquarist to visually inspect your fish for signs of disease.",
      treatment:
        "Look for: white spots (Ich), ragged fins (Fin Rot), cotton patches (Fungus), swollen body (Dropsy), or red streaks (Bacterial infection). Seek professional advice if symptoms are present.",
    }
  } catch (error) {
    console.error("[v0] AI detection error:", error)
    return {
      disease: "Detection Error",
      confidence: 0,
      description: "Unable to complete automated analysis. Please try again or consult a veterinarian.",
      treatment: "Ensure the image is clear and well-lit. If problems persist, seek professional diagnosis.",
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Disease detection API called")

    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const userId = user.id
    let imageUrl: string
    let imageData: ArrayBuffer | undefined

    try {
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const timestamp = Date.now()
      const blobPath = `fish-disease/${userId}/${timestamp}-${sanitizedFilename}`

      const blob = await put(blobPath, file, {
        access: "public",
      })
      imageUrl = blob.url
      console.log("[v0] Image uploaded to Blob storage")
    } catch (blobError) {
      console.log("[v0] Blob storage unavailable, using base64")
      const bytes = await file.arrayBuffer()
      imageData = bytes
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString("base64")
      imageUrl = `data:${file.type};base64,${base64}`
    }

    console.log("[v0] Starting disease detection...")
    const detection = await detectFishDiseaseWithAI(imageUrl, imageData)

    if (imageUrl.startsWith("http")) {
      const { data, error } = await supabase
        .from("fish_disease_detections")
        .insert({
          user_id: userId,
          image_url: imageUrl,
          disease_name: detection.disease,
          confidence_score: detection.confidence,
          description: detection.description,
          treatment_suggestions: detection.treatment,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Database save error:", error)
        return NextResponse.json({
          disease: detection.disease,
          confidence: detection.confidence,
          description: detection.description,
          treatment: detection.treatment,
          imageUrl: imageUrl,
        })
      }

      return NextResponse.json({
        id: data.id,
        disease: data.disease_name,
        confidence: data.confidence_score,
        description: data.description,
        treatment: data.treatment_suggestions,
        imageUrl: data.image_url,
        createdAt: data.detected_at,
      })
    }

    // Local development response
    return NextResponse.json({
      disease: detection.disease,
      confidence: detection.confidence,
      description: detection.description,
      treatment: detection.treatment,
      imageUrl: imageUrl,
    })
  } catch (error) {
    console.error("[v0] Detection error:", error)
    return NextResponse.json(
      { error: "Detection failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
