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

const nameInput = document.querySelector("input[name='name']");
const phone1 = document.getElementById("phone1");
const phone2 = document.getElementById("phone2");
const phone3 = document.getElementById("phone3");

const requiredFields = [idInput, pw, pw2, nameInput, phone2, phone3];

function showRequiredError(input) {
  const msg = input.closest(".field").querySelector(".msg");

  if (msg) {
    msg.textContent = "필수 정보입니다.";
    msg.classList.add("error");
  }
}

requiredFields.forEach((field, index) => {
  field.addEventListener("focus", () => {
    for (let i = 0; i < index; i++) {
      if (!requiredFields[i].value) {
        showRequiredError(requiredFields[i]);
      }
    }
  });
});

requiredFields.forEach((field) => {
  field.addEventListener("input", () => {
    const msg = field.closest(".field")?.querySelector(".msg");

    if (msg && field.value.trim() !== "") {
      msg.textContent = "";
      msg.classList.remove("error");
    }
  });
});

idInput.addEventListener("input", () => {
  const value = idInput.value;

  idOk = false; // 아이디 바뀌면 다시 중복확인 필요

  if (value.length > 20) {
    idMsg.textContent = "아이디는 20자 이내로 입력해주세요.";
    idMsg.style.color = "red";
    return;
  }

  if (!/^[A-Za-z0-9]*$/.test(value)) {
    idMsg.textContent = "아이디는 영문자와 숫자만 사용할 수 있습니다.";
    idMsg.style.color = "red";
    return;
  }

  if (value === "") {
    idMsg.textContent = "";
    return;
  }

  // 형식이 맞으면 메시지 지움 (아직 중복확인은 안 한 상태)
  idMsg.textContent = "";
});

checkBtn.addEventListener("click", async () => {
  if (!idInput.value) {
    idMsg.textContent = "아이디를 입력해주세요.";
    idMsg.style.color = "red";
    idOk = false;
    return;
  }

  if (!USERNAME_REGEX.test(idInput.value)) {
    idMsg.textContent =
      "아이디는 영문자와 숫자만 사용하여 20자 이내로 입력해주세요.";
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
  pwCheck.style.display = pw.value.length >= 8 ? "inline" : "none";
  validate();
});

pw2.addEventListener("input", () => {
  if (pw.value === pw2.value && pw2.value !== "") {
    pw2Check.style.display = "inline";
    pwMsg.textContent = "";
  } else {
    pw2Check.style.display = "none";
    pwMsg.textContent = "비밀번호가 일치하지 않습니다.";
    pwMsg.style.color = "red";
  }
  validate();
});

agree.addEventListener("change", validate);

function validate() {
  const phoneOk = phone2.value.length === 4 && phone3.value.length === 4;
  const nameOk = nameInput.value.trim().length > 0;

  const allFilled =
    idOk &&
    pw.value.length >= 8 &&
    pw2.value === pw.value &&
    nameOk &&
    phoneOk &&
    agree.checked;

  if (allFilled) {
    submit.classList.add("active");
    submit.disabled = false;
  } else {
    submit.classList.remove("active");
    submit.disabled = true;
  }
}

[phone2, phone3].forEach((input) => {
  input.addEventListener("input", () => {
    // 숫자가 아닌 것 제거
    input.value = input.value.replace(/[^0-9]/g, "");

    // 4자리까지만 유지
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
  });
});

// 폰 번호 네 자리 입력 시 다음 칸으로 자동 넘어가는 기능
phone2.addEventListener("input", () => {
  if (phone2.value.length === 4) {
    phone3.focus();
  }
});

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
