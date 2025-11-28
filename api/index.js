// Vercel Serverless Function - wraps Express app
const path = require('path');

// Import the built Express app
let app;
try {
  app = require('../dist/index.js').default || require('../dist/index.js');
} catch (err) {
  console.error('Failed to load Express app:', err);
  throw err;
}

// Export for Vercel
module.exports = app;
