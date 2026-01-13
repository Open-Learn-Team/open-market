import { validateUsername } from "/utils/api.js";
import { signupBuyer, signupSeller } from "/utils/api.js";

const tabs = document.querySelectorAll(".tab");
const sellerArea = document.getElementById("sellerArea");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // active 클래스 이동
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // 판매자 / 구매자 전환
    if (tab.dataset.type === "seller") {
      sellerArea.style.display = "block";
    } else {
      sellerArea.style.display = "none";
    }
  });
});

const checkBtn = document.getElementById("checkId");
const idInput = document.getElementById("userid");
const idMsg = document.getElementById("idMsg");

const pw = document.getElementById("pw");
const pw2 = document.getElementById("pw2");
const pwCheck = document.getElementById("pwCheck");
const pw2Check = document.getElementById("pw2Check");
const pwMsg = document.getElementById("pwMsg");

const agree = document.getElementById("agree");
const submit = document.getElementById("submitBtn");

let idOk = false;

checkBtn.addEventListener("click", async () => {
  console.log(checkBtn);
  if (!idInput.value) {
    idMsg.textContent = "아이디를 입력해주세요.";
    idMsg.style.color = "red";
    idOk = false;
    return;
  }

  try {
    await validateUsername(idInput.value);
    idMsg.textContent = "멋진 아이디네요 :)";
    idMsg.style.color = "green";
    idOk = true;
  } catch (err) {
    idMsg.textContent = err.data?.error || "이미 사용 중인 아이디입니다.";
    idMsg.style.color = "red";
    idOk = false;
  }

  validate();
});

pw.addEventListener("input", () => {
  pwCheck.style.display = pw.value.length >= 6 ? "inline" : "none";
  validate();
});

pw2.addEventListener("input", () => {
  if (pw.value === pw2.value && pw2.value !== "") {
    pw2Check.style.display = "inline";
    pwMsg.textContent = "";
  } else {
    pw2Check.style.display = "none";
    pwMsg.textContent = "비밀번호가 일치하지 않습니다.";
  }
  validate();
});

agree.addEventListener("change", validate);

function validate() {
  if (
    idOk &&
    pw.value &&
    pw2.value &&
    pw.value === pw2.value &&
    agree.checked
  ) {
    submit.classList.add("active");
    submit.disabled = false;
  } else {
    submit.classList.remove("active");
    submit.disabled = true;
  }
}

submit.addEventListener("click", async () => {
  const phone = phone1.value + phone2.value + phone3.value;

  const userData = {
    username: idInput.value,
    password: pw.value,
    password2: pw2.value,
    phone_number: phone, // 나중에 입력값으로
    name: document.querySelector("input[name='name']").value,
  };

  try {
    const isSeller =
      document.querySelector(".tab.active").dataset.type === "seller";

    if (isSeller) {
      userData.company_registration_number =
        document.querySelector("#sellerArea input").value;
      userData.store_name =
        document.querySelectorAll("#sellerArea input")[1].value;

      await signupSeller(userData);
    } else {
      await signupBuyer(userData);
    }

    alert("회원가입 성공!");
    window.location.href = "/pages/login/";
  } catch (err) {
    alert(err.data?.error || "회원가입 실패");
  }
});
