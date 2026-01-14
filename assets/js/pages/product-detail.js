// /assets/js/pages/product-detail.js

import { getProductDetail, isLoggedIn } from "/utils/api.js";
import { initCommon } from "/assets/js/common.js";  
import { showLoginModal, showAlertModal } from "/components/Modal.js"

// ─────────────────────────────
// 1. DOM 요소 가져오기
// ─────────────────────────────
const $productImage = document.getElementById("productImage");
const $sellerName = document.getElementById("sellerName");
const $productName = document.getElementById("productName");
const $productPrice = document.getElementById("productPrice");

const $qtyMinus = document.querySelector(".qty-btn.minus");
const $qtyPlus = document.querySelector(".qty-btn.plus");
const $qtyValue = document.getElementById("quantityValue");

const $totalQty = document.getElementById("totalQty");
const $totalPrice = document.getElementById("totalPrice");

const $btnCart = document.getElementById("addToCartBtn");
const $btnBuy = document.getElementById("buyNowBtn");

const $tabs = document.querySelectorAll(".product-tabs .tab");
const $tabPanel = document.getElementById("tabPanel");

// ─────────────────────────────
// 2. 상태 값 (가격, 재고, 수량 등)
// ─────────────────────────────
let product = null;
let unitPrice = 0;
let stock = 0;
let quantity = 1;

// ─────────────────────────────
// 3. URL에서 id 읽기 (home.js와 맞춤)
// 예: /pages/product-detail/?id=3
// ─────────────────────────────
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");  // "product_id" → "id"로 변경

if (!productId) {
  alert("");
  window.location.href = "/";
}

// 숫자에 콤마 붙이기
const formatNumber = (num) => Number(num).toLocaleString("ko-KR");

// ─────────────────────────────
// 4. 수량 / 총 금액 갱신 함수
// ─────────────────────────────
function updateQuantity(newQty) {
  if (newQty < 1) newQty = 1;
  if (stock && newQty > stock) newQty = stock;

  quantity = newQty;

  $qtyValue.textContent = quantity;
  $totalQty.textContent = quantity;

  const total = unitPrice * quantity;
  $totalPrice.textContent = formatNumber(total);

  $qtyMinus.disabled = quantity <= 1;
  $qtyPlus.disabled = stock ? quantity >= stock : false;
}

// ─────────────────────────────
// 5. 상품 상세 불러오기
// ─────────────────────────────
async function loadProduct() {
  try {
    product = await getProductDetail(productId);

    console.log("상품 데이터:", product);

    // 구조 분해 대신 직접 접근
    unitPrice = Number(product.price);
    stock = Number(product.stock);


    $sellerName.textContent = product.seller?.store_name || "판매자";
    $productName.textContent = product.name;
    $productPrice.textContent = formatNumber(product.price);

    if (product.image) {
      $productImage.src = product.image;
      $productImage.alt = product.name;
    }

    document.title = `${product.name} | HODU`;

    updateQuantity(1);
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
  }
}
// ─────────────────────────────
// 6. 수량 버튼 이벤트
// ─────────────────────────────
function initQuantityControls() {
  if ($qtyMinus) {
    $qtyMinus.addEventListener("click", () => {
      if (quantity <= 1) return;
      updateQuantity(quantity - 1);
    });
  }

  if ($qtyPlus) {
    $qtyPlus.addEventListener("click", () => {
      if (stock && quantity >= stock) return;
      updateQuantity(quantity + 1);
    });
  }
}

// ─────────────────────────────
// 7. 장바구니 / 바로구매
// ─────────────────────────────
function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart() {
  // ✅ 로그인 체크 - 모달 사용
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }

  if (!product) return;

  const cart = getCart();
  const index = cart.findIndex((item) => String(item.productId) === String(productId));

  if (index === -1) {
    cart.push({
      productId,
      quantity,
      productName: product.name,
      price: unitPrice,
      image: product.image
    });
    showAlertModal("장바구니에 담았습니다.");  
  } else {
    cart[index].quantity = quantity;
    showAlertModal("이미 장바구니에 있는 상품입니다.<br>수량을 업데이트했습니다.");
  }

  setCart(cart);
}

function buyNow() {
  // ✅ 로그인 체크 - 모달 사용
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }

  if (!product) return;
  showAlertModal("바로구매 기능은 추후 구현 예정입니다.");
}

 
// ─────────────────────────────
// 8. 탭 전환
// ─────────────────────────────
function initTabs() {
  if (!$tabs.length) return;

  $tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      $tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const type = tab.dataset.tab;
      switch (type) {
        case "detail":
          $tabPanel.textContent = "상품 상세 정보 영역입니다.";
          break;
        case "review":
          $tabPanel.textContent = "아직 등록된 리뷰가 없습니다.";
          break;
        case "qna":
          $tabPanel.textContent = "상품 Q&A 영역입니다.";
          break;
        case "exchange":
          $tabPanel.textContent = "반품/교환 안내 영역입니다.";
          break;
        default:
          $tabPanel.textContent = "";
      }
    });
  });

  $tabPanel.textContent = "상품 상세 정보 영역입니다.";
}

// ─────────────────────────────
// 9. 초기화
// ─────────────────────────────
function initPage() {
  initCommon();  
  initQuantityControls();
  initTabs();

  $btnCart?.addEventListener("click", addToCart);
  $btnBuy?.addEventListener("click", buyNow);

  if (productId) {
    loadProduct();
  }
}

document.addEventListener("DOMContentLoaded", initPage);