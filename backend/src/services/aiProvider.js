/**
 * @deprecated FN-005: AI Provider Adapter — RETIRED
 *
 * This file previously handled direct Gemini API calls.
 * As of the RAG integration, it has been replaced by ragClient.js (FN-005-RAG).
 * Kept as fallback reference. Do not import this file in production routes.
 *
 * To revert to direct Gemini calls: in analyze.js, swap ragClient → aiProvider.
 */

import log from '../utils/logger.js';

const CODE_REVIEW_PROMPT = `You are an expert code reviewer. Analyze the following code and provide a detailed review.

For the code below, identify:
1. Bugs and issues (if any)
2. Suggestions for improvements (if any)
3. A plain English explanation of what the code does
4. An optimized version of the code (if improvements are possible)

Provide your response in valid JSON format:
{
  "bugs": ["bug1 description", "bug2 description"],
  "improvements": ["improvement1", "improvement2"],
  "explanation": "plain English explanation",
  "optimized_code": "optimized code or original if already optimal"
}

Code to review:
`;

async function callAIProvider(code) {
  log.info('AI', 'Starting AI analysis');
  log.debug('AI', `Code length: ${code.length} characters`);

  const API_KEY = process.env.GEMMA_API_KEY;
  const model = 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: CODE_REVIEW_PROMPT + code }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemma API');
    }

    const fullResponse = data.candidates[0].content.parts[0].text;

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log.info('AI', `AI analysis completed in ${duration}s`);
    log.debug('AI', `Response length: ${fullResponse.length} characters`);

    return {
      success: true,
      data: fullResponse,
      time: `${duration}s`
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log.error('AI', `AI provider error: ${error.message}`);
    log.debug('AI', `Error details: ${error.stack}`);

    return {
      success: false,
      error: error.message,
      time: `${duration}s`
    };
  }
}

export { callAIProvider, CODE_REVIEW_PROMPT };
export default callAIProvider;
