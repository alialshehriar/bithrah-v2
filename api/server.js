// Vercel Serverless Function - Uses built files from dist/
const path = require('path');

// Import the built Express app
const { createApp } = require(path.join(process.cwd(), 'dist', 'index.js'));

let appPromise;

module.exports = async function handler(req, res) {
  // Initialize app once (cached across invocations)
  if (!appPromise) {
    appPromise = createApp();
  }
  
  const app = await appPromise;
  
  // Handle the request
  return app(req, res);
};
