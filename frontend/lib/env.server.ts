import "server-only";

import zod from "zod";

const envSchema = zod.object({
  DATABASE_URL: zod.string().min(1),
  AUTH_GOOGLE_ID: zod.string().min(1),
  AUTH_GOOGLE_SECRET: zod.string().min(1),
  AUTH_SECRET: zod.string().min(1),
  BACKEND_URL: zod.string().min(1),
  
  // CloudFront configuration
  CLOUDFRONT_DOMAIN: zod.string().min(1),
  CLOUDFRONT_DISTRIBUTION_ID: zod.string().min(1),
  CLOUDFRONT_KEY_PAIR_ID: zod.string().min(1),
  CLOUDFRONT_PRIVATE_KEY: zod.string().min(1),
  
  // Polar.sh configuration
  POLAR_ACCESS_TOKEN: zod.string().min(1),
  POLAR_WEBHOOK_SECRET: zod.string().min(1),
  PRODUCT_ID_STARTER_PACK: zod.string().min(1),
  PRODUCT_ID_VALUE_PACK: zod.string().min(1),
});

export const env = envSchema.parse(process.env);
