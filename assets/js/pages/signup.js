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

checkBtn.addEventListener("click", () => {
  if (idInput.value === "jejucoing") {
    idMsg.textContent = "이미 사용 중인 아이디입니다.";
    idMsg.style.color = "red";
    idOk = false;
  } else {
    idMsg.textContent = "멋진 아이디네요 :)";
    idMsg.style.color = "green";
    idOk = true;
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
