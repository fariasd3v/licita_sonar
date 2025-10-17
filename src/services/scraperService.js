const { getDatabase } = require('../config/database');
const { scrapeWithAntiBot } = require('../utils/scraper');
const { io } = require('../index'); // Import socket.io instance

// We'll initialize the logger after the circular dependency is resolved
let logger;

/**
 * Initialize the service with logger
 * @param {Object} loggerInstance - The logger instance
 */
function init(loggerInstance) {
  logger = loggerInstance;
}

/**
 * Start scraping for all active sessions
 */
async function startScrapingSessions() {
  if (!logger) {
    console.log('Starting session scraping service');
  } else {
    logger.info('Starting session scraping service');
  }
  
  try {
    const db = getDatabase();
    
    // Get all sessions from database
    db.all('SELECT session_id FROM sessions', [], (err, sessions) => {
      db.close();
      
      if (err) {
        if (!logger) {
          console.error('Failed to fetch sessions for scraping:', err.message);
        } else {
          logger.error('Failed to fetch sessions for scraping:', err.message);
        }
        return;
      }
      
      // Start scraping for each session
      sessions.forEach(session => {
        startScrapingSession(session.session_id);
      });
    });
  } catch (error) {
    if (!logger) {
      console.error('Error starting scraping service:', error);
    } else {
      logger.error('Error starting scraping service:', error);
    }
  }
}

/**
 * Start scraping for a specific session
 * @param {string} sessionId - The session ID to scrape
 */
function startScrapingSession(sessionId) {
  // If already scraping, don't start again
  if (scrapingIntervals.has(sessionId)) {
    if (!logger) {
      console.log(`Already scraping session: ${sessionId}`);
    } else {
      logger.info(`Already scraping session: ${sessionId}`);
    }
    return;
  }
  
  if (!logger) {
    console.log(`Starting scraping for session: ${sessionId}`);
  } else {
    logger.info(`Starting scraping for session: ${sessionId}`);
  }
  
  // Create interval for periodic scraping (5-15 seconds with randomization)
  const interval = setInterval(async () => {
    try {
      if (!logger) {
        console.log(`Scraping session: ${sessionId}`);
      } else {
        logger.info(`Scraping session: ${sessionId}`);
      }
      
      const result = await scrapeWithAntiBot(sessionId);
      
      if (result.error) {
        if (!logger) {
          console.warn(`Scraping error for session ${sessionId}:`, result.error);
        } else {
          logger.warn(`Scraping error for session ${sessionId}:`, result.error);
        }
        
        // If blocked, stop scraping for this session
        if (result.error === 'BLOCKED') {
          stopScrapingSession(sessionId);
        }
      } else {
        if (!logger) {
          console.log(`Successfully scraped ${result.length} messages for session: ${sessionId}`);
        } else {
          logger.info(`Successfully scraped ${result.length} messages for session: ${sessionId}`);
        }
        
        // Emit messages via WebSocket to connected clients
        if (io) {
          result.forEach(message => {
            io.to(sessionId).emit('newMessage', {
              sessionId: sessionId,
              msg: message.text,
              timestamp: message.timestamp
            });
          });
        }
      }
    } catch (error) {
      if (!logger) {
        console.error(`Scraping failed for session ${sessionId}:`, error);
      } else {
        logger.error(`Scraping failed for session ${sessionId}:`, error);
      }
    }
  }, Math.random() * 10000 + 5000); // 5-15 seconds randomized
  
  // Store interval reference
  scrapingIntervals.set(sessionId, interval);
}

/**
 * Stop scraping for a specific session
 * @param {string} sessionId - The session ID to stop scraping
 */
function stopScrapingSession(sessionId) {
  if (!logger) {
    console.log(`Stopping scraping for session: ${sessionId}`);
  } else {
    logger.info(`Stopping scraping for session: ${sessionId}`);
  }
  
  const interval = scrapingIntervals.get(sessionId);
  if (interval) {
    clearInterval(interval);
    scrapingIntervals.delete(sessionId);
  }
}

/**
 * Stop scraping for all sessions
 */
function stopAllScraping() {
  if (!logger) {
    console.log('Stopping all scraping sessions');
  } else {
    logger.info('Stopping all scraping sessions');
  }
  
  scrapingIntervals.forEach((interval, sessionId) => {
    clearInterval(interval);
  });
  
  scrapingIntervals.clear();
}

// Store for active scraping intervals
const scrapingIntervals = new Map();

module.exports = {
  init,
  startScrapingSessions,
  startScrapingSession,
  stopScrapingSession,
  stopAllScraping
};