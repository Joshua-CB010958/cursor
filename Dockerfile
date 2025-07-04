# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY drizzle.config.ts ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY index.html ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Copy public directory (will be empty if it doesn't exist)
COPY public/ ./public/ 2>/dev/null || mkdir -p public

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 