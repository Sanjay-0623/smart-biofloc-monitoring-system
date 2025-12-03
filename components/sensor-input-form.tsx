"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type Reading = {
  ph: number
  temperature_c: number
  ultrasonic_cm: number
  turbidity_ntu: number
}

const defaultReading: Reading = {
  ph: 7.4,
  temperature_c: 28.0,
  ultrasonic_cm: 80.0,
  turbidity_ntu: 50.0,
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
        <CardTitle>Live Sensor Readings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          <LabeledInput
            label="pH Level"
            value={reading.ph}
            onChange={(v) => onChange("ph", v)}
            step="0.01"
            min="0"
            max="14"
          />
          <LabeledInput
            label="Temperature (°C)"
            value={reading.temperature_c}
            onChange={(v) => onChange("temperature_c", v)}
            step="0.1"
            min="0"
            max="50"
          />
          <LabeledInput
            label="Water Level (cm)"
            value={reading.ultrasonic_cm}
            onChange={(v) => onChange("ultrasonic_cm", v)}
            step="0.1"
            min="0"
            max="200"
          />
          <LabeledInput
            label="Turbidity (NTU)"
            value={reading.turbidity_ntu}
            onChange={(v) => onChange("turbidity_ntu", v)}
            step="0.1"
            min="0"
            max="1000"
          />
        </div>

        <div className="space-y-3">
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Analyzing..." : "Analyze Water Quality"}
          </Button>

          {result && (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="text-sm">
                Quality Score: <b className="text-lg">{result.score}</b> / 100 —{" "}
                <b
                  className={
                    result.category === "good"
                      ? "text-green-600"
                      : result.category === "warning"
                        ? "text-orange-500"
                        : "text-red-600"
                  }
                >
                  {result.category.toUpperCase()}
                </b>
              </div>
              <p className="text-sm text-foreground/70">{result.advice.summary}</p>

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
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: string) => void
  step?: string
  min?: string
  max?: string
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-foreground/70">{label}</span>
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        step={step ?? "1"}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
