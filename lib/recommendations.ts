import type { Reading } from "./model-data"

type Category = "good" | "warning" | "critical"

export function getRecommendations(reading: Reading, result: { score: number; category: Category }) {
  const issues: string[] = []
  const actions: string[] = []

  // Heuristic thresholds (adjust to your species/system)
  if (reading.dissolved_oxygen_mg_l < 5) {
    issues.push("Low dissolved oxygen")
    actions.push("Increase aeration immediately; check blowers and diffusers.")
  }
  if (reading.ammonia_mg_l > 0.5) {
    issues.push("Elevated ammonia")
    actions.push("Reduce feeding temporarily; consider partial water exchange and add probiotics.")
  }
  if (reading.nitrite_mg_l > 0.3) {
    issues.push("High nitrite")
    actions.push("Add chloride salt (NaCl) to mitigate nitrite toxicity; monitor biofloc density.")
  }
  if (reading.nitrate_mg_l > 50) {
    issues.push("High nitrate")
    actions.push("Schedule partial water exchange and evaluate feeding rate and carbon source.")
  }
  if (reading.ph < 7.0 || reading.ph > 8.5) {
    issues.push("pH out of range")
    actions.push("Adjust alkalinity; use buffers (e.g., sodium bicarbonate) gradually.")
  }
  if (reading.alkalinity_mg_l < 120) {
    issues.push("Low alkalinity")
    actions.push("Add alkalinity source (e.g., sodium bicarbonate) to stabilize pH and nitrification.")
  }
  if (reading.temperature_c < 26 || reading.temperature_c > 30) {
    issues.push("Temperature not optimal")
    actions.push("Adjust heating/cooling; ensure stable temperature to avoid stress.")
  }
  if (reading.tds_ppm > 2000) {
    issues.push("High TDS")
    actions.push("Plan water exchange and review solids removal and carbon dosing.")
  }

  // Deduplicate actions
  const uniqueActions = Array.from(new Set(actions))

  return {
    summary:
      result.category === "good"
        ? "Conditions look good. Continue routine monitoring."
        : "Attention required. See recommended actions.",
    issues,
    actions: uniqueActions,
  }
}
