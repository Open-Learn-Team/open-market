// assets/js/pages/login.js

// 1. 함수 이름을 api.js에 정의된 'login'으로 가져옵니다.
import { login, getUserType } from "/utils/api.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // 에러 메시지 초기화
    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    // 유효성 검사
    if (!username || !password) {
      showError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 2. api.js의 login 함수 호출
      // (이 함수 내부에서 이미 localStorage에 토큰과 유저정보를 저장합니다)
      const data = await login(username, password);

      // 3. 로그인 성공 시 처리
      if (data) {
        alert("환영합니다!");

        // api.js의 getUserType 함수를 사용하여 경로 판단
        const userType = getUserType();

        let targetPath = "/"; // 기본 홈

        if (userType === "BUYER") {
          targetPath = "/pages/buyer_main/index.html";
        } else if (userType === "SELLER") {
          targetPath = "/pages/seller_main/index.html";
        }

        // 페이지 이동
        window.location.href = targetPath;
      }
    } catch (error) {
      // 4. 에러 발생 시 처리
      showError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  });
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
