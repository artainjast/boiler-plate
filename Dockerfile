# 1️⃣ Use Node.js official image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# 2️⃣ Install dependencies stage
FROM base AS deps
WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml ./
# Install dependencies
RUN pnpm install --frozen-lockfile

# 3️⃣ Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define the environment variable for build time
ARG NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Build the Next.js app
RUN pnpm build

# 4️⃣ Production stage
FROM base AS runner
WORKDIR /app

# Set environment variables for runtime
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# 5️⃣ ✅ Start the Next.js server
CMD ["pnpm", "start"]
