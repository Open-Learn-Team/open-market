import { initCommon } from "/assets/js/common.js";
import { createCartItem } from "/components/cart/CartItem.js";
import { renderSummary } from "/components/cart/CartSummary.js";
import {
  getCart,
  addToCart,
  cartDetail,
  updateCartItem,
  deleteCartItem,
  deleteCartAll,
} from "/utils/api.js";

initCommon();

const cartList = document.getElementById("cartList");
const summaryEl = document.getElementById("cartSummary");
const orderBtn = document.getElementById("order-btn");

let cart = [];

// 장바구니 로드해오기
async function loadCart() {
  const data = await getCart();
  console.log("🧾 CART API RAW:", data);

  cart = data.results.map((item) => ({
    id: item.id,
    productId: item.product.id,
    brand: item.product.seller.store_name,
    name: item.product.name,
    price: item.product.price,
    qty: item.quantity,
    image: item.product.image,
    checked: true,
  }));

  renderCart();
}

// 상품 추가
export async function addProductToCart(productId, quantity = 1) {
  try {
    await addToCart(productId, quantity);
    alert("장바구니에 담겼습니다!");
  } catch (err) {
    alert("장바구니 담기에 실패했습니다.");
    console.error(err);
  }
}

// 디테일 불러오기
async function orderItem(cartItemId) {
  try {
    const detail = await cartDetail(cartItemId);

    console.log("서버에서 검증된 장바구니 아이템:", detail);

    alert(`"${detail.product.name}" 주문 페이지로 이동`);
    // 여기에 나중에 주문 페이지 이동
  } catch (e) {
    alert("이 상품은 주문할 수 없습니다.");
  }
}

// 수량 수정하기
async function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  const newQty = Math.max(1, item.qty + delta);

  try {
    const updated = await updateCartItem(id, newQty);

    // 서버에서 확정된 수량으로 반영
    cart = cart.map((i) => (i.id === id ? { ...i, qty: updated.quantity } : i));

    renderCart();
  } catch (e) {
    alert("수량 변경 실패");
    console.error(e);
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
    alert("삭제 실패");
    console.error(e);
  }
}

function toggleItem(id, checked) {
  cart = cart.map((item) => (item.id === id ? { ...item, checked } : item));
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";

  cart.forEach((item) => {
    const el = createCartItem(item, {
      onQtyChange: changeQty,
      onToggle: toggleItem,
      onOrder: orderItem,
      onDelete: removeItem,
    });
    cartList.appendChild(el);
  });

  renderSummary(cart, summaryEl);
}

orderBtn.onclick = () => {
  const checkedItems = cart.filter((i) => i.checked);
  if (checkedItems.length === 0) {
    alert("주문할 상품을 선택해주세요.");
    return;
  }

  alert(`${checkedItems.length}개의 상품을 주문합니다 (추후 구현)`);
};

loadCart();
