import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  vus: 1,
  iterations: 3000,
};

function generateRandomEmail() {
  return `kkk_${Math.random().toString(36).substring(7)}@example.com`;
}

export default function () {
  // 사용자 등록
  const registerUrl = 'http://localhost:3000/auth/register';
  const email = generateRandomEmail();
  const registerPayload = JSON.stringify({ email: email });
  const registerHeaders = { 'Content-Type': 'application/json' };
  const registerRes = http.post(registerUrl, registerPayload, {
    headers: registerHeaders,
  });

  check(registerRes, {
    'user registration successful': (r) => r.status === 201,
  });

  if (registerRes.status !== 201) {
    console.error(
      `User registration failed: ${registerRes.status} ${registerRes.body}`,
    );
    errorRate.add(1);
    return;
  }

  const accessToken = JSON.parse(registerRes.body).data.accessToken;

  // 대기열 요청
  const enqueueUrl = 'http://localhost:3000/enqueue';
  const enqueueHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const enqueueRes = http.post(enqueueUrl, null, {
    headers: enqueueHeaders,
  });

  check(enqueueRes, { 'enqueue successful': (r) => r.status === 201 });

  if (enqueueRes.status !== 201) {
    console.error(`Enqueue failed: ${enqueueRes.status} ${enqueueRes.body}`);
    errorRate.add(1);
  }

  const enqueueGetRes = http.get(enqueueUrl, {
    headers: enqueueHeaders,
  });
  check(enqueueGetRes, { 'check enqueue': (r) => r.status === 200 });

  if (enqueueGetRes.status !== 200) {
    console.error(
      `Enqueue check failed: ${enqueueGetRes.status} ${enqueueGetRes.body}`,
    );
    errorRate.add(1);
  }
}
