// Baseline features commonly logged in biofloc systems. You can regenerate this via scripts/train_model.py
export const modelData = {
  version: "0.1.0",
  type: "logistic", // logistic on discretized quality, with score output via sigmoid scaled 0-100
  features: [
    "ph",
    "temperature_c",
    "dissolved_oxygen_mg_l",
    "tds_ppm",
    "salinity_ppt",
    "ammonia_mg_l",
    "nitrite_mg_l",
    "nitrate_mg_l",
    "alkalinity_mg_l",
  ],
  // Means and stds for standardization (placeholder values)
  mean: {
    ph: 7.4,
    temperature_c: 28,
    dissolved_oxygen_mg_l: 5.5,
    tds_ppm: 1200,
    salinity_ppt: 3,
    ammonia_mg_l: 0.2,
    nitrite_mg_l: 0.1,
    nitrate_mg_l: 20,
    alkalinity_mg_l: 150,
  },
  std: {
    ph: 0.4,
    temperature_c: 2.0,
    dissolved_oxygen_mg_l: 1.0,
    tds_ppm: 400,
    salinity_ppt: 1.5,
    ammonia_mg_l: 0.15,
    nitrite_mg_l: 0.08,
    nitrate_mg_l: 10,
    alkalinity_mg_l: 40,
  },
  // Learned weights (placeholder, directionally sensible)
  weights: {
    ph: 0.8,
    temperature_c: 0.5,
    dissolved_oxygen_mg_l: 1.2,
    tds_ppm: -0.6,
    salinity_ppt: -0.3,
    ammonia_mg_l: -1.4,
    nitrite_mg_l: -1.1,
    nitrate_mg_l: -0.4,
    alkalinity_mg_l: 0.3,
  },
  bias: 0.2,
  thresholds: { good: 70, warning: 45 }, // 0-100 scale
} as const

export type FeatureName = keyof (typeof modelData)["mean"]
export type Reading = Record<FeatureName, number>
