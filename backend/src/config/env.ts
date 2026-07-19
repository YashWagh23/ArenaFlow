import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((v) => {
      const n = Number(v);
      if (isNaN(n) || n < 1 || n > 65535) throw new Error(`Invalid PORT: ${v}`);
      return n;
    }),
  GEMINI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`\n[ArenaFlow] Environment validation failed:\n${formatted}\n`);
  }
  return result.data;
}

export const env = parseEnv();
