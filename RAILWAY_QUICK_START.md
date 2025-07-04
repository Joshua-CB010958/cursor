# Railway Quick Start Guide

## 🚀 Deploy to Railway in 3 Steps

### 1. Push to GitHub
Make sure your code is in a GitHub repository and all changes are committed.

### 2. Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 3. Configure Environment Variables
In your Railway project dashboard, add these variables:

```env
# Required
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key

# Database (Railway will provide these automatically)
DB_HOST=${DATABASE_HOST}
DB_PORT=${DATABASE_PORT}
DB_USER=${DATABASE_USER}
DB_PASSWORD=${DATABASE_PASSWORD}
DB_NAME=${DATABASE_NAME}

# Optional
SENDGRID_API_KEY=your-sendgrid-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. Add PostgreSQL Database
1. In Railway dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically connect it to your app

## ✅ What Railway Does Automatically

- **Detects Node.js project** from package.json
- **Installs dependencies** with `npm ci`
- **Builds the app** using the build scripts
- **Starts the server** with `npm start`
- **Provides database** connection variables
- **Handles SSL** and custom domains

## 🔧 Build Process

Railway will automatically:
1. Install dependencies: `npm ci`
2. Build server: `npm run build:server`
3. Build client: `npm run build:client`
4. Start app: `npm start`

## 🌐 Your App URL

Your app will be available at:
`https://your-app-name.railway.app`

## 🐛 Troubleshooting

**Build fails?**
- Check Railway build logs
- Ensure all dependencies are in package.json
- Verify TypeScript compilation works locally

**Database connection fails?**
- Verify PostgreSQL is added to your project
- Check environment variables are set correctly

**App won't start?**
- Check the health endpoint: `/health`
- Review Railway logs for errors

## 📞 Need Help?

- Check Railway documentation
- Review build logs in Railway dashboard
- Test locally with Railway environment variables 