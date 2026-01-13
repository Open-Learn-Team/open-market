document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // 폼 제출 시 새로고침 방지

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  // 1. 에러 초기화 (이전 메시지 지우기)
  errorMessage.style.display = "none";
  errorMessage.textContent = "";

  // 2. 상황별 조건 검사
  if (!username) {
    // [조건 1] 아이디가 비어있을 때 (아이디/비번 둘 다 없거나 비번만 있을 때 포함)
    errorMessage.textContent = "아이디를 입력해 주세요.";
    errorMessage.style.display = "block";
  } else if (!password) {
    // [조건 2] 아이디는 입력했는데 비밀번호가 비어있을 때
    errorMessage.textContent = "비밀번호를 입력해 주세요.";
    errorMessage.style.display = "block";
  } else {
    // [조건 3] 둘 다 입력은 했으나 정보가 일치하지 않을 때
    // 테스트용 아이디: paul-lab / 비밀번호: 1234
    const validID = "paul-lab";
    const validPW = "1234";

    if (username === validID && password === validPW) {
      alert("로그인 성공!");
      // 실제 이동 시: window.location.href = "main.html";
    } else {
      errorMessage.textContent = "아이디 또는 비밀번호가 일치하지 않습니다.";
      errorMessage.style.display = "block";
    }
  }
});
