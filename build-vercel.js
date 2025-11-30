import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildVercel() {
  console.log('🔨 Building for Vercel...');

  // Build frontend
  console.log('📦 Building frontend...');
  await import('vite').then(({ build: viteBuild }) => viteBuild());

  // Build API serverless function
  console.log('⚙️  Building API function...');
  await build({
    entryPoints: [join(__dirname, 'server/_core/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: join(__dirname, 'api/server.js'),
    external: [
      '@neondatabase/serverless',
      'drizzle-orm',
      '@trpc/server',
      'express',
      'superjson',
      'zod',
    ],
    banner: {
      js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
    },
  });

  // Create Vercel handler wrapper
  console.log('📝 Creating Vercel handler...');
  const handlerCode = `
import { createApp } from './server.js';

let app;

export default async function handler(req, res) {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
}
`;

  await fs.writeFile(join(__dirname, 'api/index.js'), handlerCode);

  console.log('✅ Build complete!');
}

buildVercel().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
