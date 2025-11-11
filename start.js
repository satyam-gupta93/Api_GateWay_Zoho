const { spawn } = require('child_process');
const path = require('path');

const services = [
  {
    name: 'Payment Service 1',
    script: path.join(__dirname, 'services', 'payment-service-1.js'),
    color: '\x1b[32m'
  },
  {
    name: 'Payment Service 2',
    script: path.join(__dirname, 'services', 'payment-service-2.js'),
    color: '\x1b[33m'
  },
  {
    name: 'API Gateway',
    script: path.join(__dirname, 'gateway.js'),
    color: '\x1b[36m'
  }
];

const reset = '\x1b[0m';
const processes = [];

console.log('\nStarting Payment API Gateway System...\n');

services.forEach((service) => {
  const proc = spawn('node', [service.script], {
    stdio: 'pipe',
    env: process.env
  });

  proc.stdout.on('data', (data) => {
    console.log(`${service.color}[${service.name}]${reset} ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`${service.color}[${service.name}]${reset} ERROR: ${data.toString().trim()}`);
  });

  proc.on('close', (code) => {
    console.log(`${service.color}[${service.name}]${reset} Process exited with code ${code}`);
  });

  processes.push({ name: service.name, proc });
});

process.on('SIGINT', () => {
  console.log('\n\n Shutting down all services...\n');
  processes.forEach(({ name, proc }) => {
    console.log(`Stopping ${name}...`);
    proc.kill();
  });
  process.exit(0);
});

console.log('\n All services started successfully!');
console.log('\n Service Endpoints:');
console.log('   - API Gateway:        http://localhost:4000');
console.log('   - Payment Service 1:  http://localhost:5001');
console.log('   - Payment Service 2:  http://localhost:5002');
console.log('\n Press Ctrl+C to stop all services\n');
