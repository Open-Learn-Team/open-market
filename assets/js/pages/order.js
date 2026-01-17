import { initCommon, formatPrice } from "/assets/js/common.js";
import { createDirectOrder, createCartOrder, deleteCartItem } from "/utils/api.js";
import { showAlertModal } from "/components/Modal.js";
import { getApiErrorMessage } from "/utils/error.js";
import checkBox from "/assets/images/check-box.svg";
import checkFillBox from "/assets/images/check-fill-box.svg";

initCommon();

const $orderItemList = document.getElementById("orderItemList");
const $orderTotalPrice = document.getElementById("orderTotalPrice");
const $productTotal = document.getElementById("productTotal");
const $discountTotal = document.getElementById("discountTotal");
const $shippingTotal = document.getElementById("shippingTotal");
const $finalTotal = document.getElementById("finalTotal");
const $agreeCheckbox = document.getElementById("agreeCheckbox");
const $agreeIcon = document.getElementById("agreeIcon");
const $submitOrderBtn = document.getElementById("submitOrderBtn");
const $searchZipBtn = document.getElementById("searchZipBtn");

const orderData = JSON.parse(localStorage.getItem("orderData"));

if (!orderData || !orderData.items || orderData.items.length === 0) {
  showAlertModal("주문할 상품이 없습니다.");
  window.location.href = "/";
}

function renderOrderItems() {
  $orderItemList.innerHTML = "";

  let totalProductPrice = 0;
  let totalShippingFee = 0;

  orderData.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalProductPrice += itemTotal;

    const shippingFee = item.shipping_method === "PARCEL" ? item.shipping_fee : 0;
    totalShippingFee += shippingFee;

    const li = document.createElement("li");
    li.className = "order-item";

    const itemInfo = document.createElement("div");
    itemInfo.className = "item-info";

    const itemImage = document.createElement("img");
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemImage.className = "item-image";

    const itemDetail = document.createElement("div");
    itemDetail.className = "item-detail";

    const itemSeller = document.createElement("span");
    itemSeller.className = "item-seller";
    itemSeller.textContent = item.store_name || "판매자";

    const itemName = document.createElement("span");
    itemName.className = "item-name";
    itemName.textContent = item.name;

    const itemQty = document.createElement("span");
    itemQty.className = "item-qty";
    itemQty.textContent = `수량 : ${item.quantity}개`;

    itemDetail.appendChild(itemSeller);
    itemDetail.appendChild(itemName);
    itemDetail.appendChild(itemQty);

    itemInfo.appendChild(itemImage);
    itemInfo.appendChild(itemDetail);

    const itemDiscount = document.createElement("span");
    itemDiscount.className = "item-discount";
    itemDiscount.textContent = "-";

    const itemShipping = document.createElement("span");
    itemShipping.className = "item-shipping";
    itemShipping.textContent = shippingFee === 0 ? "무료배송" : formatPrice(shippingFee) + "원";

    const itemPrice = document.createElement("span");
    itemPrice.className = "item-price";
    itemPrice.textContent = formatPrice(itemTotal) + "원";

    li.appendChild(itemInfo);
    li.appendChild(itemDiscount);
    li.appendChild(itemShipping);
    li.appendChild(itemPrice);

    $orderItemList.appendChild(li);
  });

  const finalPrice = totalProductPrice + totalShippingFee;

  $orderTotalPrice.textContent = formatPrice(finalPrice) + "원";
  $productTotal.textContent = formatPrice(totalProductPrice);
  $discountTotal.textContent = "0";
  $shippingTotal.textContent = formatPrice(totalShippingFee);
  $finalTotal.textContent = formatPrice(finalPrice) + "원";
}

$searchZipBtn.addEventListener("click", () => {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById("zipCode").value = data.zonecode;
      document.getElementById("address1").value = data.roadAddress || data.jibunAddress;
      document.getElementById("address2").focus();
    },
  }).open();
});

$agreeIcon.addEventListener("click", () => {
  $agreeCheckbox.checked = !$agreeCheckbox.checked;

  if ($agreeCheckbox.checked) {
    $agreeIcon.src = checkFillBox;
    $submitOrderBtn.disabled = false;
    $submitOrderBtn.classList.add("active");
  } else {
    $agreeIcon.src = checkBox;
    $submitOrderBtn.disabled = true;
    $submitOrderBtn.classList.remove("active");
  }
});

document.querySelector(".agree-checkbox label").addEventListener("click", () => {
  $agreeIcon.click();
});

function getPaymentMethod() {
  const selected = document.querySelector('input[name="paymentMethod"]:checked');
  if (!selected) return "card";

  const value = selected.value;

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

function getFormData() {
  const receiverPhone = [
    document.getElementById("receiverPhone1").value,
    document.getElementById("receiverPhone2").value,
    document.getElementById("receiverPhone3").value,
  ].join("");

  return {
    receiver: document.getElementById("receiverName").value,
    receiver_phone_number: receiverPhone,
    address: `${document.getElementById("address1").value} ${document.getElementById("address2").value}`,
    address_message: document.getElementById("deliveryMessage").value || "배송 전 연락 바랍니다",
    payment_method: getPaymentMethod(),
  };
}

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

$submitOrderBtn.addEventListener("click", async () => {
  if (!validateForm()) return;

  const formData = getFormData();
  const orderType = orderData.orderType;

  try {
    if (orderType === "direct") {
      // 바로 구매: direct_order 사용
      const item = orderData.items[0];
      const itemShipping = item.shipping_fee || 0;

      const requestData = {
        product: item.product_id || item.id,
        quantity: item.quantity,
        total_price: (item.price * item.quantity) + itemShipping,
        ...formData,
      };

      await createDirectOrder(requestData);
    } else {
      // 장바구니 주문: cart_order 사용
      // API 문서: "cartitem에 담긴 product의 id를 리스트 형태로 보내야합니다"
      const productIds = orderData.items.map(item => item.id);

      const requestData = {
        cart_items: productIds,
        total_price: calculateTotalPrice(),
        ...formData,
      };

      await createCartOrder(requestData);
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

renderOrderItems();