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

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const MODEL_CHAIN = [
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

function geminiEndpoint(model) {
  return `${GEMINI_BASE}/${model}:generateContent`;
}

const TIMEOUT_MS = 55_000;
const MAX_RETRIES_PER_MODEL = 2;
const BASE_DELAY_MS = 1_000;
const RETRYABLE_SAME_MODEL = new Set([500, 502, 503]);

async function callAIProvider(code) {
  log.info('AI', 'Starting AI analysis with fallback logic');
  log.debug('AI', `Code length: ${code.length} characters`);

  const API_KEY = process.env.GEMMA_API_KEY;
  const startTime = Date.now();
  let lastError = null;

  for (let modelIndex = 0; modelIndex < MODEL_CHAIN.length; modelIndex++) {
    const model = MODEL_CHAIN[modelIndex];
    const url = geminiEndpoint(model);

    log.info('AI', `Trying model: ${model}`);

    for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: CODE_REVIEW_PROMPT + code }],
              },
            ],
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const fullResponse = data.candidates[0].content.parts[0].text;
          const endTime = Date.now();
          const duration = ((endTime - startTime) / 1000).toFixed(2);
          log.info('AI', `AI analysis completed in ${duration}s using ${model}`);
          return { success: true, data: fullResponse, time: `${duration}s`, usedModel: model };
        }

        const status = response.status;
        log.warn('AI', `Model ${model} attempt ${attempt} failed with status ${status}`);
        
        let errorMsg = `Status ${status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error?.message || errorMsg;
        } catch (e) {}
        
        lastError = new Error(errorMsg);

        if (status === 429) {
          log.warn('AI', `Rate limited (429) on ${model}. Moving to next fallback model.`);
          break; // move to next model
        }

        if (!RETRYABLE_SAME_MODEL.has(status)) {
          log.warn('AI', `Status ${status} is not retryable on ${model}. Moving to next model.`);
          break; // move to next model
        }

        // Wait before retrying same model
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        log.info('AI', `Waiting ${delay}ms before retrying ${model}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        lastError = error;
        log.error('AI', `Error calling ${model} on attempt ${attempt}: ${error.message}`);
        
        if (error.name === 'AbortError') {
          log.warn('AI', `Timeout on ${model}. Moving to next model.`);
          break; // move to next model
        }

        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  log.error('AI', 'All models in the fallback chain exhausted.');
  return { 
    success: false, 
    error: lastError ? lastError.message : 'All AI models exhausted', 
    time: `${duration}s` 
  };
}

export { callAIProvider, CODE_REVIEW_PROMPT };
export default callAIProvider;
