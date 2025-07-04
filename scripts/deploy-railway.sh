#!/bin/bash

# Railway Deployment Script
# This script helps with Railway deployment

set -e

echo "🚀 Starting Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if we're logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please run 'railway login' first."
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://your-app-name.railway.app" 