
/**
 * HealthVillage System Health Check
 * Pre-Flight Diagnostic Script for Production Deployment
 * 
 * This script performs a comprehensive health check of:
 * - Backend API connectivity
 * - Frontend availability
 * - MongoDB database connection
 * - Environment configuration
 * - Port availability
 * - Security settings
 */

import http from 'http';
import https from 'https';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Health check results
const results = {
  backend: { status: 'PENDING', details: [] },
  frontend: { status: 'PENDING', details: [] },
  database: { status: 'PENDING', details: [] },
  environment: { status: 'PENDING', details: [] },
  security: { status: 'PENDING', details: [] },
};

/**
 * Print formatted header
 */
function printHeader() {
  console.log('\n' + '='.repeat(70));
  console.log(colors.bright + colors.cyan + '🏥 HealthVillage System Health Check' + colors.reset);
  console.log('Pre-Flight Diagnostic for Production Deployment');
  console.log('='.repeat(70) + '\n');
}

/**
 * Print section header
 */
function printSection(title) {
  console.log('\n' + colors.bright + colors.blue + `📋 ${title}` + colors.reset);
  console.log('-'.repeat(70));
}

/**
 * Print status with icon
 */
function printStatus(label, status, message = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const color = status === 'PASS' ? colors.green : status === 'FAIL' ? colors.red : colors.yellow;
  console.log(`${icon} ${color}${label}${colors.reset}${message ? ': ' + message : ''}`);
}

/**
 * Check if a port is in use
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is in use
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is free
    });
    server.listen(port);
  });
}

/**
 * Make HTTP request
 */
function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read and parse .env file
 */
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    return env;
  } catch (error) {
    return null;
  }
}

/**
 * Check MongoDB connection
 */
async function checkMongoDB(mongoUri) {
  return new Promise((resolve) => {
    // Try to connect using a simple Node.js script
    const script = `
      import mongoose from 'mongoose';
      try {
        await mongoose.connect('${mongoUri}', { serverSelectionTimeoutMS: 5000 });
        console.log('CONNECTED');
        await mongoose.disconnect();
        process.exit(0);
      } catch (error) {
        console.log('ERROR:' + error.message);
        process.exit(1);
      }
    `;
    
    const child = spawn('node', ['--input-type=module', '-e', script], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'pipe',
    });

    let output = '';
    child.stdout.on('data', (data) => output += data.toString());
    child.stderr.on('data', (data) => output += data.toString());

    const timeout = setTimeout(() => {
      child.kill();
      resolve({ connected: false, error: 'Connection timeout' });
    }, 10000);

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (output.includes('CONNECTED')) {
        resolve({ connected: true });
      } else {
        const errorMatch = output.match(/ERROR:(.*)/);
        resolve({ connected: false, error: errorMatch ? errorMatch[1] : 'Unknown error' });
      }
    });
  });
}

/**
 * Check environment configuration
 */
async function checkEnvironment() {
  printSection('Environment Configuration');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  
  // Check backend .env
  if (!fileExists(backendEnvPath)) {
    results.environment.status = 'FAIL';
    results.environment.details.push('Backend .env file missing');
    printStatus('Backend .env', 'FAIL', 'File not found');
    return;
  }
  
  const backendEnv = parseEnvFile(backendEnvPath);
  if (!backendEnv) {
    results.environment.status = 'FAIL';
    results.environment.details.push('Cannot parse backend .env');
    printStatus('Backend .env', 'FAIL', 'Cannot parse file');
    return;
  }
  
  printStatus('Backend .env', 'PASS', 'File exists and readable');
  
  // Check required backend variables
  const requiredBackendVars = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL', 'NODE_ENV'];
  const missingBackendVars = requiredBackendVars.filter(v => !backendEnv[v]);
  
  if (missingBackendVars.length > 0) {
    results.environment.status = 'WARN';
    results.environment.details.push(`Missing variables: ${missingBackendVars.join(', ')}`);
    printStatus('Required Variables', 'WARN', `Missing: ${missingBackendVars.join(', ')}`);
  } else {
    printStatus('Required Variables', 'PASS', 'All present');
  }
  
  // Check JWT_SECRET strength
  if (backendEnv.JWT_SECRET && backendEnv.JWT_SECRET.length < 32) {
    results.environment.details.push('JWT_SECRET is weak (< 32 characters)');
    printStatus('JWT_SECRET Strength', 'WARN', 'Consider using a longer secret');
  } else if (backendEnv.JWT_SECRET) {
    printStatus('JWT_SECRET Strength', 'PASS', 'Adequate length');
  }
  
  // Check NODE_ENV
  if (backendEnv.NODE_ENV === 'production') {
    printStatus('Environment Mode', 'PASS', 'Production mode');
  } else {
    printStatus('Environment Mode', 'WARN', `Currently: ${backendEnv.NODE_ENV || 'not set'}`);
  }
  
  // Check frontend .env
  if (!fileExists(frontendEnvPath)) {
    results.environment.details.push('Frontend .env file missing');
    printStatus('Frontend .env', 'WARN', 'File not found (optional)');
  } else {
    const frontendEnv = parseEnvFile(frontendEnvPath);
    if (frontendEnv && frontendEnv.VITE_API_URL) {
      printStatus('Frontend .env', 'PASS', `API URL: ${frontendEnv.VITE_API_URL}`);
    } else {
      printStatus('Frontend .env', 'WARN', 'VITE_API_URL not set');
    }
  }
  
  if (results.environment.status === 'PENDING') {
    results.environment.status = missingBackendVars.length > 0 ? 'WARN' : 'PASS';
  }
}

/**
 * Check backend connectivity
 */
async function checkBackend() {
  printSection('Backend API Health');
  
  const backendUrl = 'http://localhost:5000';
  const healthUrl = `${backendUrl}/health`;
  
  // Check if port 5000 is in use
  const portInUse = await checkPort(5000);
  if (!portInUse) {
    results.backend.status = 'FAIL';
    results.backend.details.push('Backend not running on port 5000');
    printStatus('Backend Server', 'FAIL', 'Not running on port 5000');
    printStatus('Action Required', 'WARN', 'Start backend: cd backend && npm run dev');
    return;
  }
  
  printStatus('Port 5000', 'PASS', 'In use (backend likely running)');
  
  // Check health endpoint
  try {
    const response = await makeRequest(healthUrl);
    if (response.status === 200) {
      results.backend.status = 'PASS';
      results.backend.details.push('Health endpoint responding');
      printStatus('Health Endpoint', 'PASS', '/health returns 200');
      
      try {
        const data = JSON.parse(response.data);
        if (data.status === 'ok') {
          printStatus('Health Status', 'PASS', 'Server reports OK');
        }
      } catch {
        // Ignore JSON parse errors
      }
    } else {
      results.backend.status = 'WARN';
      results.backend.details.push(`Health endpoint returned ${response.status}`);
      printStatus('Health Endpoint', 'WARN', `Returned status ${response.status}`);
    }
  } catch (error) {
    results.backend.status = 'FAIL';
    results.backend.details.push(`Health check failed: ${error.message}`);
    printStatus('Health Endpoint', 'FAIL', error.message);
  }
  
  // Check CORS headers
  try {
    const response = await makeRequest(healthUrl);
    const corsHeader = response.headers['access-control-allow-origin'];
    if (corsHeader) {
      printStatus('CORS Headers', 'PASS', `Configured: ${corsHeader}`);
    } else {
      printStatus('CORS Headers', 'WARN', 'Not present in response');
    }
  } catch {
    // Already reported above
  }
}

/**
 * Check frontend availability
 */
async function checkFrontend() {
  printSection('Frontend Application');
  
  // Check multiple possible ports
  const possiblePorts = [5173, 8081, 8080, 3000];
  let frontendPort = null;
  let frontendUrl = null;
  
  for (const port of possiblePorts) {
    const portInUse = await checkPort(port);
    if (portInUse) {
      frontendPort = port;
      frontendUrl = `http://localhost:${port}`;
      break;
    }
  }
  
  if (!frontendPort) {
    results.frontend.status = 'FAIL';
    results.frontend.details.push('Frontend not running on any common port');
    printStatus('Frontend Server', 'FAIL', 'Not running on ports 5173, 8081, 8080, or 3000');
    printStatus('Action Required', 'WARN', 'Start frontend: cd frontend && npm run dev');
    return;
  }
  
  printStatus(`Port ${frontendPort}`, 'PASS', 'In use (frontend likely running)');
  
  // Try to fetch the frontend
  try {
    const response = await makeRequest(frontendUrl);
    if (response.status === 200) {
      results.frontend.status = 'PASS';
      results.frontend.details.push('Frontend responding');
      printStatus('Frontend Server', 'PASS', `Responding on port ${frontendPort}`);
      
      // Check if it's the right app
      if (response.data.includes('HealthVillage') || response.data.includes('root')) {
        printStatus('Application', 'PASS', 'HealthVillage app detected');
      }
      
      // Warn if not on default port
      if (frontendPort !== 5173) {
        printStatus('Port Notice', 'WARN', `Frontend on port ${frontendPort} (default is 5173)`);
        printStatus('CORS Check', 'WARN', `Ensure backend FRONTEND_URL=http://localhost:${frontendPort}`);
      }
    } else {
      results.frontend.status = 'WARN';
      results.frontend.details.push(`Frontend returned ${response.status}`);
      printStatus('Frontend Server', 'WARN', `Returned status ${response.status}`);
    }
  } catch (error) {
    results.frontend.status = 'FAIL';
    results.frontend.details.push(`Frontend check failed: ${error.message}`);
    printStatus('Frontend Server', 'FAIL', error.message);
  }
}

/**
 * Check database connectivity
 */
async function checkDatabase() {
  printSection('Database Connectivity');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const backendEnv = parseEnvFile(backendEnvPath);
  
  if (!backendEnv || !backendEnv.MONGO_URI) {
    results.database.status = 'FAIL';
    results.database.details.push('MONGO_URI not configured');
    printStatus('MongoDB URI', 'FAIL', 'Not configured in .env');
    return;
  }
  
  printStatus('MongoDB URI', 'PASS', 'Configured in .env');
  
  // Parse MongoDB URI
  const uriMatch = backendEnv.MONGO_URI.match(/mongodb:\/\/([^:]+):(\d+)\/(.+)/);
  if (uriMatch) {
    const [, host, port, dbName] = uriMatch;
    printStatus('Database Host', 'PASS', `${host}:${port}`);
    printStatus('Database Name', 'PASS', dbName);
  }
  
  // Check MongoDB connection
  console.log('\n⏳ Testing MongoDB connection (this may take a few seconds)...');
  const mongoResult = await checkMongoDB(backendEnv.MONGO_URI);
  
  if (mongoResult.connected) {
    results.database.status = 'PASS';
    results.database.details.push('MongoDB connection successful');
    printStatus('MongoDB Connection', 'PASS', 'Successfully connected');
  } else {
    results.database.status = 'FAIL';
    results.database.details.push(`MongoDB connection failed: ${mongoResult.error}`);
    printStatus('MongoDB Connection', 'FAIL', mongoResult.error);
    printStatus('Action Required', 'WARN', 'Ensure MongoDB is running: net start MongoDB (Windows) or sudo systemctl start mongod (Linux)');
  }
}

/**
 * Check security settings
 */
async function checkSecurity() {
  printSection('Security Configuration');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const backendEnv = parseEnvFile(backendEnvPath);
  
  if (!backendEnv) {
    results.security.status = 'FAIL';
    printStatus('Security Check', 'FAIL', 'Cannot read .env file');
    return;
  }
  
  let securityIssues = 0;
  
  // Check for hardcoded secrets in code
  const serverJsPath = path.join(__dirname, 'backend', 'src', 'server.js');
  if (fileExists(serverJsPath)) {
    const serverContent = fs.readFileSync(serverJsPath, 'utf8');
    if (serverContent.includes('mongodb://') && !serverContent.includes('process.env')) {
      printStatus('Hardcoded Secrets', 'FAIL', 'Found hardcoded MongoDB URI');
      securityIssues++;
    } else {
      printStatus('Hardcoded Secrets', 'PASS', 'No hardcoded secrets detected');
    }
  }
  
  // Check JWT_SECRET
  if (backendEnv.JWT_SECRET === 'your-secret-key' || backendEnv.JWT_SECRET === 'secret') {
    printStatus('JWT Secret', 'FAIL', 'Using default/weak secret');
    securityIssues++;
  } else if (backendEnv.JWT_SECRET && backendEnv.JWT_SECRET.length >= 32) {
    printStatus('JWT Secret', 'PASS', 'Strong secret configured');
  } else {
    printStatus('JWT Secret', 'WARN', 'Secret could be stronger');
  }
  
  // Check CORS configuration
  if (backendEnv.FRONTEND_URL) {
    printStatus('CORS Origin', 'PASS', `Configured: ${backendEnv.FRONTEND_URL}`);
  } else {
    printStatus('CORS Origin', 'WARN', 'FRONTEND_URL not set');
  }
  
  // Check NODE_ENV for production
  if (backendEnv.NODE_ENV === 'production') {
    printStatus('Production Mode', 'PASS', 'NODE_ENV=production');
  } else {
    printStatus('Production Mode', 'WARN', `NODE_ENV=${backendEnv.NODE_ENV || 'not set'} (should be "production" for deployment)`);
  }
  
  results.security.status = securityIssues > 0 ? 'FAIL' : 'PASS';
}

/**
 * Print final summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(70));
  console.log(colors.bright + colors.cyan + '📊 Health Check Summary' + colors.reset);
  console.log('='.repeat(70) + '\n');
  
  const components = [
    { name: 'Environment Configuration', result: results.environment },
    { name: 'Backend API', result: results.backend },
    { name: 'Frontend Application', result: results.frontend },
    { name: 'Database Connection', result: results.database },
    { name: 'Security Settings', result: results.security },
  ];
  
  let allPass = true;
  let hasWarnings = false;
  
  components.forEach(({ name, result }) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    const color = result.status === 'PASS' ? colors.green : result.status === 'FAIL' ? colors.red : colors.yellow;
    console.log(`${icon} ${color}${name}: ${result.status}${colors.reset}`);
    
    if (result.status === 'FAIL') allPass = false;
    if (result.status === 'WARN') hasWarnings = true;
    
    if (result.details.length > 0) {
      result.details.forEach(detail => {
        console.log(`   └─ ${detail}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(70));
  
  if (allPass && !hasWarnings) {
    console.log(colors.bright + colors.green + '🎉 ALL SYSTEMS GO! Ready for deployment.' + colors.reset);
  } else if (allPass && hasWarnings) {
    console.log(colors.bright + colors.yellow + '⚠️  MOSTLY READY - Review warnings before deployment.' + colors.reset);
  } else {
    console.log(colors.bright + colors.red + '❌ NOT READY - Fix critical issues before deployment.' + colors.reset);
  }
  
  console.log('='.repeat(70) + '\n');
}

/**
 * Main execution
 */
async function main() {
  printHeader();
  
  await checkEnvironment();
  await checkBackend();
  await checkFrontend();
  await checkDatabase();
  await checkSecurity();
  
  printSummary();
}

// Run the health check
main().catch(error => {
  console.error(colors.red + '❌ Health check failed:' + colors.reset, error);
  process.exit(1);
});
