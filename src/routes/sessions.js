const express = require('express');
const { getDatabase } = require('../config/database');
const { scrapeWithAntiBot } = require('../utils/scraper');
const { logger } = require('../index');
const router = express.Router();

// Add a session to monitor
router.post('/add', (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const db = getDatabase();
    
    // Check if session already exists for this user
    db.get('SELECT * FROM sessions WHERE user_id = ? AND session_id = ?', [userId, sessionId], (err, session) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (session) {
        db.close();
        return res.status(409).json({ error: 'Session already being monitored' });
      }
      
      // Add session
      db.run('INSERT INTO sessions (user_id, session_id) VALUES (?, ?)', [userId, sessionId], function(err) {
        db.close();
        
        if (err) {
          return res.status(500).json({ error: 'Failed to add session' });
        }
        
        res.status(201).json({ 
          message: 'Session added successfully',
          sessionId: sessionId,
          id: this.lastID
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user sessions
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDatabase();
    
    db.all('SELECT * FROM sessions WHERE user_id = ?', [userId], (err, sessions) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ sessions });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat messages for a session
router.get('/:sessionId/messages', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const db = getDatabase();
    
    db.all(
      'SELECT * FROM chats WHERE sessao_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?',
      [sessionId, parseInt(limit), parseInt(offset)],
      (err, messages) => {
        db.close();
        
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ messages });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual trigger for scraping (for testing)
router.post('/:sessionId/scrape', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    logger.info(`Manual scrape triggered for session: ${sessionId}`);
    
    // Run scraper
    const result = await scrapeWithAntiBot(sessionId);
    
    if (result.error) {
      return res.status(400).json(result);
    }
    
    res.json({ 
      message: 'Scraping completed successfully',
      messages: result
    });
  } catch (error) {
    logger.error(`Scraping error for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Scraping failed', details: error.message });
  }
});

module.exports = router;