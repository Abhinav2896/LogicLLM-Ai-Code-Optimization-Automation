import axios from 'axios';

let RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';
if (RAG_SERVICE_URL && !RAG_SERVICE_URL.startsWith('http')) {
  RAG_SERVICE_URL = `http://${RAG_SERVICE_URL}`;
}
const TIMEOUT_MS = 120000;

async function analyzeCode(code, language_hint, requestId) {
  const startTime = Date.now();

  try {
    const response = await axios.post(
      RAG_SERVICE_URL + '/analyze',
      { code, language_hint },
      { 
        timeout: TIMEOUT_MS,
        headers: { 'x-request-id': requestId }
      }
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Do not double serialize; parser.js expects an object now
    const payload = response?.data?.data ?? response?.data;

    return {
      success: true,
      data: payload,
      time: `${duration}s`
    };

  } catch (err) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.error('RAG ERROR:', err.message);

    return {
      success: false,
      data: null,
      error: err.message || 'RAG service failed',
      time: `${duration}s`
    };
  }
}

export default analyzeCode;
