"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

type Point = { t: string | number; score: number; category: string }

export function WaterQualityChart() {
  const [data, setData] = useState<Point[]>([])

  useEffect(() => {
    function onSeries(e: any) {
      setData(e.detail)
    }
    window.addEventListener("biofloc:series", onSeries)
    return () => window.removeEventListener("biofloc:series", onSeries)
  }, [])

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="t" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <ReferenceLine y={70} stroke="#0284c7" strokeDasharray="4 4" />
          <ReferenceLine y={45} stroke="#f97316" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="score" stroke="#0284c7" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
