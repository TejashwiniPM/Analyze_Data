import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON and URL-encoded body parsing up to 50MB for CSV datasets
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Analyze Data', timestamp: new Date().toISOString() });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Analyze Data] Platform listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Analyze Data] Critical server startup failure:', err);
  process.exit(1);
});
