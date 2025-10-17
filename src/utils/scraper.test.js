// Simple test for the scraper functionality
const { scrapeWithAntiBot } = require('./scraper');

// Mock logger for testing
const mockLogger = {
  info: console.log,
  warn: console.warn,
  error: console.error
};

// Initialize scraper with mock logger
require('./scraper').init(mockLogger);

async function testScraper() {
  console.log('Testing scraper functionality...');
  
  // Test case 1: Structure changed (using an invalid session ID)
  console.log('\\n--- Test 1: Invalid session ID (structure changed simulation) ---');
  try {
    const result1 = await scrapeWithAntiBot('invalid-session-id');
    console.log('Result:', result1);
  } catch (error) {
    console.log('Error (expected):', error.message);
  }
  
  console.log('\\n--- Test completed ---');
}

// Run the test
testScraper();