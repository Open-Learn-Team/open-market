document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  // 초기화
  errorMessage.style.display = "none";
  errorMessage.textContent = "";

  // 계정 데이터 (이미지 기준)
  const validUsers = [
    { id: "buyer1", pw: "weniv1234", type: "BUYER" },
    { id: "buyer2", pw: "weniv1234", type: "BUYER" },
    { id: "buyer3", pw: "weniv1234", type: "BUYER" },
    { id: "seller1", pw: "weniv1234", type: "SELLER" },
    { id: "seller2", pw: "weniv1234", type: "SELLER" },
    { id: "seller3", pw: "weniv1234", type: "SELLER" },
  ];

  // 검증 로직
  if (!username) {
    errorMessage.textContent = "아이디를 입력해 주세요.";
    errorMessage.style.display = "block";
  } else if (!password) {
    errorMessage.textContent = "비밀번호를 입력해 주세요.";
    errorMessage.style.display = "block";
  } else {
    const user = validUsers.find((u) => u.id === username && u.pw === password);

    if (user) {
      alert(`${username}님(${user.type}), 환영합니다!`);
      // 타입에 따른 페이지 이동 (폴더가 생성되어 있어야 합니다)
      if (user.type === "BUYER") {
        window.location.href = "/pages/buyer_main/index.html";
      } else {
        window.location.href = "/pages/seller_main/index.html";
      }
    } else {
      errorMessage.textContent = "아이디 또는 비밀번호가 일치하지 않습니다.";
      errorMessage.style.display = "block";
    }
  }
});
