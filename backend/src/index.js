import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import log from './utils/logger.js';
import analyzeRouter from './routes/analyze.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const PORT = process.env.BACKEND_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  log.debug('REQUEST', `${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  log.debug('HEALTH', 'Health check requested');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ai-code-reviewer-backend'
  });
});

app.use('/api', analyzeRouter);

app.use((err, req, res, next) => {
  log.error('ERROR', `Unhandled error: ${err.message}`);
  log.debug('ERROR', `Stack: ${err.stack}`);
  res.status(500).json({
    error: 'Internal server error',
    fallback: true
  });
});

app.use((req, res) => {
  log.warn('REQUEST', `404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  log.success('SERVER', `Backend server running on port ${PORT}`);
  log.info('SERVER', `Health check: http://localhost:${PORT}/health`);
  log.info('SERVER', `API endpoint: http://localhost:${PORT}/api/analyze`);
});

export default app;
