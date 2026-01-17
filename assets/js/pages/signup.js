import {
  validateUsername,
  validateCompanyNumber,
  signupBuyer,
  signupSeller,
} from "/utils/api.js";

// 이미지 import
import checkOff from "/assets/images/icon-check-off.svg";
import checkOn from "/assets/images/icon-check-on.svg";
import agreeOff from "/assets/images/check-box.svg";
import agreeOn from "/assets/images/check-fill-box.svg";
import logoHodu from "/assets/images/Logo-hodu.svg";
import iconDownArrow from "/assets/images/icon-down-arrow.svg";

const DROPDOWN_VISIBLE_HEIGHT = 150;
const SCROLLBAR_THUMB_HEIGHT = 90;
const SCROLLBAR_PADDING = 6;
const SCROLLBAR_THUMB_MARGIN = 12;

const tabs = document.querySelectorAll(".tab");
const sellerArea = document.getElementById("sellerArea");

const idInput = document.getElementById("userid");

const checkBtn = document.getElementById("checkId");
const idMsg = document.getElementById("idMsg");
let idOk = false;
let checkingId = false;

const CHECK_OFF = checkOff;
const CHECK_ON = checkOn;

const pwInput = document.getElementById("pw");
const pw2Input = document.getElementById("pw2");
const pwCheck = document.getElementById("pwCheck");
const pw2Check = document.getElementById("pw2Check");
const pwMsg1 = document.getElementById("pwMsg1");
const pwMsg2 = document.getElementById("pwMsg2");

const USERNAME_REGEX = /^[A-Za-z0-9]{1,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*\d).{8,}$/;

const nameInput = document.querySelector("input[name='name']");

const phone1 = document.getElementById("phone1"); // hidden input
const phone1Wrapper = document.getElementById("phone1Wrapper");
const phone1Trigger = document.getElementById("phone1Trigger");
const phone1Value = document.getElementById("phone1Value");
const phone1Dropdown = document.getElementById("phone1Dropdown");

const phone2 = document.getElementById("phone2");
const phone3 = document.getElementById("phone3");
const phoneMsg = document.getElementById("phoneMsg");

const companyInput = document.getElementById("companyNumber");

const companyBtn = document.getElementById("checkCompany");
const companyMsg = document.getElementById("companyMsg");
let companyOk = false;
let checkingCompany = false;

const storeInput = document.getElementById("storeName");
const storeMsg = document.getElementById("storeMsg");

const AGREE_OFF = agreeOff;
const AGREE_ON = agreeOn;

const agree = document.getElementById("agree");
const agreeIcon = document.getElementById("agreeIcon");
const submit = document.getElementById("submitBtn");

// error & success color
const COLOR_ERROR = "#eb5757";
const COLOR_SUCCESS = "#22c55e";

// HTML 이미지 경로 설정 (DOM 로드 후)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.logo img').src = logoHodu;
  document.querySelector('#phone1Trigger .arrow').src = iconDownArrow;
  document.querySelector('#agreeIcon').src = agreeOff;
});

// ========== 커스텀 드롭다운 로직 ==========
function initCustomDropdown() {
  const dropdownItems = phone1Dropdown.querySelectorAll(".dropdown-item");
  const dropdownList = phone1Dropdown.querySelector(".dropdown-list");
  const scrollbarThumb = phone1Dropdown.querySelector(".scrollbar-thumb");

  // 스크롤바 thumb 위치 계산
  function updateScrollbar() {
    const listHeight = dropdownList.scrollHeight;
    const scrollTop = dropdownList.scrollTop;

    const maxScroll = listHeight - DROPDOWN_VISIBLE_HEIGHT;
    const maxThumbTop = DROPDOWN_VISIBLE_HEIGHT - SCROLLBAR_THUMB_HEIGHT - SCROLLBAR_THUMB_MARGIN;
    const thumbTop =
      maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop + SCROLLBAR_PADDING : SCROLLBAR_PADDING;

    scrollbarThumb.style.top = `${thumbTop}px`;
  }

  dropdownList.addEventListener("scroll", updateScrollbar);

  phone1Trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = phone1Dropdown.classList.contains("open");

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
      setTimeout(updateScrollbar, 0);
    }
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.dataset.value;

      phone1.value = value;
      phone1Value.textContent = value;

      dropdownItems.forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");

      closeDropdown();
    });
  });

  document.addEventListener("click", (e) => {
    if (!phone1Wrapper.contains(e.target)) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
    }
  });

  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;

  scrollbarThumb.addEventListener("mousedown", (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = dropdownList.scrollTop;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startY;
    const listHeight = dropdownList.scrollHeight;
    const maxScroll = listHeight - DROPDOWN_VISIBLE_HEIGHT;

    const scrollRatio = deltaY / (DROPDOWN_VISIBLE_HEIGHT - SCROLLBAR_THUMB_HEIGHT - SCROLLBAR_THUMB_MARGIN);
    const newScrollTop = startScrollTop + scrollRatio * maxScroll;

    dropdownList.scrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function openDropdown() {
  phone1Dropdown.classList.add("open");
  phone1Trigger.classList.add("active");
  phone1Trigger.setAttribute("aria-expanded", "true");
}

function closeDropdown() {
  phone1Dropdown.classList.remove("open");
  phone1Trigger.classList.remove("active");
  phone1Trigger.setAttribute("aria-expanded", "false");
}

initCustomDropdown();

// ========== 기존 로직 ==========
function resetSellerForm() {
  companyOk = false;

  companyInput.value = "";
  storeInput.value = "";

  companyMsg.textContent = "";
  storeMsg.textContent = "";

  companyInput.dispatchEvent(new Event("input"));
  storeInput.dispatchEvent(new Event("input"));

  validate();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    if (tab.dataset.type === "seller") {
      sellerArea.style.display = "block";
    } else {
      sellerArea.style.display = "none";
      resetSellerForm();
    }
  });
});

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

document
  .querySelectorAll("input:not([type='hidden']):not([type='checkbox'])")
  .forEach((field) => {
    field.addEventListener("focus", () => {
      const fields = getRequiredFields();
      let index = fields.indexOf(field);

      if (field === phone2 || field === phone3) {
        index = fields.indexOf(nameInput) + 1;
      }

      if (field === companyInput) {
        index = fields.indexOf(phone3) + 1;
      }

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

    if (!["userid", "pw", "pw2", "companyNumber"].includes(field.id)) {
      field.classList.remove("input-error");
    }
  });
});

idInput.addEventListener("input", () => {
  const value = idInput.value;

  idOk = false;

  if (value.length > 20 || !/^[A-Za-z0-9]*$/.test(value)) {
    idMsg.textContent =
      "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.";
    idMsg.style.color = COLOR_ERROR;
    idInput.classList.add("input-error");
    return;
  }

  if (value === "") {
    idMsg.textContent = "";
    idInput.classList.remove("input-error");
    return;
  }
  idMsg.textContent = "";
  idInput.classList.remove("input-error");
});

idInput.addEventListener("blur", () => {
  if (checkingId) return;

  if (
    idInput.value !== "" &&
    !idOk &&
    USERNAME_REGEX.test(idInput.value)
  ) {
    idMsg.textContent = "아이디 중복확인을 해주세요.";
    idMsg.style.color = COLOR_ERROR;
  }
});

checkBtn.addEventListener("mousedown", () => {
  checkingId = true;
});

checkBtn.addEventListener("click", async () => {
  if (!idInput.value) {
    idMsg.textContent = "아이디를 입력해주세요.";
    idMsg.style.color = COLOR_ERROR;
    idInput.classList.add("input-error");
    idOk = false;
    return;
  }

  if (!USERNAME_REGEX.test(idInput.value)) {
    idMsg.textContent =
      "아이디는 영문자와 숫자만 사용하여 20자 이내로 입력해주세요.";
    idMsg.style.color = COLOR_ERROR;
    idInput.classList.add("input-error");
    idOk = false;
    return;
  }

  try {
    await validateUsername(idInput.value);
    idMsg.textContent = "멋진 아이디네요 :)";
    idMsg.style.color = COLOR_SUCCESS;
    idInput.classList.remove("input-error");
    idOk = true;
  } catch (err) {
    idMsg.textContent = err.data?.error || "이미 사용 중인 아이디입니다.";
    idMsg.style.color = COLOR_ERROR;
    idInput.classList.add("input-error");
    idOk = false;
  }
  checkingId = false;
  validate();
});

function setPwCheck(on) {
  if (!pwCheck) return;
  pwCheck.src = on ? CHECK_ON : CHECK_OFF;
  pwCheck.style.display = "inline";
}

function setPw2Check(on) {
  if (!pw2Check) return;
  pw2Check.src = on ? CHECK_ON : CHECK_OFF;
  pw2Check.style.display = "inline";
}

pwInput.addEventListener("input", () => {
  const pw = pwInput.value;
  const pw2 = pw2Input.value;
  const pwValid = PASSWORD_REGEX.test(pw);

  if (pw === "") {
    pwMsg1.textContent = "";
    pwInput.classList.remove("input-error");
    setPwCheck(false);
  } else if (!pwValid) {
    pwMsg1.textContent =
      "8자 이상, 영문 소문자와 숫자를 각각 1개 이상 포함하세요.";
    pwMsg1.style.color = COLOR_ERROR;
    pwInput.classList.add("input-error");
    setPwCheck(false);
  } else {
    pwMsg1.textContent = "";
    pwInput.classList.remove("input-error");
    setPwCheck(true);
  }

  if (pw2 !== "") {
    if (!pwValid) {
      setPw2Check(false);
      pwMsg2.textContent = "올바른 비밀번호를 입력해주세요.";
      pwMsg2.style.color = COLOR_ERROR;
      pw2Input.classList.add("input-error");
    } else if (pw !== pw2) {
      setPw2Check(false);
      pwMsg2.textContent = "비밀번호가 일치하지 않습니다.";
      pwMsg2.style.color = COLOR_ERROR;
      pw2Input.classList.add("input-error");
    } else {
      setPw2Check(true);
      pwMsg2.textContent = "";
      pw2Input.classList.remove("input-error");
    }
  }

  validate();
});

pw2Input.addEventListener("input", () => {
  const pw = pwInput.value;
  const pw2 = pw2Input.value;
  const pwValid = PASSWORD_REGEX.test(pw);

  if (pw2 === "") {
    setPw2Check(false);
    pwMsg2.textContent = "";
    pw2Input.classList.remove("input-error");
    validate();
    return;
  }

  if (!pwValid) {
    setPw2Check(false);
    pwMsg2.textContent = "올바른 비밀번호를 입력해주세요.";
    pwMsg2.style.color = COLOR_ERROR;
    pw2Input.classList.add("input-error");
    validate();
    return;
  }

  if (pw !== pw2) {
    setPw2Check(false);
    pwMsg2.textContent = "비밀번호가 일치하지 않습니다.";
    pwMsg2.style.color = COLOR_ERROR;
    pw2Input.classList.add("input-error");
  } else {
    setPw2Check(true);
    pwMsg2.textContent = "";
    pw2Input.classList.remove("input-error");
  }

  validate();
});

phone2.addEventListener("input", () => {
  if (phone2.value.length === 4) {
    phone3.focus();
  }
});

[phone2, phone3].forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");

    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
  });
});

companyInput.addEventListener("input", () => {
  companyInput.value = companyInput.value.replace(/[^0-9]/g, "");

  if (companyInput.value.length > 10) {
    companyInput.value = companyInput.value.slice(0, 10);
  }

  companyOk = false;

  validate();
});

companyBtn.addEventListener("mousedown", () => {
  checkingCompany = true;
});

companyBtn.addEventListener("click", async () => {
  const number = companyInput.value;

  if (!number) {
    companyMsg.textContent = "사업자등록번호를 입력해주세요.";
    companyMsg.style.color = COLOR_ERROR;
    companyInput.classList.add("input-error");
    companyOk = false;
    return;
  }

  if (number.length !== 10) {
    companyMsg.textContent = "사업자등록번호는 10자리 숫자여야 합니다.";
    companyMsg.style.color = COLOR_ERROR;
    companyInput.classList.add("input-error");
    companyOk = false;
    return;
  }

  try {
    const data = await validateCompanyNumber(number);

    companyMsg.textContent = data.message;
    companyMsg.style.color = COLOR_SUCCESS;
    companyInput.classList.remove("input-error");
    companyOk = true;
  } catch (err) {
    companyMsg.textContent = err.data?.error || "사업자등록번호 확인 실패";
    companyMsg.style.color = COLOR_ERROR;
    companyInput.classList.add("input-error");
    companyOk = false;
  }
  checkingCompany = false;
  validate();
});

companyInput.addEventListener("blur", () => {
  if (checkingCompany) return;
  if (
    companyInput.value.length === 10 &&
    !companyOk
  ) {
    companyMsg.textContent = "사업자등록번호 인증을 해주세요.";
    companyMsg.style.color = COLOR_ERROR;
  }
});

agree.addEventListener("change", validate);

function updateAgreeIcon() {
  agreeIcon.src = agree.checked ? AGREE_ON : AGREE_OFF;
}

agreeIcon.addEventListener("click", () => {
  agree.checked = !agree.checked;
  updateAgreeIcon();
  validate();
});

document.querySelector(".agree label").addEventListener("click", () => {
  setTimeout(() => {
    updateAgreeIcon();
    validate();
  }, 0);
});

updateAgreeIcon();

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

submit.addEventListener("click", async () => {
  const phone = phone1.value + phone2.value + phone3.value;

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
    const data = err.data;

    if (data?.phone_number) {
      const msg = data.phone_number[0];
      phoneMsg.textContent = msg;
      phoneMsg.style.color = COLOR_ERROR;

      phone2.value = "";
      phone3.value = "";
      phone2.classList.add("input-error");
      phone3.classList.add("input-error");

      phone2.dispatchEvent(new Event("input"));
      phone3.dispatchEvent(new Event("input"));

      phone2.focus();
      return;
    }

    if (data?.username) {
      const msg = data.username[0];
      idMsg.textContent = msg;
      idMsg.style.color = COLOR_ERROR;
      idInput.classList.add("input-error");
      idInput.value = "";
      idInput.focus();
      idOk = false;
      return;
    }

    if (data?.password) {
      alert(data.password[0]);
      return;
    }

    if (data?.store_name) {
      const msg = data.store_name[0];
      storeMsg.textContent = msg;
      storeMsg.style.color = COLOR_ERROR;
      storeInput.classList.add("input-error");

      storeInput.value = "";
      storeInput.dispatchEvent(new Event("input"));

      storeInput.focus();
      return;
    }

    if (data?.company_registration_number) {
      const msg = data.company_registration_number[0];
      companyMsg.textContent = msg;
      companyMsg.style.color = COLOR_ERROR;
      companyInput.classList.add("input-error");

      companyInput.value = "";
      companyInput.dispatchEvent(new Event("input"));

      companyInput.focus();
      return;
    }

    alert("회원가입 실패");
  }
});