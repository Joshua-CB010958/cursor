# Build stage
FROM node:18-alpine AS builder

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code and config files
COPY tsconfig*.json ./
COPY drizzle.config.ts ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src/ ./src/
COPY index.html ./
COPY public/ ./public/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat wget

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.ts ./

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]