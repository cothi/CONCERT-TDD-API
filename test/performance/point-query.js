import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  vus: 1,
  duration: '30s',
  iterations: 100000,
};

function generateRandomEmail() {
  return `kkk_${Math.random().toString(36).substring(7)}@example.com`;
}

// 초기 설정: 사용자 한 명 등록
export function setup() {
  const registerUrl = 'http://localhost:3000/auth/register';
  const chargeUrl = 'http://localhost:3000/points/charge';

  const email = generateRandomEmail();
  console.log(`Test will run with email: ${email}`);

  const registerPayload = JSON.stringify({ email: email });
  const registerHeaders = { 'Content-Type': 'application/json' };

  const registerRes = http.post(registerUrl, registerPayload, {
    headers: registerHeaders,
  });

  const accessToken = JSON.parse(registerRes.body).data.accessToken;

  if (registerRes.status !== 201) {
    console.error(
      `Initial user registration failed: ${registerRes.status} ${registerRes.body}`,
    );
    return null;
  }
  // 포인트 충전
  const chargePayload = JSON.stringify({ amount: 1 });
  const chargeHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const chargeRes = http.patch(chargeUrl, chargePayload, {
    headers: chargeHeaders,
  });
  check(chargeRes, { 'charge successful': (r) => r.status === 200 });

  if (chargeRes.status !== 200) {
    errorRate.add(1);
    console.error(`Charge failed: ${chargeRes.status} ${chargeRes.body}`);
  }

  return accessToken;
}

// main
export default function (accessToken) {
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  // 조회
  const queryUrl = 'http://localhost:3000/points';
  const chargeHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const chargeRes = http.get(queryUrl, {
    headers: chargeHeaders,
  });
  check(chargeRes, { 'charge successful': (r) => r.status === 200 });

  if (chargeRes.status !== 200) {
    errorRate.add(1);
    console.error(`Charge failed: ${chargeRes.status} ${chargeRes.body}`);
  }
}
