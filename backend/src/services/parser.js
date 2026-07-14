import log from '../utils/logger.js';
import generateFallback from './fallback.js';

function calculateScore(bugs, improvements) {
  let score = 100;
  if (bugs && Array.isArray(bugs)) {
    score -= bugs.length * 5;
  }
  if (improvements && Array.isArray(improvements)) {
    score -= improvements.length * 2;
  }
  return Math.max(0, score);
}

function parseAIResponse(dataPayload) {
  log.debug('PARSER', 'Parsing AI response');

  try {
    const parsed = typeof dataPayload === 'string' ? JSON.parse(dataPayload) : dataPayload;

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Payload is not a valid object');
    }

    const result = {
      language: parsed.language || 'Unknown',
      bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : 'No explanation provided.',
      optimized_code: typeof parsed.optimized_code === 'string' ? parsed.optimized_code : '',
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      score: calculateScore(parsed.bugs, parsed.improvements),
      time: parsed.time || '0ms'
    };

    log.success('PARSER', 'Successfully parsed AI response');
    log.debug('PARSER', `Score calculated: ${result.score}`);

    return result;
  } catch (error) {
    log.error('PARSER', `Failed to parse AI response: ${error.message}`);
    log.debug('PARSER', `Raw response was: ${JSON.stringify(dataPayload).substring(0, 200)}...`);

    const fallback = generateFallback('Data parsing failed. The AI response was not in the expected format.');
    return fallback;
  }
}

export { parseAIResponse, calculateScore };
export default parseAIResponse;
