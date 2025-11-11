import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

const payload = JSON.stringify({
  userId: "test-user-1",
  amount: 100,
  paymentMethod: "credit_card"
});

const headers = { 'Content-Type': 'application/json' };

export default function () {
    const res = http.post('http://host.docker.internal:4000/api/payments/pay', payload, { headers });
  check(res, { 'status is 201': (r) => r.status === 201 });
  sleep(1);
}
