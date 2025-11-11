import http from 'k6/http';
import { sleep, check } from 'k6';

// strees test

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '15s', target: 100 },
    { duration: '15s', target: 200 },
    { duration: '15s', target: 300 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'], // less than 10% failure allowed
  },
};

export default function () {
  const res = http.get('http://host.docker.internal:4000/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
