const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getDatabase } = require('../config/database');

puppeteer.use(StealthPlugin());

// User agent rotation array with more realistic agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
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
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection'
      ]
    });
    
    const page = await browser.newPage();
    
    // Apply user agent
    await page.setUserAgent(randomUserAgent);
    
    // Set extra headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1'
    });
    
    // Set viewport to a common desktop size
    await page.setViewport({ width: 1366, height: 768 });
    
    // Navigate to the BB licitacoes website
    if (!logger) {
      console.log(`Navigating to BB licitacoes page for session: ${sessionId}`);
    } else {
      logger.info(`Navigating to BB licitacoes page for session: ${sessionId}`);
    }
    
    // Try to access the session page on BB website
    await page.goto(`https://licitacoes-e2.bb.com.br/`, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Try to find and navigate to the specific session
    try {
      // Look for search or navigation elements
      const searchInput = await page.$('input[type="text"], input[name*="search"], input[placeholder*="sess"]');
      if (searchInput) {
        await searchInput.type(sessionId);
        // Try to find a search button
        const searchButton = await page.$('button[type="submit"], button[title*="buscar"], .search-button');
        if (searchButton) {
          await searchButton.click();
        } else {
          // Press Enter if no button found
          await searchInput.press('Enter');
        }
      }
      
      // Wait for results
      await page.waitForTimeout(5000);
    } catch (searchError) {
      if (!logger) {
        console.log(`Search navigation failed for session ${sessionId}:`, searchError.message);
      } else {
        logger.info(`Search navigation failed for session ${sessionId}:`, searchError.message);
      }
    }
    
    // Simulate human interaction
    // Random scroll
    await page.evaluate(() => {
      window.scrollBy(0, Math.random() * 300 + 100); // Scroll 100-400px
    });
    
    // Random delay between 3-12 seconds
    await new Promise(resolve => setTimeout(resolve, Math.random() * 9000 + 3000));
    
    // Random click in a non-intrusive area
    const body = await page.$('body');
    if (body) {
      const box = await body.boundingBox();
      if (box) {
        await page.mouse.move(
          box.x + Math.random() * box.width * 0.8 + box.width * 0.1,
          box.y + Math.random() * box.height * 0.8 + box.height * 0.1
        );
        await page.mouse.click(
          box.x + Math.random() * box.width * 0.1,
          box.y + Math.random() * box.height * 0.1
        );
      }
    }
    
    // Wait for chat messages to load or try alternative selectors
    let messages = [];
    let foundMessages = false;
    
    // Try multiple selectors for chat messages
    const selectors = [
      '#chat-messages li',
      '.chat-message',
      '.message-item',
      '[class*="message"][class*="chat"]',
      'div[class*="chat"] div[class*="message"]',
      '.chat-container .message',
      '.messages-container .message-item'
    ];
    
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        foundMessages = true;
        break;
      } catch (waitError) {
        // Continue to next selector
        continue;
      }
    }
    
    if (foundMessages) {
      // Extract messages from chat
      messages = await page.evaluate(() => {
        // Try multiple approaches to get messages
        const messageElements = document.querySelectorAll('#chat-messages li, .chat-message, .message-item, [class*="message"][class*="chat"]');
        return Array.from(messageElements).map(el => ({
          text: el.innerText.trim(),
          timestamp: new Date().toISOString()
        })).filter(msg => msg.text.length > 0);
      });
    } else {
      // If we can't find messages with selectors, try to get all text content
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
      
      // Try to extract messages from page content
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.includes('chat') || bodyText.includes('mensagem')) {
        // Simple extraction - split by newlines and filter
        const lines = bodyText.split('\n').filter(line => line.trim().length > 10);
        messages = lines.slice(-20).map(line => ({
          text: line.trim(),
          timestamp: new Date().toISOString()
        }));
      }
    }
    
    await browser.close();
    
    // Save messages to database
    if (messages.length > 0) {
      saveMessagesToDatabase(sessionId, messages);
    }
    
    // Return last 10 messages
    return messages.slice(-10);
    
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
    return { error: 'Erro de coleta', details: error.message };
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