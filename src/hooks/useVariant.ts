import { useState, useEffect } from "react";
import { getVariantId, setVariantId } from "@/lib/analytics/tracker";
import { supabase } from "@/integrations/supabase/client";

const VARIANTS = ["control", "credibility"] as const;
export type VariantId = (typeof VARIANTS)[number];

const WEIGHTS_KEY = "installpros_variant_weights";
const WEIGHTS_TTL = 5 * 60 * 1000; // 5 min cache

/**
 * Assigns an A/B variant based on experiment traffic weights.
 * Falls back to 50/50 if weights aren't available.
 */
export function useVariant(): VariantId {
  const [variant] = useState<VariantId>(() => {
    // Check if already assigned this session
    const existing = getVariantId();
    if (existing && VARIANTS.includes(existing as VariantId)) {
      return existing as VariantId;
    }

    // Try cached weights
    const cached = getCachedWeights();
    const assigned = pickVariant(cached);
    setVariantId(assigned);
    return assigned;
  });

  // Fetch fresh weights in background (for next visitor)
  useEffect(() => {
    fetchAndCacheWeights();
  }, []);

  return variant;
}

function pickVariant(weights: Record<string, number> | null): VariantId {
  if (!weights || Object.keys(weights).length === 0) {
    // Default 50/50
    return Math.random() < 0.5 ? "control" : "credibility";
  }

  // Check for a 100% winner
  for (const [id, w] of Object.entries(weights)) {
    if (w === 100 && VARIANTS.includes(id as VariantId)) {
      return id as VariantId;
    }
  }

  // Weighted random selection
  const entries = Object.entries(weights).filter(([id]) => VARIANTS.includes(id as VariantId));
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total <= 0) return "control";

  const rand = Math.random() * total;
  let cumulative = 0;
  for (const [id, w] of entries) {
    cumulative += w;
    if (rand < cumulative) return id as VariantId;
  }
  return entries[entries.length - 1]?.[0] as VariantId || "control";
}

function getCachedWeights(): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (!raw) return null;
    const { weights, ts } = JSON.parse(raw);
    if (Date.now() - ts > WEIGHTS_TTL) return null;
    return weights;
  } catch {
    return null;
  }
}

async function fetchAndCacheWeights() {
  try {
    const { data, error } = await supabase.functions.invoke("manage-experiment", {
      body: { action: "active_weights" },
    });
    if (error || !data?.weights) return;
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify({ weights: data.weights, ts: Date.now() }));
  } catch {
    // Silent fail — will use cached or default
  }
}
