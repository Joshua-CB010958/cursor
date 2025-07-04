#!/bin/bash

# Railway Build Script
# This script handles the build process for Railway deployment

set -e

echo "🚀 Starting Railway build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build server
echo "🔨 Building server..."
npm run build:server

# Build client
echo "🎨 Building client..."
npm run build:client

echo "✅ Build completed successfully!" 