import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import log from '../utils/logger.js';
import validateInput from '../middleware/validator.js';
import callAIProvider from '../services/aiProvider.js';
import parseAIResponse from '../services/parser.js';
import generateFallback from '../services/fallback.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  log.info('REQUEST', `Request received: ${requestId}`);
  log.debug('REQUEST', `Method: POST /api/analyze`);
  log.debug('REQUEST', `Request ID: ${requestId}`);

  const validation = validateInput(req.body);

  if (!validation.valid) {
    log.warn('VALIDATOR', `Validation failed for request ${requestId}: ${validation.error}`);
    return res.status(400).json({
      error: validation.error,
      requestId
    });
  }

  log.debug('VALIDATOR', `Validation passed for request ${requestId}`);
  log.info('AI', `Starting AI analysis for request ${requestId}`);

  const aiResult = await callAIProvider(validation.code);

  if (!aiResult.success) {
    log.error('AI', `AI call failed for request ${requestId}: ${aiResult.error}`);
    const fallback = generateFallback(aiResult.error);
    fallback.requestId = requestId;
    fallback.time = aiResult.time;
    fallback.responseTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
    log.warn('FALLBACK', `Returning fallback for request ${requestId}`);
    return res.status(200).json(fallback);
  }

  log.debug('PARSER', `Parsing response for request ${requestId}`);
  const parsedResult = parseAIResponse(aiResult.data);

  parsedResult.requestId = requestId;
  parsedResult.responseTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

  if (parsedResult.fallback) {
    log.warn('FALLBACK', `Fallback triggered for request ${requestId}`);
  } else {
    log.success('PARSER', `Successfully processed request ${requestId}`);
  }

  log.info('RESPONSE', `Sending response for request ${requestId}`);
  log.debug('RESPONSE', `Response time: ${parsedResult.responseTime}`);

  return res.status(200).json(parsedResult);
});

export default router;
