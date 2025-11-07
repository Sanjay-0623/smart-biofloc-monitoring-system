import { SensorInputForm } from "@/components/sensor-input-form"
import { QualityScoreCard } from "@/components/quality-score-card"
import { UploadCsv } from "@/components/upload-csv"
import { WaterQualityChart } from "@/components/charts/water-quality-chart"

export default function DashboardPage() {
  // Server component shell; client components handle interactions
  return (
    <main className="min-h-dvh bg-background">
      <section className="mx-auto max-w-5xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">Biofloc Dashboard</h1>
          <p className="mt-2 text-foreground/80 leading-relaxed">
            Enter current readings for instant prediction or upload a CSV log to visualize trends.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <SensorInputForm />
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-lg font-medium">Trend Analysis</h2>
              <p className="text-sm text-foreground/70">Use the CSV uploader to populate this chart.</p>
              <div className="mt-3">
                <WaterQualityChart />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <QualityScoreCard />
            <UploadCsv />
          </div>
        </div>
      </section>
    </main>
  )
}
