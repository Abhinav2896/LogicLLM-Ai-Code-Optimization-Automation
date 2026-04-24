const log = {
  info: (tag, message) => console.log(`[${new Date().toISOString()}] [INFO] [${tag}] ${message}`),
  debug: (tag, message) => console.log(`[${new Date().toISOString()}] [DEBUG] [${tag}] ${message}`),
  success: (tag, message) => console.log(`[${new Date().toISOString()}] [SUCCESS] [${tag}] ${message}`),
  warn: (tag, message) => console.log(`[${new Date().toISOString()}] [WARN] [${tag}] ${message}`),
  error: (tag, message) => console.log(`[${new Date().toISOString()}] [ERROR] [${tag}] ${message}`)
};

export default log;
