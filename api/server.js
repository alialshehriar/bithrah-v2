// Vercel Serverless Function - ES Modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let appPromise;

export default async function handler(req, res) {
  // Initialize app once (cached across invocations)
  if (!appPromise) {
    // Dynamically import the built Express app
    appPromise = import(join(__dirname, '..', 'dist', 'index.js')).then(
      (module) => module.createApp()
    );
  }
  
  const app = await appPromise;
  
  // Handle the request
  return app(req, res);
}
