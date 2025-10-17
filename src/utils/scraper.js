const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getDatabase } = require('../config/database');

puppeteer.use(StealthPlugin());

// User agent rotation array
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
];

// We'll initialize the logger after the circular dependency is resolved
let logger;

/**
 * Initialize the scraper with logger
 * @param {Object} loggerInstance - The logger instance
 */
function init(loggerInstance) {
  logger = loggerInstance;
}

/**
 * Scrape chat messages with anti-bot techniques
 * @param {string} sessionId - The session ID to scrape
 * @returns {Promise<Array>} - Array of messages or error object
 */
async function scrapeWithAntiBot(sessionId) {
  // Select random user agent
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  
  let browser;
  try {
    // Launch browser in headless mode
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    // Apply user agent
    await page.setUserAgent(randomUserAgent);
    
    // Set extra headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br'
    });
    
    // Navigate to the chat page
    if (!logger) {
      console.log(`Navigating to chat page for session: ${sessionId}`);
    } else {
      logger.info(`Navigating to chat page for session: ${sessionId}`);
    }
    
    await page.goto(`https://licitacoes-e2.bb.com.br/sessao/${sessionId}/chat`, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Simulate human interaction
    // Random scroll
    await page.evaluate(() => {
      window.scrollBy(0, Math.random() * 200 + 100); // Scroll 100-300px
    });
    
    // Random delay between 2-10 seconds
    await new Promise(resolve => setTimeout(resolve, Math.random() * 8000 + 2000));
    
    // Random click in a non-intrusive area
    const body = await page.$('body');
    if (body) {
      const box = await body.boundingBox();
      if (box) {
        await page.mouse.click(
          box.x + Math.random() * box.width * 0.1,
          box.y + Math.random() * box.height * 0.1
        );
      }
    }
    
    // Wait for chat messages to load
    try {
      await page.waitForSelector('#chat-messages li', { timeout: 10000 });
    } catch (waitError) {
      // If the selector doesn't appear, check if it's because the structure changed
      const pageContent = await page.content();
      if (pageContent.includes('403 Forbidden') || pageContent.includes('429 Too Many Requests')) {
        await browser.close();
        if (!logger) {
          console.warn(`Possible blocking detected for session: ${sessionId}`);
        } else {
          logger.warn(`Possible blocking detected for session: ${sessionId}`);
        }
        return { error: 'BLOCKED', details: 'Access forbidden or rate limited' };
      }
      
      await browser.close();
      if (!logger) {
        console.warn(`Structure may have changed for session: ${sessionId}`);
      } else {
        logger.warn(`Structure may have changed for session: ${sessionId}`);
      }
      return { error: 'Estrutura alterada' };
    }
    
    // Extract messages from chat
    const messages = await page.evaluate(() => {
      const messageElements = document.querySelectorAll('#chat-messages li');
      return Array.from(messageElements).map(el => ({
        text: el.innerText,
        timestamp: new Date().toISOString()
      }));
    });
    
    await browser.close();
    
    // Save messages to database
    if (messages.length > 0) {
      saveMessagesToDatabase(sessionId, messages);
    }
    
    // Return last 5 messages
    return messages.slice(-5);
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    
    // Handle specific errors
    if (error.message.includes('403') || error.message.includes('429')) {
      if (!logger) {
        console.warn(`Possible blocking detected for session: ${sessionId}`, error.message);
      } else {
        logger.warn(`Possible blocking detected for session: ${sessionId}`, error.message);
      }
      return { error: 'BLOCKED', details: error.message };
    }
    
    // Structure changed error
    if (error.message.includes('waiting for selector')) {
      if (!logger) {
        console.warn(`Structure may have changed for session: ${sessionId}`, error.message);
      } else {
        logger.warn(`Structure may have changed for session: ${sessionId}`, error.message);
      }
      return { error: 'Estrutura alterada' };
    }
    
    if (!logger) {
      console.error(`Scraping error for session ${sessionId}:`, error);
    } else {
      logger.error(`Scraping error for session ${sessionId}:`, error);
    }
    throw error;
  }
}

/**
 * Save messages to database
 * @param {string} sessionId - The session ID
 * @param {Array} messages - Array of message objects
 */
function saveMessagesToDatabase(sessionId, messages) {
  const db = getDatabase();
  
  messages.forEach(message => {
    db.run(
      'INSERT INTO chats (sessao_id, msg) VALUES (?, ?)',
      [sessionId, message.text],
      (err) => {
        if (err) {
          if (!logger) {
            console.error(`Failed to save message for session ${sessionId}:`, err.message);
          } else {
            logger.error(`Failed to save message for session ${sessionId}:`, err.message);
          }
        }
      }
    );
  });
  
  db.close();
}

module.exports = { scrapeWithAntiBot, init };