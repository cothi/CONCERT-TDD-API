import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  vus: 1,
  iterations: 1000,
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

  // 포인트 충전
  const chargeUrl = 'http://localhost:3000/points/charge';
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
    console.error(`Charge failed: ${chargeRes.status} ${chargeRes.body}`);
    errorRate.add(1);
  }

  // 포인트 조회
  const balanceUrl = 'http://localhost:3000/points';
  const balanceHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };
  const balanceRes = http.get(balanceUrl, {
    headers: balanceHeaders,
  });

  check(balanceRes, { 'balance check successful': (r) => r.status === 200 });
  if (balanceRes.status !== 200) {
    console.error(
      `Balance check failed: ${balanceRes.status} ${balanceRes.body}`,
    );
    errorRate.add(1);
  }
}
