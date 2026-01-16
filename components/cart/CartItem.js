export function createCartItem(
  item,
  { onQtyChange, onToggle, onOrder, onDelete }
) {
  const li = document.createElement("li");
  li.className = "cart-item";

  li.innerHTML = `
    <div class="cart-check">
      <input type="checkbox" id="check-${item.id}" ${
    item.checked ? "checked" : ""
  } />
      <label for="check-${item.id}">
        <span></span>
      </label>
    </div>

    <div class="cart-product">
      <img src="${item.image}" />
      <div class="cart-info">
        <p class="seller">${item.brand}</p>
        <p class="name">${item.name}</p>
        <p class="price">${item.price.toLocaleString()}원</p>
        <p class="delivery">${
          item.shipping_method === "PARCEL" ? "택배배송" : "직접배송"
        } / ${item.shipping_fee.toLocaleString()}</p>
      </div>
    </div>

    <div class="cart-qty" aria-label="상품 수량 선택">
      <button type="button" class="qty-btn minus" aria-label="수량 감소">
        <img
          src="/assets/images/icon-minus-line.svg"
          alt="/assets/images/icon-minus-line.svg"
        />
      </button>

      <!-- 가운데 숫자는 직접 입력하지 않고 JS로만 변경 -->
      <span class="qty-value" id="quantityValue" aria-live="polite">
        ${item.qty}
      </span>

      <button type="button" class="qty-btn plus" aria-label="수량 증가">
        <img
          src="/assets/images/icon-plus-line.svg"
          alt="/assets/images/icon-plus-line.svg"
        />
      </button>
    </div>

    <div class="cart-total">
      <button class="delete-btn" aria-label="삭제"></button>

      <div class="cart-price-box">
        <strong>${(item.price * item.qty).toLocaleString()}원</strong>
        <button class="order-small">주문하기</button>
      </div>
    </div>

  `;

  const productArea = li.querySelector(".cart-product");

  productArea.addEventListener("click", () => {
    window.location.href = `/product/${item.productId}`;
  });

  const minus = li.querySelector(".qty-btn.minus");
  const plus = li.querySelector(".qty-btn.plus");
  const qtyValue = li.querySelector(".qty-value");

  const checkbox = li.querySelector("input");
  const orderBtn = li.querySelector(".order-small");
  const deleteBtn = li.querySelector(".delete-btn");

  // 수량이 1이면 마이너스 비활성화
  if (item.qty <= 1) {
    minus.disabled = true;
    minus.classList.add("disabled");
  } else {
    minus.disabled = false;
    minus.classList.remove("disabled");
  }

  plus.onclick = () => onQtyChange(item.id, +1);
  minus.onclick = () => {
    if (item.qty <= 1) return;
    onQtyChange(item.id, -1);
  };

  checkbox.onchange = (e) => onToggle(item.id, e.target.checked);
  orderBtn.onclick = () => onOrder(item.id);
  deleteBtn.onclick = () => onDelete(item.id);

  return li;
}
