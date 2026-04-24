import log from '../utils/logger.js';

function generateFallback(errorMessage = 'Unable to analyze code due to a processing error. Please try again or check your connection.') {
  log.warn('FALLBACK', 'Generating fallback response due to error');

  return {
    language: 'Unknown',
    bugs: [],
    improvements: ['Consider reviewing the code manually for potential issues.', errorMessage],
    explanation: 'Unable to analyze code due to a processing error. Please try again or check your connection.',
    optimized_code: '',
    score: 0,
    time: '0ms',
    fallback: true
  };
}

export default generateFallback;
