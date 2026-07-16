import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import log from '../utils/logger.js';
import validateInput from '../middleware/validator.js';
import analyzeCode from '../services/ragClient.js';
import parseAIResponse from '../services/parser.js';
import generateFallback from '../services/fallback.js';
import callAIProvider from '../services/aiProvider.js';

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

  const aiResult = await analyzeCode(validation.code, validation.language_hint, requestId);
  let finalAiResult = aiResult;

  if (!aiResult.success) {
    log.warn('AI', `RAG AI call failed for request ${requestId}: ${aiResult.error}. Trying direct Gemini fallback.`);
    const fallbackResult = await callAIProvider(validation.code);
    
    if (fallbackResult.success) {
      log.info('AI', `Direct Gemini fallback succeeded for request ${requestId}`);
      finalAiResult = fallbackResult;
    } else {
      log.error('AI', `Direct Gemini fallback also failed for request ${requestId}: ${fallbackResult.error}`);
      const fallback = generateFallback(fallbackResult.error);
      fallback.requestId = requestId;
      fallback.time = aiResult.time;
      fallback.responseTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      log.warn('FALLBACK', `Returning fallback for request ${requestId}`);
      return res.status(200).json(fallback);
    }
  }

  log.debug('PARSER', `Parsing response for request ${requestId}`);
  const parsedResult = parseAIResponse(finalAiResult.data);

  parsedResult.requestId = requestId;
  parsedResult.time = finalAiResult.time; // Use measured duration, not LLM's made-up time
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
