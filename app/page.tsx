import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-dvh bg-background">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-8">
          <h1 className="text-pretty text-4xl font-semibold tracking-tight">Smart Biofloc Monitoring System</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Monitor water quality in biofloc-based fish farming, get ML-powered water quality scores, and receive
            actionable recommendations to keep your system healthy.
          </p>
        </header>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-balance text-xl font-medium">What you can do</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm leading-6">
            <li>Enter live sensor readings to get instant quality predictions</li>
            <li>Upload CSV logs to visualize trends and detect anomalies</li>
            <li>Use ML baseline model with exportable coefficients</li>
            <li>Receive tailored recommendations for aeration, feeding, and biofloc balance</li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <Button asChild>
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/samples/biofloc-sensor-sample.csv" download>
                Download Sample CSV
              </a>
            </Button>
          </div>
        </div>

        <footer className="mt-10 text-xs text-muted-foreground">
          Colors (4 total): Primary blue (sky-600), neutrals (white, gray-700), accent orange (orange-500). Fonts:
          default sans for headings and body. Mobile-first layout.
        </footer>
      </section>
    </main>
  )
}
