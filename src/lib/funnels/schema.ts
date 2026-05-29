import { z } from "zod";

export const FunnelStepSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("choice-grid"),
    id: z.string().min(1),
    title: z.string().min(1),
    options: z
      .array(
        z.object({
          value: z.string().min(1),
          label: z.string().min(1),
          icon: z.string().optional(),
        })
      )
      .min(2)
      .max(8),
  }),
  z.object({
    type: z.literal("text"),
    id: z.string().min(1),
    label: z.string().min(1),
    placeholder: z.string().optional(),
  }),
  z.object({
    type: z.literal("phone"),
    id: z.string().min(1),
    label: z.string().min(1),
  }),
  z.object({
    type: z.literal("email"),
    id: z.string().min(1),
    label: z.string().min(1),
  }),
  z.object({
    type: z.literal("address"),
    id: z.string().min(1),
    label: z.string().min(1),
  }),
]);

export const FunnelConfigSchema = z.object({
  version: z.literal(1),
  branding: z.object({
    headline: z.string().min(1).max(160),
    subheadline: z.string().max(280).optional().default(""),
    badge: z.string().max(60).optional().default(""),
  }),
  steps: z.array(FunnelStepSchema).min(1).max(12),
  submit: z.object({
    label: z.string().min(1).max(40).default("Get My Quote"),
    redirect: z.string().min(1).max(120).default("/thank-you"),
  }),
});

export type FunnelStep = z.infer<typeof FunnelStepSchema>;
export type FunnelConfig = z.infer<typeof FunnelConfigSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 63);
}

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}$/;
