"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Minimal CSV parser (expects header and commas; no quotes)
function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/)
  const header = lines[0].split(",").map((h) => h.trim())
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",")
    const obj: Record<string, string> = {}
    header.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()))
    return obj
  })
  return { header, rows }
}

export function UploadCsv() {
  const [processing, setProcessing] = useState(false)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setProcessing(true)
    try {
      const text = await file.text()
      const { rows } = parseCsv(text)

      const predictions: { t: string | number; score: number; category: string }[] = []
      for (const r of rows) {
        const payload = {
          ph: Number(r.ph),
          temperature_c: Number(r.temperature_c),
          ultrasonic_cm: Number(r.ultrasonic_cm),
          turbidity_ntu: Number(r.turbidity_ntu),
        }
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (res.ok) {
          predictions.push({ t: r.timestamp ?? predictions.length, score: json.score, category: json.category })
          // broadcast last prediction for side-panels
          window.dispatchEvent(new CustomEvent("biofloc:prediction", { detail: json }))
        }
      }

      // Broadcast to chart
      window.dispatchEvent(new CustomEvent("biofloc:series", { detail: predictions }))
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground/70">
          Expected headers: timestamp, ph, temperature_c, ultrasonic_cm, turbidity_ntu
        </p>
        <input type="file" accept=".csv" onChange={onFile} className="text-sm" />
        <Button asChild variant="outline">
          <a href="/samples/biofloc-sensor-sample.csv" download>
            Download Sample CSV
          </a>
        </Button>
        {processing && <p className="text-xs text-foreground/60">Processing...</p>}
      </CardContent>
    </Card>
  )
}
