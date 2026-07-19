import { z } from 'zod';

export const PlaybookPayloadSchema = z.object({
  title: z.string().min(1).max(256),
  severity: z.enum(['warning', 'critical']),
  confidence: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  reasoning: z.string().min(1),
  estimatedImpact: z.string().min(1),
  recommendedActions: z.array(z.string().min(1)).min(1).max(10),
  departments: z.array(z.string().min(1)).min(1).max(10),
});

export type PlaybookPayload = z.infer<typeof PlaybookPayloadSchema>;

/**
 * Parses and validates a raw text string from the Gemini API.
 * Strips markdown code fences before parsing.
 * Throws a ZodError if the shape is invalid.
 */
export function parsePlaybookResponse(rawText: string): PlaybookPayload {
  // Strip optional markdown code fences that Gemini sometimes adds
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  const parsed: unknown = JSON.parse(cleaned);
  return PlaybookPayloadSchema.parse(parsed);
}
