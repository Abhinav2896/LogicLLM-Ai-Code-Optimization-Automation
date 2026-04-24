import { spawn, exec, execSync } from 'child_process';
import { setTimeout } from 'timers/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRONTEND_PORT = 3000;
const BACKEND_PORT = 3001;
const FRONTEND_DIR = join(__dirname, 'Frontend');
const BACKEND_DIR = join(__dirname, 'backend');

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

  const frontendFree = await checkPortFree(FRONTEND_PORT);
  const backendFree = await checkPortFree(BACKEND_PORT);

  if (frontendFree && backendFree) {
    log.success('PORT', `Both ports ${FRONTEND_PORT} and ${BACKEND_PORT} are free`);
    return true;
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

  const frontendStillFree = await checkPortFree(FRONTEND_PORT);
  const backendStillFree = await checkPortFree(BACKEND_PORT);

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

  log.success('SHUTDOWN', 'Shutdown completed');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function main() {
  console.log('\n========================================');
  console.log('   LogicLLM - Runner');
  console.log('========================================\n');

  log.info('RUNNER', 'Starting application launcher...');
  log.info('RUNNER', `Frontend port: ${FRONTEND_PORT}`);
  log.info('RUNNER', `Backend port: ${BACKEND_PORT}`);

  const portsReady = await ensurePortsFree();

  if (!portsReady) {
    log.error('RUNNER', 'Ports are not available. Cannot start servers.');
    console.log('\n========================================');
    console.log('   ERROR: Ports unavailable');
    console.log(`   Please free ports ${FRONTEND_PORT} and ${BACKEND_PORT}`);
    console.log('========================================\n');
    process.exit(1);
  }

  startBackend();
  startFrontend();

  log.success('RUNNER', 'Servers starting...');
  log.info('RUNNER', 'Press Ctrl+C to stop all servers');

  console.log('\n========================================');
  console.log('   Servers starting...');
  console.log(`   Frontend: http://localhost:${FRONTEND_PORT}`);
  console.log(`   Backend: http://localhost:${BACKEND_PORT}`);
  console.log('========================================\n');
}

main().catch((err) => {
  log.error('RUNNER', `Fatal error: ${err.message}`);
  process.exit(1);
});
