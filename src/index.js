require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const winston = require('winston');
const path = require('path');

// Import routes and middleware
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Import database initialization
const { initDatabase } = require('./config/database');

// Import scraping service
const scraperService = require('./services/scraperService');

// Import scraper utility
const { init: initScraper } = require('./utils/scraper');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://licita-sonar.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: ["https://licita-sonar.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
// Fix the path to the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: require('../package.json').version
  });
});

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Serve dashboard (same as main app in this implementation)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

// Initialize database
initDatabase();

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Initialize scraper service with logger
scraperService.init(logger);

// Initialize scraper utility with logger
initScraper(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', authenticateToken, sessionRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  logger.info('New client connected');
  
  socket.on('joinSession', (sessionId) => {
    socket.join(sessionId);
    logger.info(`Client joined session: ${sessionId}`);
    
    // When a client joins a session, we can trigger an immediate scrape
    scraperService.startScrapingSession(sessionId);
  });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  scraperService.stopAllScraping();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down gracefully...');
  scraperService.stopAllScraping();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  // Start scraping service
  scraperService.startScrapingSessions();
});

module.exports = { app, server, io, logger };