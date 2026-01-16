export function createCartItem(
  item,
  { onQtyChange, onToggle, onOrder, onDelete }
) {
  const isSoldOut = item.stock === 0;

  const li = document.createElement("li");
  li.className = "cart-item";

  li.innerHTML = `
    <div class="cart-check ${isSoldOut ? "disabled" : ""}">
      <input
        type="checkbox"
        id="check-${item.id}"
        ${item.checked && !isSoldOut ? "checked" : ""}
        ${isSoldOut ? "disabled" : ""}
      />
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
        <p class="delivery">
          ${item.shipping_method === "PARCEL" ? "택배배송" : "직접배송"}
          / ${item.shipping_fee.toLocaleString()}
        </p>
      </div>
    </div>

    <div class="cart-qty">
      <button class="qty-btn minus ${
        isSoldOut || item.qty <= 1 ? "disabled" : ""
      }">
        <img src="/assets/images/icon-minus-line.svg" />
      </button>

      <span class="qty-value">${isSoldOut ? 0 : item.qty}</span>

      <button class="qty-btn plus ${isSoldOut ? "disabled" : ""}">
        <img src="/assets/images/icon-plus-line.svg" />
      </button>
    </div>

    <div class="cart-total">
      <button class="delete-btn"></button>

      <div class="cart-price-box">
        <strong>
          ${(isSoldOut ? 0 : item.price * item.qty).toLocaleString()}원
        </strong>

        <button class="order-small ${isSoldOut ? "soldout" : ""}">
          ${isSoldOut ? "품절" : "주문하기"}
        </button>
      </div>
    </div>
  `;

  const productArea = li.querySelector(".cart-product");

  productArea.addEventListener("click", () => {
    window.location.href = `/product/${item.productId}`;
  });

  const minus = li.querySelector(".qty-btn.minus");
  const plus = li.querySelector(".qty-btn.plus");
  const checkbox = li.querySelector("input");
  const orderBtn = li.querySelector(".order-small");

  if (!isSoldOut) {
    plus.onclick = () => onQtyChange(item.id, +1);
    minus.onclick = () => {
      if (item.qty <= 1) return;
      onQtyChange(item.id, -1);
    };

    checkbox.onchange = (e) => onToggle(item.id, e.target.checked);
    orderBtn.onclick = () => onOrder(item.id);
  }

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.onclick = () => onDelete(item.id);

  return li;
}
