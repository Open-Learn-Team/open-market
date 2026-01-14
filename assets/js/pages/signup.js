import { validateUsername } from "/utils/api.js";
import { signupBuyer, signupSeller } from "/utils/api.js";
import { validateCompanyNumber } from "/utils/api.js";

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

const idInput = document.getElementById("userid");

const checkBtn = document.getElementById("checkId");
const idMsg = document.getElementById("idMsg");
let idOk = false;

const pwInput = document.getElementById("pw");
const pw2Input = document.getElementById("pw2");
const pwCheck = document.getElementById("pwCheck");
const pw2Check = document.getElementById("pw2Check");
const pwMsg1 = document.getElementById("pwMsg1");
const pwMsg2 = document.getElementById("pwMsg2");

const USERNAME_REGEX = /^[A-Za-z0-9]{1,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*\d).{8,}$/;

const nameInput = document.querySelector("input[name='name']");

const phone1 = document.getElementById("phone1");
const phone2 = document.getElementById("phone2");
const phone3 = document.getElementById("phone3");
const phoneMsg = document.getElementById("phoneMsg");

const companyInput = document.getElementById("companyNumber");

const companyBtn = document.getElementById("checkCompany");
const companyMsg = document.getElementById("companyMsg");
let companyOk = false;

const storeInput = document.getElementById("storeName");
const storeMsg = document.getElementById("storeMsg");

const agree = document.getElementById("agree");
const submit = document.getElementById("submitBtn");

function getRequiredFields() {
  const base = [idInput, pwInput, pw2Input, nameInput, phone2, phone3];

  const isSeller =
    document.querySelector(".tab.active").dataset.type === "seller";

  if (isSeller) {
    base.push(companyInput, storeInput);
  }

  return base;
}

function showRequiredError(input) {
  const msg = input.closest(".field").querySelector(".msg");

  if (msg) {
    msg.textContent = "필수 정보입니다.";
    msg.classList.add("error");
  }
}

document.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("focus", () => {
    const fields = getRequiredFields();
    const index = fields.indexOf(field);

    if (index === -1) return;

    for (let i = 0; i < index; i++) {
      if (!fields[i].value) {
        showRequiredError(fields[i]);
      }
    }
  });
});

document.querySelectorAll("input").forEach((field) => {
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

  if (value.length > 20 || !/^[A-Za-z0-9]*$/.test(value)) {
    idMsg.textContent =
      "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.";
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

pwInput.addEventListener("input", () => {
  const value = pwInput.value;

  if (value === "") {
    pwMsg1.textContent = "";
    pwCheck.style.display = "none";
    validate();
    return;
  }

  if (!PASSWORD_REGEX.test(value)) {
    pwMsg1.textContent =
      "8자 이상, 영문 소문자와 숫자를 각각 1개 이상 포함하세요.";
    pwMsg1.style.color = "red";
    pwCheck.style.display = "none";
  } else {
    pwMsg1.textContent = "";
    pwCheck.style.display = "inline";
  }

  validate();
});

pw2Input.addEventListener("input", () => {
  if (pwInput.value === pw2Input.value && pw2Input.value !== "") {
    pw2Check.style.display = "inline";
    pwMsg2.textContent = "";
  } else {
    pw2Check.style.display = "none";
    pwMsg2.textContent = "비밀번호가 일치하지 않습니다.";
    pwMsg2.style.color = "red";
  }
  validate();
});

agree.addEventListener("change", validate);

function validate() {
  const phoneOk = phone2.value.length === 4 && phone3.value.length === 4;
  const nameOk = nameInput.value.trim().length > 0;

  const isSeller =
    document.querySelector(".tab.active").dataset.type === "seller";

  let sellerOk = true;
  if (isSeller) {
    sellerOk =
      companyOk &&
      companyInput.value.trim() !== "" &&
      storeInput.value.trim() !== "";
  }

  const allFilled =
    idOk &&
    PASSWORD_REGEX.test(pwInput.value) &&
    pw2Input.value === pwInput.value &&
    nameOk &&
    phoneOk &&
    agree.checked &&
    sellerOk;

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

// 사업자등록번호는 10자리 숫자만
companyInput.addEventListener("input", () => {
  // 숫자만 남기기
  companyInput.value = companyInput.value.replace(/[^0-9]/g, "");

  // 10자리까지만
  if (companyInput.value.length > 10) {
    companyInput.value = companyInput.value.slice(0, 10);
  }
});

companyBtn.addEventListener("click", async () => {
  const number = companyInput.value;

  if (!number) {
    companyMsg.textContent = "사업자등록번호를 입력해주세요.";
    companyMsg.style.color = "red";
    companyOk = false;
    return;
  }

  if (number.length !== 10) {
    companyMsg.textContent = "사업자등록번호는 10자리 숫자여야 합니다.";
    companyMsg.style.color = "red";
    companyOk = false;
    return;
  }

  try {
    const data = await validateCompanyNumber(number);

    // 성공 (200)
    companyMsg.textContent = data.message; // "사용 가능한 사업자등록번호입니다."
    companyMsg.style.color = "green";
    companyOk = true;
  } catch (err) {
    // 실패 (400, 409)
    companyMsg.textContent = err.data?.error || "사업자등록번호 확인 실패";
    companyMsg.style.color = "red";
    companyOk = false;
  }

  validate();
});

submit.addEventListener("click", async () => {
  const phone = phone1.value + phone2.value + phone3.value;
  console.log("Sending phone:", phone, phone.length);

  const userData = {
    username: idInput.value,
    password: pwInput.value,
    phone_number: phone,
    name: document.querySelector("input[name='name']").value,
  };

  try {
    const isSeller =
      document.querySelector(".tab.active").dataset.type === "seller";

    if (isSeller) {
      userData.company_registration_number = companyInput.value;
      userData.store_name = storeInput.value;

      await signupSeller(userData);
    } else {
      await signupBuyer(userData);
    }

    alert("회원가입 성공!");
    window.location.href = "/pages/login/";
  } catch (err) {
    console.log("API error data:", err.data);

    const data = err.data;

    // 전화번호 에러
    if (data?.phone_number) {
      const msg = data.phone_number[0];
      phoneMsg.textContent = msg;
      phoneMsg.style.color = "red";

      phone2.value = "";
      phone3.value = "";

      // input 이벤트 강제 발생
      phone2.dispatchEvent(new Event("input"));
      phone3.dispatchEvent(new Event("input"));

      phone2.focus();
      return;
    }

    // 아이디 에러
    if (data?.username) {
      const msg = data.username[0];
      idMsg.textContent = msg;
      idMsg.style.color = "red";
      phone2.value = "";
      phone3.value = "";
      idInput.focus();
      idOk = false;
      return;
    }

    // 비밀번호 에러
    if (data?.password) {
      alert(data.password[0]);
      return;
    }

    // 스토어 이름 중복
    if (data?.store_name) {
      const msg = data.store_name[0];
      storeMsg.textContent = msg;
      storeMsg.style.color = "red";

      storeInput.value = "";
      storeInput.dispatchEvent(new Event("input"));

      storeInput.focus();
      return;
    }

    // 사업자 번호 중복
    if (data?.company_registration_number) {
      const msg = data.company_registration_number[0];
      companyMsg.textContent = msg;
      companyMsg.style.color = "red";

      companyInput.value = "";
      companyInput.dispatchEvent(new Event("input"));

      companyInput.focus();
      return;
    }

    // 그 외
    alert("회원가입 실패");
  }
});
