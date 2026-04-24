import log from '../utils/logger.js';

const MAX_CODE_LENGTH = 50000;

function validateInput(body) {
  log.debug('VALIDATOR', 'Validating input');

  if (!body) {
    log.warn('VALIDATOR', 'Request body is missing');
    return {
      valid: false,
      error: 'Request body is required'
    };
  }

  if (typeof body.code === 'undefined') {
    log.warn('VALIDATOR', 'Code property is missing');
    return {
      valid: false,
      error: 'Code is required'
    };
  }

  if (typeof body.code !== 'string') {
    log.warn('VALIDATOR', 'Code is not a string');
    return {
      valid: false,
      error: 'Code must be a string'
    };
  }

  const trimmedCode = body.code.trim();

  if (trimmedCode.length === 0) {
    log.warn('VALIDATOR', 'Code is empty');
    return {
      valid: false,
      error: 'Code cannot be empty'
    };
  }

  if (trimmedCode.length > MAX_CODE_LENGTH) {
    log.warn('VALIDATOR', `Code exceeds max length: ${trimmedCode.length} > ${MAX_CODE_LENGTH}`);
    return {
      valid: false,
      error: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`
    };
  }

  log.debug('VALIDATOR', `Validation passed. Code length: ${trimmedCode.length} characters`);

  return {
    valid: true,
    code: trimmedCode
  };
}

export { validateInput, MAX_CODE_LENGTH };
export default validateInput;
