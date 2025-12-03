import { NextResponse } from "next/server"
import { predictQuality } from "@/lib/model"
import type { Reading } from "@/lib/model-data"

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Partial<Reading>
    const required: (keyof Reading)[] = ["ph", "temperature_c", "ultrasonic_cm", "turbidity_ntu"]
    for (const k of required) {
      if (typeof data[k] !== "number" || Number.isNaN(data[k])) {
        return NextResponse.json({ error: `Invalid or missing '${k}'` }, { status: 400 })
      }
    }
    const result = predictQuality(data as Reading)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid request" }, { status: 400 })
  }
}
