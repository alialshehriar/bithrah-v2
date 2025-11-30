// Vercel Serverless Function - Main Entry Point
import { createApp } from '../server/_core/index.js';

let app;

export default async function handler(req, res) {
  // Initialize app once (cached across invocations)
  if (!app) {
    app = await createApp();
  }
  
  // Handle the request
  return app(req, res);
}
