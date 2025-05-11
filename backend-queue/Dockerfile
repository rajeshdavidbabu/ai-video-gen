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

RUN echo $REDIS_URL

# Set environment variables
ENV REDIS_URL=$REDIS_URL \
    MIDJOURNEY_SERVER_ID=$MIDJOURNEY_SERVER_ID \
    MIDJOURNEY_CHANNEL_ID=$MIDJOURNEY_CHANNEL_ID \
    MIDJOURNEY_SALAI_TOKEN=$MIDJOURNEY_SALAI_TOKEN \
    MIDJOURNEY_DEBUG=$MIDJOURNEY_DEBUG \
    MIDJOURNEY_WS=$MIDJOURNEY_WS \
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
