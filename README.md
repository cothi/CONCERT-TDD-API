
# 대기열을 이용한 티켓팅 프로젝트

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [아키텍처](#2-아키텍처)
3. [주요 정책](#3-주요-정책)
4. [API 명세](#4-api-명세)
5. [ERD](#5-erd)
6. [시퀀스 다이어그램](#6-시퀀스-다이어그램)
7. [마일스톤](#7-마일스톤)
8. [기술 스택](#8-기술-스택)

## 1. 프로젝트 개요

본 프로젝트는 동시성 문제를 고려한 대기열 시스템을 활용하여 콘서트별 티켓팅 기능을 구현한 API 서비스입니다. 주요 기능으로는 사용자 인증, 콘서트 예약, 포인트 관리, 그리고 결제 처리 등이 있습니다. 이 시스템은 공정한 티켓 구매 기회 제공과 서버 부하 분산을 목표로 합니다.

## 2. 아키텍처

본 프로젝트는 레이어드 아키텍처를 채택하여 다음과 같은 이점을 추구합니다:

1. 계층 간 영향 최소화: 각 계층이 독립적으로 작동하여 유지보수와 확장성 향상
2. 서비스 간 간섭 최소화: 각 기능이 독립적으로 동작하여 전체 시스템의 안정성 제고

## 3. 주요 정책

1. 콘서트별 독립 대기열: 각 콘서트마다 독립적인 대기열을 운영합니다.
2. 예약 시간 할당: 대기열의 1~5번째 사용자에게 5분간의 예약 시간을 부여합니다.
3. 결제 시간 제한: 예약된 티켓은 예약 시점부터 5분 이내에 결제를 완료해야 합니다.
4. 인증 요구: 인증 API를 제외한 모든 API는 인증된 사용자만 접근 가능하며, `Authorization` 헤더에 Bearer 토큰이 필요합니다.

## 4. API 명세
자세한 API는 [포스트 문서](https://documenter.getpostman.com/view/18574015/2sA3dxECMf)에서 확인해주세요.


### 4.1. Authentication

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/auth/register` | 새 계정 생성 |
| `POST` | `/auth/login` | 기존 계정 로그인 |
| `POST` | `/auth/refresh` | 액세스 토큰 갱신 |

<details>
<summary>상세 정보</summary>

#### Register
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `201 Created`
  ```json
  {
    "userId": "uuid",
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
  ```

#### Login
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `200 OK` (Register와 동일한 형식)

#### Refresh
- **Headers**: `Authorization: Bearer <refresh_token>`
- **Response**: `200 OK`
  ```json
  {
    "accessToken": "eyJhbG..."
  }
  ```
</details>

### 4.2. Concerts

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET`  | `/concerts/{concertId}/queue-entry` | 콘서트 대기열 입장 |
| `GET`  | `/concerts` | 콘서트 및 대기열 목록 조회 |

<details>
<summary>상세 정보</summary>

#### Queue Entry
- **Response**: `201 Created`
  ```json
  {
    "userId": "uuid",
    "queuePosition": 42
  }
  ```

#### List Concerts
- **Response**: `200 OK`
  ```json
  {
    "queueEntries": [
      {
        "concertId": "uuid",
        "name": "Summer Rock Fest",
        "queuePosition": 42,
        "estimatedWaitTime": "10 minutes"
      }
    ]
  }
  ```
</details>

### 4.3. Points

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET`  | `/points` | 포인트 잔액 조회 |
| `PATCH`| `/points/charge` | 포인트 충전 |

<details>
<summary>상세 정보</summary>

#### Check Balance
- **Response**: `200 OK`
  ```json
  {
    "points": 5000
  }
  ```

#### Charge Points
- **Body**: `{ "amount": 10000 }`
- **Response**: `200 OK`
  ```json
  {
    "points": 15000,
    "chargeAmount": 10000
  }
  ```
</details>

### 4.4. Reservations

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET`  | `/reservation/available-dates` | 예약 가능 날짜 조회 |
| `GET`  | `/reservation/{concertId}/seats` | 좌석 정보 조회 |
| `POST` | `/reservation/seat` | 좌석 예약 |
| `GET`  | `/reservation` | 예약 목록 조회 |

<details>
<summary>상세 정보</summary>

#### Available Dates
- **Response**: `200 OK`
  ```json
  {
    "availableDates": [
      {
        "date": "2024-07-15",
        "concertId": "uuid",
        "name": "Summer Rock Fest"
      }
    ]
  }
  ```

#### Seat Information
- **Response**: `200 OK`
  ```json
  {
    "seats": [
      {
        "id": "uuid",
        "number": "A1",
        "status": "AVAILABLE",
        "price": 50000
      }
    ],
    "pagination": { ... },
    "concertInfo": { ... }
  }
  ```

#### Reserve Seat
- **Body**: `{ "concertId": "uuid", "seatIds": ["uuid1", "uuid2"] }`
- **Response**: `201 Created`
  ```json
  {
    "reservations": [
      {
        "id": "uuid",
        "seatId": "uuid",
        "status": "PENDING",
        "expiresAt": "2024-07-15T19:05:00Z"
      }
    ]
  }
  ```

#### List Reservations
- **Response**: `200 OK`
  ```json
  {
    "reservations": [
      {
        "id": "uuid",
        "concertName": "Summer Rock Fest",
        "seatNumber": "A1",
        "status": "CONFIRMED",
        "reservedAt": "2024-07-10T15:00:00Z"
      }
    ],
    "pagination": { ... }
  }
  ```
</details>

### 4.5. Payment

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/payment` | 예약 결제 처리 |

<details>
<summary>상세 정보</summary>

#### Process Payment
- **Body**: `{ "reservationIds": ["uuid1", "uuid2"] }`
- **Response**: `200 OK`
  ```json
  {
    "paymentId": "uuid",
    "reservationIds": ["uuid1", "uuid2"],
    "totalAmount": 100000,
    "status": "COMPLETED"
  }
  ```
</details>

### 4.6. Error Responses

| Status | Description |
|:------:|-------------|
| `400`  | Bad Request - 잘못된 요청 |
| `401`  | Unauthorized - 인증 실패 |
| `403`  | Forbidden - 권한 없음 |
| `404`  | Not Found - 리소스 없음 |
| `409`  | Conflict - 리소스 충돌 |
| `402`  | Payment Required - 결제 필요 |
| `410`  | Gone - 리소스 만료 |

## 5. ERD

프로젝트의 데이터베이스 구조는 [ERD 문서](https://github.com/cothi/sail/wiki/ERD)에서 확인할 수 있습니다. 이 문서는 시스템의 데이터 모델과 관계를 시각적으로 표현합니다.

## 6. 시퀀스 다이어그램

시스템의 동작 흐름을 이해하기 위한 [시퀀스 다이어그램](https://github.com/cothi/sail/wiki/%EC%8B%9C%ED%80%80%EC%8A%A4-%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8)을 제공합니다. 이 다이어그램은 주요 프로세스의 단계별 흐름을 보여줍니다.

## 7. 마일스톤

프로젝트의 개발 진행 상황과 향후 계획은 [마일스톤](https://github.com/users/cothi/projects/4)에서 확인할 수 있습니다. 이를 통해 프로젝트의 진행 상황과 주요 이정표를 파악할 수 있습니다.

## 8. 기술 스택

- 백엔드: NestJS, TypeScript
- 데이터베이스: PostgreSQL, Prisma ORM
- 인증: JWT (JSON Web Tokens)
- 테스팅: Jest
- 기타: Docker (컨테이너화)

본 프로젝트는 효율적인 티켓팅 시스템 구현을 목표로 하며, 사용자 경험 향상과 시스템의 안정성을 최우선으로 고려하고 있습니다.