# Build stage
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Define build arguments with default values
ARG REDIS_URL
ARG MIDJOURNEY_SERVER_ID
ARG MIDJOURNEY_CHANNEL_ID
ARG MIDJOURNEY_SALAI_TOKEN
ARG MIDJOURNEY_DEBUG=false
ARG MIDJOURNEY_WS
ARG MIDJOURNEY_STYLE_GUIDELINES
ARG MIDJOURNEY_PROMPT_STRUCTURE
ARG MIDJOURNEY_EXAMPLES
ARG REORDER_IMAGES_PROMPT
ARG SCRIPT_FROM_PROMPT_TEMPLATE
ARG MIDJOURNEY_NEGATIVE_PROMPT
ARG MIDJOURNEY_ASPECT_RATIO
ARG MIDJOURNEY_VERSION
ARG MIDJOURNEY_STYLE
ARG ELEVENLABS_API_KEY
ARG S3_BUCKET_NAME
ARG S3_BUCKET_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG OPENAI_API_KEY
ARG REMOTION_SERVER_URL
ARG REMOTION_BUCKET_NAME
ARG CLOUDFRONT_DOMAIN
ARG CLOUDFRONT_KEY_PAIR_ID
ARG CLOUDFRONT_PRIVATE_KEY
ARG CLOUDFRONT_DISTRIBUTION_ID

RUN echo $REDIS_URL

# Set environment variables
ENV REDIS_URL=$REDIS_URL \
    MIDJOURNEY_SERVER_ID=$MIDJOURNEY_SERVER_ID \
    MIDJOURNEY_CHANNEL_ID=$MIDJOURNEY_CHANNEL_ID \
    MIDJOURNEY_SALAI_TOKEN=$MIDJOURNEY_SALAI_TOKEN \
    MIDJOURNEY_DEBUG=$MIDJOURNEY_DEBUG \
    MIDJOURNEY_WS=$MIDJOURNEY_WS \
    MIDJOURNEY_STYLE_GUIDELINES=$MIDJOURNEY_STYLE_GUIDELINES \
    MIDJOURNEY_PROMPT_STRUCTURE=$MIDJOURNEY_PROMPT_STRUCTURE \
    MIDJOURNEY_EXAMPLES=$MIDJOURNEY_EXAMPLES \
    REORDER_IMAGES_PROMPT=$REORDER_IMAGES_PROMPT \
    SCRIPT_FROM_PROMPT_TEMPLATE=$SCRIPT_FROM_PROMPT_TEMPLATE \
    MIDJOURNEY_NEGATIVE_PROMPT=$MIDJOURNEY_NEGATIVE_PROMPT \
    MIDJOURNEY_ASPECT_RATIO=$MIDJOURNEY_ASPECT_RATIO \
    MIDJOURNEY_VERSION=$MIDJOURNEY_VERSION \
    MIDJOURNEY_STYLE=$MIDJOURNEY_STYLE \
    ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY \
    S3_BUCKET_NAME=$S3_BUCKET_NAME \
    S3_BUCKET_REGION=$S3_BUCKET_REGION \
    AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    REMOTION_SERVER_URL=$REMOTION_SERVER_URL \
    REMOTION_BUCKET_NAME=$REMOTION_BUCKET_NAME \
    CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN \
    CLOUDFRONT_KEY_PAIR_ID=$CLOUDFRONT_KEY_PAIR_ID \
    CLOUDFRONT_PRIVATE_KEY=$CLOUDFRONT_PRIVATE_KEY \
    CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID \
    NODE_ENV=production

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Start the application
CMD ["npm", "start"]
