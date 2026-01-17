# HODU 오픈마켓

바닐라 JavaScript로 구현한 오픈마켓 웹 애플리케이션입니다. 사용자는 상품을 검색하고 장바구니에 담아 주문할 수 있으며, 판매자는 상품을 등록하고 관리할 수 있습니다.

## 주요 기능

### 사용자 기능
- 회원가입 / 로그인 (JWT 인증)
- 상품 검색 및 조회
- 장바구니 관리 (추가, 수정, 삭제)
- 주문하기 (바로 구매 / 장바구니 구매)
- 다음 우편번호 API 연동

### 판매자 기능
- 상품 등록 / 수정 / 삭제
- 판매 상품 목록 조회
- 상품 이미지 업로드

### 기타 기능
- 메인 배너 자동 슬라이더
- 상품 검색 결과 표시
- 404 에러 페이지

## 기술 스택

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite 5.0
- **API**: RESTful API
- **Authentication**: JWT Bearer Token

## 프로젝트 구조

```
open-market/
├── assets/
│   ├── css/              # 스타일시트
│   │   ├── common.css
│   │   ├── reset.css
│   │   └── pages/        # 페이지별 스타일
│   ├── js/               # JavaScript 파일
│   │   ├── common.js     # 공통 유틸리티
│   │   └── pages/        # 페이지별 로직
│   └── images/           # 이미지 리소스
├── components/           # 재사용 가능한 컴포넌트
│   ├── Modal.js
│   ├── Header.js
│   ├── Footer.js
│   └── cart/
├── pages/                # HTML 페이지
│   ├── login/
│   ├── signup/
│   ├── cart/
│   ├── order/
│   ├── seller/
│   └── not-found/
├── utils/
│   ├── api.js            # API 통신
│   └── error.js          # 에러 처리
├── index.html            # 메인 페이지
└── package.json
```

## 설치 및 실행

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 코드 품질 개선 사항

### 보안
- **XSS 방어**: `innerHTML` 대신 `createElement`와 `textContent`를 사용하여 안전한 DOM 조작
- **JWT 인증**: Bearer Token 방식으로 API 인증 구현

### 가독성
- **Magic Number 제거**: 하드코딩된 숫자를 의미있는 상수로 추출
  - 예: `BANNER_AUTO_PLAY_INTERVAL`, `DROPDOWN_VISIBLE_HEIGHT`

### 일관성
- **변수명 통일**: DOM 요소는 `$` prefix 사용 (예: `$submitBtn`, `$cartList`)
- **코드 스타일**: 2-space 들여쓰기, double quotes 사용

### 접근성
- **Semantic HTML**: `<main>`, `<article>`, `<section>`, `<figure>` 등 의미론적 태그 사용
- **ARIA 속성**: 스크린 리더를 위한 `.sr-only` 클래스 활용

### 버그 수정
- 장바구니 주문 시 올바른 API 함수 호출 (`createCartOrder`)
- 에러 핸들링 변수명 통일

## 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인 | `/` | 상품 목록 및 배너 |
| 로그인 | `/pages/login/` | 사용자 로그인 |
| 회원가입 | `/pages/signup/` | 신규 회원가입 |
| 상품 상세 | `/product/:id` | 상품 상세 정보 |
| 장바구니 | `/pages/cart/` | 장바구니 목록 |
| 주문/결제 | `/pages/order/` | 주문서 작성 |
| 판매자 센터 | `/pages/seller/` | 상품 관리 |
| 상품 등록 | `/pages/seller/upload/` | 상품 등록/수정 |

## 향후 개선 사항

- 주문 내역 조회 기능
- 주문 취소 기능
- 반응형 디자인 개선
- TypeScript 마이그레이션
- 컴포넌트 단위 테스트 추가

## 라이선스

이 프로젝트는 포트폴리오 목적으로 제작되었습니다.
