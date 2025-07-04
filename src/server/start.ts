import { runMigrations } from './database/migrate';
import { logger } from './utils/logger';

async function startServer() {
  try {
    // Run database migrations first
    logger.info('Running database migrations...');
    await runMigrations();
    
    // Start the server
    logger.info('Starting server...');
    require('./index');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 