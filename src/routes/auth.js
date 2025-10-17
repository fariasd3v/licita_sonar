const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const db = getDatabase();
    
    // Check if user already exists
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (user) {
        db.close();
        return res.status(409).json({ error: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert new user
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
        db.close();
        
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }
        
        // Generate access token
        const accessToken = jwt.sign(
          { id: this.lastID, username },
          process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key',
          { expiresIn: '24h' }
        );
        
        res.status(201).json({ 
          message: 'User created successfully',
          accessToken 
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const db = getDatabase();
    
    // Find user
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate access token
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        message: 'Login successful',
        accessToken,
        user: { id: user.id, username: user.username }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Get user details from database
    const db = getDatabase();
    db.get('SELECT id, username FROM users WHERE id = ?', [user.id], (err, userData) => {
      db.close();
      
      if (err || !userData) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ 
        message: 'Token is valid',
        user: { id: userData.id, username: userData.username }
      });
    });
  });
});

module.exports = router;