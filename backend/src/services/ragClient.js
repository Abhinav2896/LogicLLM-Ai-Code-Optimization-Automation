import axios from 'axios';

const RAG_SERVICE_URL = 'http://localhost:8000';
const TIMEOUT_MS = 120000;

async function analyzeCode(code) {
  const startTime = Date.now();

  try {
    const response = await axios.post(
      RAG_SERVICE_URL + '/analyze',
      { code },
      { timeout: TIMEOUT_MS }
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    const resultPayload = response?.data?.data ?? response?.data;
    const payload = typeof resultPayload === 'string'
      ? resultPayload
      : JSON.stringify(resultPayload);

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
