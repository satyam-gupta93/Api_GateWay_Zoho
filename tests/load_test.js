import http from 'k6/http';
import { sleep, check } from 'k6';

// load test

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
    http_req_failed: ['rate<0.05'],   // less than 5% failures
  },
};

export default function () {
  const res = http.get('http://localhost:4000/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
