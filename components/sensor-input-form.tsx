"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type Reading = {
  ph: number
  temperature_c: number
  dissolved_oxygen_mg_l: number
  tds_ppm: number
  salinity_ppt: number
  ammonia_mg_l: number
  nitrite_mg_l: number
  nitrate_mg_l: number
  alkalinity_mg_l: number
}

const defaultReading: Reading = {
  ph: 7.4,
  temperature_c: 28,
  dissolved_oxygen_mg_l: 5.6,
  tds_ppm: 1150,
  salinity_ppt: 3,
  ammonia_mg_l: 0.2,
  nitrite_mg_l: 0.08,
  nitrate_mg_l: 22,
  alkalinity_mg_l: 150,
}

export function SensorInputForm() {
  const [reading, setReading] = useState<Reading>(defaultReading)
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    score: number
    category: string
    advice: { summary: string; issues: string[]; actions: string[] }
  }>(null)

  async function submit() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reading),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Prediction failed")
      setResult(json)
    } catch (e: any) {
      toast({ title: "Prediction error", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function onChange(name: keyof Reading, value: string) {
    setReading((r) => ({ ...r, [name]: Number(value) }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Reading</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <LabeledInput label="pH" value={reading.ph} onChange={(v) => onChange("ph", v)} step="0.01" />
          <LabeledInput
            label="Temp (°C)"
            value={reading.temperature_c}
            onChange={(v) => onChange("temperature_c", v)}
            step="0.1"
          />
          <LabeledInput
            label="DO (mg/L)"
            value={reading.dissolved_oxygen_mg_l}
            onChange={(v) => onChange("dissolved_oxygen_mg_l", v)}
            step="0.1"
          />
          <LabeledInput label="TDS (ppm)" value={reading.tds_ppm} onChange={(v) => onChange("tds_ppm", v)} />
          <LabeledInput
            label="Salinity (ppt)"
            value={reading.salinity_ppt}
            onChange={(v) => onChange("salinity_ppt", v)}
            step="0.1"
          />
          <LabeledInput
            label="Ammonia (mg/L)"
            value={reading.ammonia_mg_l}
            onChange={(v) => onChange("ammonia_mg_l", v)}
            step="0.01"
          />
          <LabeledInput
            label="Nitrite (mg/L)"
            value={reading.nitrite_mg_l}
            onChange={(v) => onChange("nitrite_mg_l", v)}
            step="0.01"
          />
          <LabeledInput
            label="Nitrate (mg/L)"
            value={reading.nitrate_mg_l}
            onChange={(v) => onChange("nitrate_mg_l", v)}
            step="0.1"
          />
          <LabeledInput
            label="Alkalinity (mg/L)"
            value={reading.alkalinity_mg_l}
            onChange={(v) => onChange("alkalinity_mg_l", v)}
          />
        </div>

        <div className="space-y-3">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Predicting..." : "Predict Quality"}
          </Button>

          {result && (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="text-sm">
                Score: <b>{result.score}</b> —{" "}
                <b
                  className={
                    result.category === "good"
                      ? "text-sky-600"
                      : result.category === "warning"
                        ? "text-orange-500"
                        : "text-red-600"
                  }
                >
                  {result.category.toUpperCase()}
                </b>{" "}
                — {result.advice.summary}
              </div>

              {result.category !== "good" && result.advice.actions.length > 0 && (
                <div className="mt-3 space-y-2 border-t pt-3">
                  <h4 className="font-semibold text-sm">Issues Detected:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                    {result.advice.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-sm mt-3">Recommended Actions:</h4>
                  <ul className="list-decimal list-inside space-y-1 text-sm">
                    {result.advice.actions.map((action, i) => (
                      <li key={i} className="text-foreground">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  step,
}: {
  label: string
  value: number
  onChange: (v: string) => void
  step?: string
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-foreground/70">{label}</span>
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        step={step ?? "1"}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
