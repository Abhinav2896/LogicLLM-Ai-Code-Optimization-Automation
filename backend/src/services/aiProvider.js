import OpenAI from 'openai';
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

  const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  const startTime = Date.now();

  try {
    const completion = await openai.chat.completions.create({
      model: 'qwen/qwen2.5-coder-32b-instruct',
      messages: [
        {
          role: 'user',
          content: CODE_REVIEW_PROMPT + code
        }
      ],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    log.debug('AI', 'Stream started, buffering response...');

    let fullResponse = '';
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
    }

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
