import iconMinusLine from "/assets/images/icon-minus-line.svg";
import iconPlusLine from "/assets/images/icon-plus-line.svg";

export function createCartItem(
  item,
  { onQtyChange, onToggle, onOrder, onDelete }
) {
  const isSoldOut = item.stock === 0;

  const li = document.createElement("li");
  li.className = "cart-item";

  const cartCheck = document.createElement("div");
  cartCheck.className = `cart-check ${isSoldOut ? "disabled" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `check-${item.id}`;
  if (item.checked && !isSoldOut) checkbox.checked = true;
  if (isSoldOut) checkbox.disabled = true;

  const label = document.createElement("label");
  label.htmlFor = `check-${item.id}`;
  const labelSpan = document.createElement("span");
  label.appendChild(labelSpan);

  cartCheck.appendChild(checkbox);
  cartCheck.appendChild(label);

  const cartProduct = document.createElement("div");
  cartProduct.className = "cart-product";

  const productImg = document.createElement("img");
  productImg.src = item.image;

  const cartInfo = document.createElement("div");
  cartInfo.className = "cart-info";

  const seller = document.createElement("p");
  seller.className = "seller";
  seller.textContent = item.brand;

  const name = document.createElement("p");
  name.className = "name";
  name.textContent = item.name;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = item.price.toLocaleString() + "원";

  const delivery = document.createElement("p");
  delivery.className = "delivery";
  delivery.textContent = `${item.shipping_method === "PARCEL" ? "택배배송" : "직접배송"} / ${item.shipping_fee.toLocaleString()}`;

  cartInfo.appendChild(seller);
  cartInfo.appendChild(name);
  cartInfo.appendChild(price);
  cartInfo.appendChild(delivery);

  cartProduct.appendChild(productImg);
  cartProduct.appendChild(cartInfo);

  const cartQty = document.createElement("div");
  cartQty.className = "cart-qty";

  const minusBtn = document.createElement("button");
  minusBtn.className = `qty-btn minus ${isSoldOut || item.qty <= 1 ? "disabled" : ""}`;
  minusBtn.setAttribute("aria-label", "수량 감소");
  const minusImg = document.createElement("img");
  minusImg.src = iconMinusLine;
  minusImg.alt = "";
  minusBtn.appendChild(minusImg);

  const qtyValue = document.createElement("span");
  qtyValue.className = "qty-value";
  qtyValue.textContent = isSoldOut ? 0 : item.qty;

  const plusBtn = document.createElement("button");
  plusBtn.className = `qty-btn plus ${isSoldOut ? "disabled" : ""}`;
  plusBtn.setAttribute("aria-label", "수량 증가");
  const plusImg = document.createElement("img");
  plusImg.src = iconPlusLine;
  plusImg.alt = "";
  plusBtn.appendChild(plusImg);

  cartQty.appendChild(minusBtn);
  cartQty.appendChild(qtyValue);
  cartQty.appendChild(plusBtn);

  const cartTotal = document.createElement("div");
  cartTotal.className = "cart-total";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.setAttribute("aria-label", "상품 삭제");

  const cartPriceBox = document.createElement("div");
  cartPriceBox.className = "cart-price-box";

  const totalPrice = document.createElement("strong");
  totalPrice.textContent = (isSoldOut ? 0 : item.price * item.qty).toLocaleString() + "원";

  const orderBtn = document.createElement("button");
  orderBtn.className = `order-small ${isSoldOut ? "soldout" : ""}`;
  orderBtn.textContent = isSoldOut ? "품절" : "주문하기";

  cartPriceBox.appendChild(totalPrice);
  cartPriceBox.appendChild(orderBtn);

  cartTotal.appendChild(deleteBtn);
  cartTotal.appendChild(cartPriceBox);

  li.appendChild(cartCheck);
  li.appendChild(cartProduct);
  li.appendChild(cartQty);
  li.appendChild(cartTotal);

  cartProduct.addEventListener("click", () => {
    window.location.href = `/product/${item.productId}`;
  });

  if (!isSoldOut) {
    plusBtn.onclick = () => onQtyChange(item.id, +1);
    minusBtn.onclick = () => {
      if (item.qty <= 1) return;
      onQtyChange(item.id, -1);
    };

    checkbox.onchange = (e) => onToggle(item.id, e.target.checked);
    orderBtn.onclick = () => onOrder(item.id);
  }

  deleteBtn.onclick = () => onDelete(item.id);

  return li;
}