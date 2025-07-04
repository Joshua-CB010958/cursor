import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';

import { testConnection } from './database/connection';
import { logger } from './utils/logger';
import automationRoutes from './routes/automations';
import { AutomationProcessor } from './services/automationProcessor';
import { StripeService } from './services/stripeService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../client')));

// Initialize services
const automationProcessor = new AutomationProcessor();
const stripeService = new StripeService();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Task Automation Engine is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/automations', automationRoutes);

// Stripe webhook endpoint
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Stripe signature',
      });
    }

    const event = stripeService.verifyWebhookSignature(req.body, signature);
    
    // Process the webhook with automation processor
    await automationProcessor.processStripeWebhook(event);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({
      success: false,
      error: 'Webhook processing failed',
    });
  }
});

// Email webhook endpoint (for SendGrid)
app.post('/api/webhooks/email', async (req, res) => {
  try {
    const event = req.body;
    
    // Process email events (opens, clicks, etc.)
    // This would trigger automations based on email engagement
    logger.info('Email webhook received:', event);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Email webhook error:', error);
    res.status(400).json({
      success: false,
      error: 'Email webhook processing failed',
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
    });
  }
  
  // Serve React app
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Schedule automation processing (every minute)
cron.schedule('* * * * *', async () => {
  try {
    await automationProcessor.processReadyAutomations();
  } catch (error) {
    logger.error('Scheduled automation processing failed:', error);
  }
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    logger.info('Database connection established');

    app.listen(PORT, () => {
      logger.info(`Smart Task Automation Engine server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer(); 