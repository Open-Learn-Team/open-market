import { initCommon } from "/assets/js/common.js";
import { createDirectOrder, createCartOrder, deleteCartItem } from "/utils/api.js";
import { showAlertModal } from "/components/Modal.js";
import { getApiErrorMessage } from "/utils/error.js";
import checkBox from "/assets/images/check-box.svg";
import checkFillBox from "/assets/images/check-fill-box.svg";

initCommon();

// ─────────────────────────────
// DOM 요소
// ─────────────────────────────
const orderItemList = document.getElementById("orderItemList");
const orderTotalPrice = document.getElementById("orderTotalPrice");
const productTotal = document.getElementById("productTotal");
const discountTotal = document.getElementById("discountTotal");
const shippingTotal = document.getElementById("shippingTotal");
const finalTotal = document.getElementById("finalTotal");
const agreeCheckbox = document.getElementById("agreeCheckbox");
const agreeIcon = document.getElementById("agreeIcon"); 
const submitOrderBtn = document.getElementById("submitOrderBtn");
const searchZipBtn = document.getElementById("searchZipBtn");


// ─────────────────────────────
// 주문 데이터 로드
// ─────────────────────────────
const orderData = JSON.parse(localStorage.getItem("orderData"));

if (!orderData || !orderData.items || orderData.items.length === 0) {
  showAlertModal("주문할 상품이 없습니다.");
  window.location.href = "/";
}

const formatPrice = (price) => Number(price).toLocaleString("ko-KR");

// ─────────────────────────────
// 상품 목록 렌더링
// ─────────────────────────────
function renderOrderItems() {
  orderItemList.innerHTML = "";

  let totalProductPrice = 0;
  let totalShippingFee = 0;

  orderData.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalProductPrice += itemTotal;

    const shippingFee = item.shipping_method === "PARCEL" ? item.shipping_fee : 0;
    totalShippingFee += shippingFee;

    const li = document.createElement("li");
    li.className = "order-item";
    li.innerHTML = `
      <div class="item-info">
        <img src="${item.image}" alt="${item.name}" class="item-image" />
        <div class="item-detail">
          <span class="item-seller">${item.store_name || "판매자"}</span>
          <span class="item-name">${item.name}</span>
          <span class="item-qty">수량 : ${item.quantity}개</span>
        </div>
      </div>
      <span class="item-discount">-</span>
      <span class="item-shipping">${shippingFee === 0 ? "무료배송" : formatPrice(shippingFee) + "원"}</span>
      <span class="item-price">${formatPrice(itemTotal)}원</span>
    `;
    orderItemList.appendChild(li);
  });

  const finalPrice = totalProductPrice + totalShippingFee;

  orderTotalPrice.textContent = formatPrice(finalPrice) + "원";
  productTotal.textContent = formatPrice(totalProductPrice);
  discountTotal.textContent = "0";
  shippingTotal.textContent = formatPrice(totalShippingFee);
  finalTotal.textContent = formatPrice(finalPrice) + "원";
}

// ─────────────────────────────
// 우편번호 검색 (다음 API)
// ─────────────────────────────
searchZipBtn.addEventListener("click", () => {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById("zipCode").value = data.zonecode;
      document.getElementById("address1").value = data.roadAddress || data.jibunAddress;
      document.getElementById("address2").focus();
    },
  }).open();
});

// ─────────────────────────────
// 동의 체크박스 → 버튼 활성화
// ─────────────────────────────

agreeIcon.addEventListener("click", () => {
  agreeCheckbox.checked = !agreeCheckbox.checked;
  
  if (agreeCheckbox.checked) {
    agreeIcon.src = checkFillBox;
    submitOrderBtn.disabled = false;
    submitOrderBtn.classList.add("active");
  } else {
    agreeIcon.src = checkBox;
    submitOrderBtn.disabled = true;
    submitOrderBtn.classList.remove("active");
  }
});

// 라벨 클릭해도 토글되게
document.querySelector(".agree-checkbox label").addEventListener("click", () => {
  agreeIcon.click();
});

// ─────────────────────────────
// 결제수단 값 변환 (API 형식으로)
// ─────────────────────────────
function getPaymentMethod() {
  const selected = document.querySelector('input[name="paymentMethod"]:checked');
  if (!selected) return "card";  // ✅ 소문자!
  
  const value = selected.value;
  
  // 모든 값을 소문자로 변환해서 시도
  const methodMap = {
    "신용/체크카드": "card",
    "무통장 입금": "deposit",
    "휴대폰 결제": "phone",
    "네이버페이": "naverpay",
    "카카오페이": "kakaopay",
    "CARD": "card",
    "DEPOSIT": "deposit",
    "PHONE_PAYMENT": "phone",
    "NAVERPAY": "naverpay",
    "KAKAOPAY": "kakaopay",
    "card": "card",
    "deposit": "deposit",
    "phone": "phone",
    "naverpay": "naverpay",
    "kakaopay": "kakaopay",
  };
  
  return methodMap[value] || "card";
}

// ─────────────────────────────
// 총 금액 계산
// ─────────────────────────────
function calculateTotalPrice() {
  let total = 0;
  orderData.items.forEach((item) => {
    total += item.price * item.quantity;
    if (item.shipping_method === "PARCEL") {
      total += item.shipping_fee || 0;
    }
  });
  return total;
}

// ─────────────────────────────
// 폼 데이터 수집
// ─────────────────────────────
function getFormData() {
  const receiverPhone = [
    document.getElementById("receiverPhone1").value,
    document.getElementById("receiverPhone2").value,
    document.getElementById("receiverPhone3").value,
  ].join("");

  return {
    receiver: document.getElementById("receiverName").value,
    receiver_phone_number: receiverPhone,
    address: document.getElementById("address1").value + " " + document.getElementById("address2").value,
    address_message: document.getElementById("deliveryMessage").value || "배송 전 연락 바랍니다",
    payment_method: getPaymentMethod(),  // ✅ 변환 함수 사용
  };
}

// ─────────────────────────────
// 폼 유효성 검사
// ─────────────────────────────
function validateForm() {
  const requiredFields = [
    { id: "buyerName", name: "주문자 이름" },
    { id: "buyerPhone1", name: "주문자 휴대폰" },
    { id: "buyerPhone2", name: "주문자 휴대폰" },
    { id: "buyerPhone3", name: "주문자 휴대폰" },
    { id: "receiverName", name: "수령인" },
    { id: "receiverPhone1", name: "수령인 휴대폰" },
    { id: "receiverPhone2", name: "수령인 휴대폰" },
    { id: "receiverPhone3", name: "수령인 휴대폰" },
    { id: "zipCode", name: "우편번호" },
    { id: "address1", name: "배송주소" },
  ];

  for (const field of requiredFields) {
    const el = document.getElementById(field.id);
    if (!el.value.trim()) {
      showAlertModal(`${field.name}을(를) 입력해주세요.`);
      el.focus();
      return false;
    }
  }

  return true;
}

// ─────────────────────────────
// 주문 제출
// ─────────────────────────────
submitOrderBtn.addEventListener("click", async () => {
  if (!validateForm()) return;

  const formData = getFormData();
  const orderType = orderData.orderType;

  console.log("orderType:", orderType);
  console.log("formData:", formData);
  console.log("items:", orderData.items);

  try {
    if (orderType === "direct") {
      // 바로 구매
      const item = orderData.items[0];
      const itemShipping = item.shipping_fee || 0;  // ✅ 항상 배송비 포함!
      
      const requestData = {
        product: item.product_id || item.id,
        quantity: item.quantity,
        total_price: (item.price * item.quantity) + itemShipping,  // ✅ 배송비 포함
        ...formData,
      };
      
      console.log("📦 주문 요청 데이터:", requestData);
      
      await createDirectOrder(requestData);
    } else {
      // 장바구니 구매
      for (const item of orderData.items) {
        const itemShipping = item.shipping_fee || 0;  // ✅ 항상 배송비 포함!
        
        const requestData = {
          product: item.product_id || item.id,
          quantity: item.quantity,
          total_price: (item.price * item.quantity) + itemShipping,  // ✅ 배송비 포함
          ...formData,
        };
        
        console.log("📦 주문 요청 데이터:", requestData);
        
        await createDirectOrder(requestData);

        if (item.cartItemId) {
          await deleteCartItem(item.cartItemId);
        }
      }
    }

    localStorage.removeItem("orderData");
    await showAlertModal("주문이 완료되었습니다!");
    window.location.href = "/";
  } catch (error) {
    console.error("주문 실패:", error);
    console.error("에러 상세:", error.data);
    showAlertModal(getApiErrorMessage(error, "주문에 실패했습니다. 다시 시도해주세요."));
  }
});
// ─────────────────────────────
// 초기화
// ─────────────────────────────
renderOrderItems();