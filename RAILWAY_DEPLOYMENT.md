# Railway Deployment Guide

This guide will help you deploy your Smart Task Automation Engine to Railway.

## 🚀 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Railway CLI** (optional): `npm install -g @railway/cli`

## 📋 Step-by-Step Deployment

### 1. Connect Your Repository

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the project type

### 2. Configure Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add these environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (Railway will provide these)
DB_HOST=${DATABASE_HOST}
DB_PORT=${DATABASE_PORT}
DB_USER=${DATABASE_USER}
DB_PASSWORD=${DATABASE_PASSWORD}
DB_NAME=${DATABASE_NAME}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# External Services (optional)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Client Configuration
CLIENT_URL=https://your-app-name.railway.app

# Logging
LOG_LEVEL=info
```

### 3. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. The database connection variables will be automatically added to your environment

### 4. Configure Build Settings

Railway will automatically detect the build configuration from:
- `railway.toml`
- `nixpacks.toml`
- `package.json`

The build process will:
1. Install dependencies with `npm ci --only=production`
2. Build the application with `npm run build`
3. Start the server with `npm start`

### 5. Deploy

1. Railway will automatically deploy when you push to your main branch
2. You can also trigger manual deployments from the dashboard
3. Monitor the deployment logs in real-time

## 🔧 Railway-Specific Configuration

### Health Check
The application includes a health check endpoint at `/health` that Railway will use to verify the deployment.

### Port Configuration
Railway automatically sets the `PORT` environment variable. The application is configured to use this port.

### Static File Serving
The server is configured to serve the React build files for all non-API routes.

## 📊 Monitoring

### Logs
- View real-time logs in the Railway dashboard
- Logs are automatically collected and stored

### Metrics
- Monitor CPU and memory usage
- Track request volume and response times
- Set up alerts for performance issues

### Database
- Monitor database connections and performance
- Set up automated backups
- Scale database resources as needed

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to your repository
- Use Railway's environment variable management
- Rotate secrets regularly

### Database Security
- Railway automatically secures your PostgreSQL database
- Use connection pooling for better performance
- Enable SSL connections

### API Security
- The application includes rate limiting
- CORS is configured for production
- Helmet.js provides security headers

## 🚀 Scaling

### Automatic Scaling
Railway can automatically scale your application based on:
- CPU usage
- Memory usage
- Request volume

### Manual Scaling
You can manually adjust:
- Number of instances
- CPU and memory allocation
- Database resources

## 🔄 Continuous Deployment

### GitHub Integration
1. Connect your GitHub repository
2. Railway will automatically deploy on pushes to main branch
3. Preview deployments for pull requests

### Custom Domains
1. Add a custom domain in Railway dashboard
2. Configure DNS records
3. Enable SSL certificates

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
- Check build logs in Railway dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compilation succeeds

**Database Connection Issues**
- Verify database environment variables
- Check database is provisioned and running
- Test connection locally with Railway database URL

**Runtime Errors**
- Check application logs
- Verify environment variables are set correctly
- Test health check endpoint

### Debug Commands

```bash
# Check Railway status
railway status

# View logs
railway logs

# Connect to database
railway connect

# Open shell in Railway environment
railway shell
```

## 📈 Performance Optimization

### Build Optimization
- The build process includes code splitting
- Vendor chunks are separated for better caching
- Source maps are generated for debugging

### Runtime Optimization
- Database connection pooling
- Rate limiting to prevent abuse
- Static file serving with caching headers

### Monitoring
- Health check endpoint for uptime monitoring
- Structured logging for better debugging
- Performance metrics collection

## 🔄 Updates and Maintenance

### Updating Dependencies
1. Update dependencies in `package.json`
2. Test locally with `npm install && npm run build`
3. Commit and push to trigger deployment

### Database Migrations
1. Create migration files with `npm run db:generate`
2. Test migrations locally
3. Deploy and run migrations with `npm run db:migrate`

### Zero-Downtime Deployments
- Railway supports zero-downtime deployments
- Health checks ensure new instances are ready
- Automatic rollback on deployment failures

## 📞 Support

If you encounter issues:
1. Check Railway documentation
2. Review application logs
3. Test locally with Railway environment variables
4. Contact Railway support if needed

---

Your Smart Task Automation Engine is now ready for production deployment on Railway! 🎉 