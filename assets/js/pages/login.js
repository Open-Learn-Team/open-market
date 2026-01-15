// assets/js/pages/login.js

import { login } from "/utils/api.js";

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
      const data = await login(username, password);

      if (data) {
        alert("환영합니다!");
        window.location.href = "/";
      }
    } catch (error) {
      showError(
        error.data?.error || "아이디 또는 비밀번호가 일치하지 않습니다."
      );
    }
  });
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}