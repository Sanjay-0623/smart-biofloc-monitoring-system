"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function QualityScoreCard() {
  // Placeholder state populated by last form result via a custom event
  const [result, setResult] = useState<{
    score: number
    category: string
    advice: { issues: string[]; actions: string[] }
  } | null>(null)

  // Listen for custom events from SensorInputForm
  if (typeof window !== "undefined") {
    window.addEventListener(
      "biofloc:prediction",
      (e: any) => {
        setResult(e.detail)
      },
      { once: true },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        {!result ? (
          <p className="text-sm text-foreground/70">Run a prediction to see details here.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-semibold">{result.score}</div>
                <div className="text-sm text-foreground/60">0–100</div>
              </div>
              <span
                className={[
                  "rounded-full px-2 py-1 text-xs font-medium",
                  result.category === "good"
                    ? "bg-sky-50 text-sky-700 border border-sky-200"
                    : result.category === "warning"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-red-50 text-red-700 border border-red-200",
                ].join(" ")}
              >
                {result.category.toUpperCase()}
              </span>
            </div>

            <Tabs defaultValue="issues">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              <TabsContent value="issues">
                {result.advice.issues.length === 0 ? (
                  <p className="text-sm text-foreground/70">No major issues detected.</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.advice.issues.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              <TabsContent value="actions">
                {result.advice.actions.length === 0 ? (
                  <p className="text-sm text-foreground/70">Maintain routine operations.</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.advice.actions.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
