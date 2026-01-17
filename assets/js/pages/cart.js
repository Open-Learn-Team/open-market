import { initCommon } from "/assets/js/common.js";
import { createCartItem } from "/components/cart/CartItem.js";
import { renderSummary } from "/components/cart/CartSummary.js";
import {
  getCart,
  addToCart,
  cartDetail,
  updateCartItem,
  deleteCartItem,
} from "/utils/api.js";
import { getApiErrorMessage } from "/utils/error.js";
import { showAlertModal } from "/components/Modal.js";

initCommon();

const $cartList = document.getElementById("cartList");
const $cartSummary = document.getElementById("cartSummary");
const $orderBtn = document.getElementById("order-btn");
const $checkAll = document.getElementById("checkAll");
const $deleteSelectedBtn = document.getElementById("delete-selected-btn");

let cart = [];

// 장바구니 로드해오기
async function loadCart() {
  const data = await getCart();

  const correctedItems = [];
  let hasAdjusted = false;

  for (const item of data.results) {
    const stock = item.product.stock;
    let qty = item.quantity;

    // ✅ 재고 초과 → 자동 보정
    if (stock > 0 && qty > stock) {
      qty = stock;
      hasAdjusted = true;

      // 서버에도 반영
      await updateCartItem(item.id, qty);
    }

    // 품절이면 수량 0
    if (stock === 0) {
      qty = 0;
    }

    correctedItems.push({
      id: item.id,
      productId: item.product.id,
      brand: item.product.seller.store_name,
      name: item.product.name,
      price: item.product.price,
      shipping_method: item.product.shipping_method,
      shipping_fee: item.product.shipping_fee,
      stock,
      qty,
      image: item.product.image,
      checked: stock > 0, // 품절은 체크 해제
    });
  }

  cart = correctedItems;
  renderCart();

  if (hasAdjusted) {
    showAlertModal("일부 상품의 재고가 변경되어 수량이 조정되었습니다.");
  }
}

// 상품 추가
export async function addProductToCart(productId, quantity = 1) {
  try {
    await addToCart(productId, quantity);
    showAlertModal("장바구니에 담겼습니다!");
  } catch (err) {
    showAlertModal(getApiErrorMessage(err, "수량을 변경할 수 없습니다."));
  }
}

// 디테일 불러오기
async function orderItem(cartItemId) {
  try {
    const detail = await cartDetail(cartItemId);
    const product = detail.product;

    // 주문 데이터를 localStorage에 저장
    const orderData = {
      orderType: "cart",
      items: [{
        id: product.id,
        cartItemId: detail.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: detail.quantity,
        shipping_method: product.shipping_method,
        shipping_fee: product.shipping_fee,
        store_name: product.seller?.store_name || "판매자",
      }],
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));
    window.location.href = "/pages/order/";
  } catch (e) {
    showAlertModal(getApiErrorMessage(e, "이 상품은 주문할 수 없습니다."));
  }
}

// 수량 수정하기
async function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  const newQty = Math.max(1, item.qty + delta);

  try {
    const updated = await updateCartItem(id, newQty);

    cart = cart.map((i) => (i.id === id ? { ...i, qty: updated.quantity } : i));

    renderCart();
  } catch (e) {
    showAlertModal(getApiErrorMessage(e, "수량을 변경할 수 없습니다."));
  }
}

// 상품 개별 삭제
async function removeItem(id) {
  if (!confirm("이 상품을 삭제할까요?")) return;

  try {
    await deleteCartItem(id);

    // 서버 성공 → 프론트 상태에서도 제거
    cart = cart.filter((item) => item.id !== id);
    renderCart();
  } catch (e) {
    showAlertModal("삭제 실패");
    console.error(e);
  }
}

// 선택 상품 삭제
$deleteSelectedBtn.onclick = async () => {
  const selectedItems = cart.filter((item) => item.checked);

  if (selectedItems.length === 0) {
    showAlertModal("삭제할 상품을 선택해주세요.");
    return;
  }

  if (!confirm(`${selectedItems.length}개의 상품을 삭제할까요?`)) return;

  try {
    // 서버에 하나씩 삭제 요청
    await Promise.all(selectedItems.map((item) => deleteCartItem(item.id)));

    // 프론트 상태에서도 제거
    cart = cart.filter((item) => !item.checked);

    renderCart();
  } catch (e) {
    showAlertModal("선택 상품 삭제에 실패했습니다.");
    console.error(e);
  }
};

// 전체 상품 선택
$checkAll.addEventListener("change", (e) => {
  const checked = e.target.checked;
  cart = cart.map((item) => ({ ...item, checked }));
  renderCart();
});

function toggleItem(id, checked) {
  cart = cart.map((item) => (item.id === id ? { ...item, checked } : item));
  renderCart();
}

function renderCart() {
  $cartList.innerHTML = "";
  $checkAll.checked = cart.length > 0 && cart.every((i) => i.checked);

  cart.forEach((item) => {
    const el = createCartItem(item, {
      onQtyChange: changeQty,
      onToggle: toggleItem,
      onOrder: orderItem,
      onDelete: removeItem,
    });
    $cartList.appendChild(el);
  });

  renderSummary(cart, $cartSummary);
}

// 새로운 코드
$orderBtn.onclick = () => {
  const checkedItems = cart.filter((i) => i.checked);
  if (checkedItems.length === 0) {
    showAlertModal("주문할 상품을 선택해주세요.");
    return;
  }

  // 주문 데이터를 localStorage에 저장
  const orderData = {
    orderType: "cart",
    items: checkedItems.map((item) => ({
      id: item.productId,
      cartItemId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.qty,
      shipping_method: item.shipping_method,
      shipping_fee: item.shipping_fee,
      store_name: item.brand,
    })),
  };

  localStorage.setItem("orderData", JSON.stringify(orderData));
  window.location.href = "/pages/order/";
};

loadCart();
