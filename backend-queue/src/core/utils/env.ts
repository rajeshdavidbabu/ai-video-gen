import { z } from "zod";

const envSchema = z.object({
  REDIS_URL:
    process.env.NODE_ENV === "development"
      ? z.string()
      : z.string().url("REDIS_URL must be a valid URL"),

  // Midjourney Authentication
  MIDJOURNEY_SERVER_ID: z.string(),
  MIDJOURNEY_CHANNEL_ID: z.string(),
  MIDJOURNEY_SALAI_TOKEN: z.string(),
  MIDJOURNEY_DEBUG: z.enum(["true", "false"]).optional().default("false"),
  MIDJOURNEY_WS: z.enum(["true", "false"]).optional().default("false"),
  
  // Midjourney Prompt Templates
  MIDJOURNEY_STYLE_GUIDELINES: z.string(),
  MIDJOURNEY_PROMPT_STRUCTURE: z.string(), 
  MIDJOURNEY_EXAMPLES: z.string(),
  REORDER_IMAGES_PROMPT: z.string(),
  SCRIPT_FROM_PROMPT_TEMPLATE: z.string(),
  
  // Midjourney Configuration
  MIDJOURNEY_NEGATIVE_PROMPT: z.string().optional().default("--no text, watermark, signature, deformed hands, extra hands, deformed fingers, extra fingers, missing fingers, unnatural limbs, bad anatomy, bad proportions, disfigured faces, distorted faces, unnatural expressions, overexposed lighting, underexposed lighting, harsh shadows, distorted shadows, unnatural shadows, asymmetrical features, unnatural skin tones, blurry details, low resolution, noisy textures, oversaturated colors, chromatic aberration, grainy output, overly sharp edges, clipping artifacts, warped geometry"),
  MIDJOURNEY_ASPECT_RATIO: z.string().optional().default("--ar 9:16"),
  MIDJOURNEY_VERSION: z.string().optional().default("--v 7"),
  MIDJOURNEY_STYLE: z.string().optional().default("--style raw"),

  ELEVENLABS_API_KEY: z.string(),
  DEEPGRAM_API_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_BUCKET_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  TEST_MODE: z.enum(["true", "false"]).optional().default("false"),
  FAIL_ON_ASSETS_ERROR: z.enum(["true", "false"]).optional().default("false"),
  REMOTION_SERVER_URL: z.string().url("REMOTION_SERVER_URL must be a valid URL"),
  REMOTION_BUCKET_NAME: z.string(),
  CLOUDFRONT_DOMAIN: z.string(),
  CLOUDFRONT_KEY_PAIR_ID: z.string(),
  CLOUDFRONT_PRIVATE_KEY: z.string(),
  CLOUDFRONT_DISTRIBUTION_ID: z.string()
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  try {
    const env = envSchema.parse({
      REDIS_URL: process.env.REDIS_URL,
      
      // Midjourney Authentication
      MIDJOURNEY_SERVER_ID: process.env.MIDJOURNEY_SERVER_ID,
      MIDJOURNEY_CHANNEL_ID: process.env.MIDJOURNEY_CHANNEL_ID,
      MIDJOURNEY_SALAI_TOKEN: process.env.MIDJOURNEY_SALAI_TOKEN,
      MIDJOURNEY_DEBUG: process.env.MIDJOURNEY_DEBUG,
      MIDJOURNEY_WS: process.env.MIDJOURNEY_WS,
      
      // Midjourney Prompt Templates
      MIDJOURNEY_STYLE_GUIDELINES: process.env.MIDJOURNEY_STYLE_GUIDELINES,
      MIDJOURNEY_PROMPT_STRUCTURE: process.env.MIDJOURNEY_PROMPT_STRUCTURE,
      MIDJOURNEY_EXAMPLES: process.env.MIDJOURNEY_EXAMPLES,
      REORDER_IMAGES_PROMPT: process.env.REORDER_IMAGES_PROMPT,
      SCRIPT_FROM_PROMPT_TEMPLATE: process.env.SCRIPT_FROM_PROMPT_TEMPLATE,
      
      // Midjourney Configuration
      MIDJOURNEY_NEGATIVE_PROMPT: process.env.MIDJOURNEY_NEGATIVE_PROMPT,
      MIDJOURNEY_ASPECT_RATIO: process.env.MIDJOURNEY_ASPECT_RATIO,
      MIDJOURNEY_VERSION: process.env.MIDJOURNEY_VERSION,
      MIDJOURNEY_STYLE: process.env.MIDJOURNEY_STYLE,
      
      // App Limits
      MAX_RERENDERS: process.env.MAX_RERENDERS,
      MAX_DOWNLOADS: process.env.MAX_DOWNLOADS,
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
      DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      TEST_MODE: process.env.TEST_MODE,
      FAIL_ON_ASSETS_ERROR: process.env.FAIL_ON_ASSETS_ERROR,
      REMOTION_SERVER_URL: process.env.REMOTION_SERVER_URL,
      REMOTION_BUCKET_NAME: process.env.REMOTION_BUCKET_NAME,
      CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
      CLOUDFRONT_KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID,
      CLOUDFRONT_PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY,
      CLOUDFRONT_DISTRIBUTION_ID: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join("\n");
      throw new Error(`❌ Invalid environment variables:\n${issues}`);
    }
    throw error;
  }
}

export const env = getEnv();
