// Simple build script for frontend deployment
// This script ensures all frontend files are ready for deployment

const fs = require('fs');
const path = require('path');

console.log('Preparing frontend for deployment...');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log('Created public directory');
}

// List of frontend files to check
const frontendFiles = [
  'index.html',
  'dashboard.html'
];

frontendFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} found`);
  } else {
    console.log(`✗ ${file} missing`);
  }
});

console.log('Frontend preparation complete!');