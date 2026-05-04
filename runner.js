import { spawn, exec } from 'child_process';
import { setTimeout } from 'timers/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RAG_PORT = 8000;
const FRONTEND_PORT = 3000;
const BACKEND_PORT = 3001;
const RAG_DIR = join(__dirname, 'rag_service');
const FRONTEND_DIR = join(__dirname, 'Frontend');
const BACKEND_DIR = join(__dirname, 'backend');

let ragProcess = null;
let frontendProcess = null;
let backendProcess = null;

const log = {
  info: (tag, message) => console.log(`[${new Date().toISOString()}] [INFO] [${tag}] ${message}`),
  debug: (tag, message) => console.log(`[${new Date().toISOString()}] [DEBUG] [${tag}] ${message}`),
  success: (tag, message) => console.log(`[${new Date().toISOString()}] [SUCCESS] [${tag}] ${message}`),
  warn: (tag, message) => console.log(`[${new Date().toISOString()}] [WARN] [${tag}] ${message}`),
  error: (tag, message) => console.log(`[${new Date().toISOString()}] [ERROR] [${tag}] ${message}`)
};

function getPortProcessWindows(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (error || !stdout) {
        resolve(null);
        return;
      }
      const lines = stdout.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const state = parts[3];
          const pid = parts[4];
          if (state === 'LISTENING') {
            resolve(pid);
            return;
          }
        }
      }
      resolve(null);
    });
  });
}

async function killProcessOnPortWindows(port) {
  log.info('PORT', `Checking port ${port}...`);

  const pid = await getPortProcessWindows(port);

  if (!pid) {
    log.debug('PORT', `Port ${port} is free`);
    return true;
  }

  log.warn('PORT', `Port ${port} is occupied by PID ${pid}. Attempting to kill...`);

  return new Promise((resolve) => {
    exec(`taskkill /PID ${pid} /F`, (error) => {
      if (error) {
        log.error('PORT', `Failed to kill process ${pid} on port ${port}: ${error.message}`);
        resolve(false);
        return;
      }
      log.success('PORT', `Killed process ${pid} on port ${port}`);
      setTimeout(500).then(() => resolve(true));
    });
  });
}

async function checkPortFree(port) {
  const pid = await getPortProcessWindows(port);
  return pid === null;
}

async function ensurePortsFree() {
  log.info('PORT', 'Checking port availability...');

  const ragFree = await checkPortFree(RAG_PORT);
  const frontendFree = await checkPortFree(FRONTEND_PORT);
  const backendFree = await checkPortFree(BACKEND_PORT);

  if (ragFree && frontendFree && backendFree) {
    log.success('PORT', `All ports ${RAG_PORT}, ${FRONTEND_PORT}, and ${BACKEND_PORT} are free`);
    return true;
  }

  if (!ragFree) {
    const killed = await killProcessOnPortWindows(RAG_PORT);
    if (!killed) {
      log.error('PORT', `Could not free port ${RAG_PORT}. Launch aborted.`);
      return false;
    }
  }

  if (!frontendFree) {
    const killed = await killProcessOnPortWindows(FRONTEND_PORT);
    if (!killed) {
      log.error('PORT', `Could not free port ${FRONTEND_PORT}. Launch aborted.`);
      return false;
    }
  }

  if (!backendFree) {
    const killed = await killProcessOnPortWindows(BACKEND_PORT);
    if (!killed) {
      log.error('PORT', `Could not free port ${BACKEND_PORT}. Launch aborted.`);
      return false;
    }
  }

  const ragStillFree = await checkPortFree(RAG_PORT);
  const frontendStillFree = await checkPortFree(FRONTEND_PORT);
  const backendStillFree = await checkPortFree(BACKEND_PORT);

  if (!ragStillFree) {
    log.error('PORT', `Port ${RAG_PORT} still occupied after kill attempt. Launch aborted.`);
    return false;
  }

  if (!frontendStillFree) {
    log.error('PORT', `Port ${FRONTEND_PORT} still occupied after kill attempt. Launch aborted.`);
    return false;
  }

  if (!backendStillFree) {
    log.error('PORT', `Port ${BACKEND_PORT} still occupied after kill attempt. Launch aborted.`);
    return false;
  }

  log.success('PORT', 'All ports are now free');
  return true;
}

async function waitForRAGHealth(maxWaitMs = 90000) {
  const startTime = Date.now();
  const checkInterval = 1000;

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const response = await fetch(`http://localhost:${RAG_PORT}/health`);
      if (response.ok) {
        return true;
      }
    } catch {
    }
    await setTimeout(checkInterval);
  }
  return false;
}

function startRAG() {
  log.info('RAG', `Starting Python RAG service on port ${RAG_PORT}...`);

  const pythonPath = join(RAG_DIR, '.venv_local', 'Scripts', 'python.exe');

  ragProcess = spawn(pythonPath, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', RAG_PORT.toString()], {
    cwd: RAG_DIR,
    stdio: 'pipe',
    shell: true
  });

  ragProcess.stdout.on('data', (data) => {
    process.stdout.write(`[RAG] ${data}`);
  });

  ragProcess.stderr.on('data', (data) => {
    process.stderr.write(`[RAG ERROR] ${data}`);
  });

  ragProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log.error('RAG', `RAG process exited with code ${code}`);
    }
  });

  ragProcess.on('error', (err) => {
    log.error('RAG', `RAG failed to start: ${err.message}`);
  });

  log.debug('RAG', `RAG process started with PID ${ragProcess.pid}`);
}

function startBackend() {
  log.info('BACKEND', 'Starting backend server...');

  const backendEnv = { ...process.env };
  backendEnv.PORT = BACKEND_PORT.toString();

  backendProcess = spawn('node', ['src/index.js'], {
    cwd: BACKEND_DIR,
    stdio: 'pipe',
    shell: true,
    env: backendEnv
  });

  backendProcess.stdout.on('data', (data) => {
    process.stdout.write(`[BACKEND] ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    process.stderr.write(`[BACKEND ERROR] ${data}`);
  });

  backendProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log.error('BACKEND', `Backend process exited with code ${code}`);
    }
  });

  backendProcess.on('error', (err) => {
    log.error('BACKEND', `Backend failed to start: ${err.message}`);
  });

  log.debug('BACKEND', `Backend process started with PID ${backendProcess.pid}`);
}

function startFrontend() {
  log.info('FRONTEND', 'Starting frontend server...');

  frontendProcess = spawn('npm', ['run', 'dev', '--', '--port', FRONTEND_PORT.toString()], {
    cwd: FRONTEND_DIR,
    stdio: 'pipe',
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    process.stdout.write(`[FRONTEND] ${data}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    process.stderr.write(`[FRONTEND ERROR] ${data}`);
  });

  frontendProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log.error('FRONTEND', `Frontend process exited with code ${code}`);
    }
  });

  frontendProcess.on('error', (err) => {
    log.error('FRONTEND', `Frontend failed to start: ${err.message}`);
  });

  log.debug('FRONTEND', `Frontend process started with PID ${frontendProcess.pid}`);
}

async function shutdown() {
  log.info('SHUTDOWN', 'Shutdown requested...');

  if (frontendProcess) {
    log.debug('SHUTDOWN', 'Stopping frontend...');
    frontendProcess.kill('SIGTERM');
    setTimeout(1000).then(() => {
      if (frontendProcess) {
        frontendProcess.kill('SIGKILL');
      }
    });
  }

  if (backendProcess) {
    log.debug('SHUTDOWN', 'Stopping backend...');
    backendProcess.kill('SIGTERM');
    setTimeout(1000).then(() => {
      if (backendProcess) {
        backendProcess.kill('SIGKILL');
      }
    });
  }

  if (ragProcess) {
    log.debug('SHUTDOWN', 'Stopping RAG service...');
    ragProcess.kill('SIGTERM');
    setTimeout(1000).then(() => {
      if (ragProcess) {
        ragProcess.kill('SIGKILL');
      }
    });
  }

  log.success('SHUTDOWN', 'Shutdown completed');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function main() {
  console.log('\n========================================');
  console.log('   LogicLLM - Runner');
  console.log('========================================\n');

  log.info('RUNNER', 'Starting LogicLLM with RAG...');
  log.info('RUNNER', `RAG service port: ${RAG_PORT}`);
  log.info('RUNNER', `Backend port: ${BACKEND_PORT}`);
  log.info('RUNNER', `Frontend port: ${FRONTEND_PORT}`);

  const portsReady = await ensurePortsFree();

  if (!portsReady) {
    log.error('RUNNER', 'Ports are not available. Cannot start services.');
    console.log('\n========================================');
    console.log('   ERROR: Ports unavailable');
    console.log(`   Please free ports ${RAG_PORT}, ${FRONTEND_PORT}, and ${BACKEND_PORT}`);
    console.log('========================================\n');
    process.exit(1);
  }

  startRAG();
  log.info('RAG', 'Waiting for RAG service to be ready...');

  const ragReady = await waitForRAGHealth(90000);
  if (!ragReady) {
    log.error('RUNNER', 'RAG service failed to become ready within 90s. Aborting.');
    process.exit(1);
  }
  log.success('RAG', `RAG service ready on port ${RAG_PORT}`);

  startBackend();
  startFrontend();

  log.success('RUNNER', 'All services running...');
  log.info('RUNNER', 'Press Ctrl+C to stop all servers');

  console.log('\n========================================');
  console.log('   All services running...');
  console.log(`   RAG Service: http://localhost:${RAG_PORT}`);
  console.log(`   Backend: http://localhost:${BACKEND_PORT}`);
  console.log(`   Frontend: http://localhost:${FRONTEND_PORT}`);
  console.log('========================================\n');
}

main().catch((err) => {
  log.error('RUNNER', `Fatal error: ${err.message}`);
  process.exit(1);
});
