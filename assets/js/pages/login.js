import { login } from "/utils/api.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");
const submitBtn = document.getElementById("submitBtn");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 통신 중일 때 중복 클릭 차단
    if (submitBtn.disabled) return;

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // 초기화
    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    if (!username || !password) {
      showError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      submitBtn.disabled = true; // 서버 요청 시작 시 버튼 잠금
      const data = await login(username, password);

      if (data) {
        alert("환영합니다!");
        window.location.href = "/";
      }
    } catch (error) {
      showError(
        error.data?.error || "아이디 또는 비밀번호가 일치하지 않습니다."
      );
    } finally {
      submitBtn.disabled = false; // 성공하든 실패하든 버튼 다시 활성화
    }
  });
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
