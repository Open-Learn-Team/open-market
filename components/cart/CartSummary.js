export function renderSummary(cart, container) {
  const checkedItems = cart.filter(
    (i) => i.checked && i.stock > 0 && i.qty > 0
  );
  const total = checkedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = checkedItems.reduce((sum, i) => sum + i.shipping_fee, 0);

  container.innerHTML = `
    <div class="summary-box">
      <div>
        <p>총 상품금액</p>
        <strong><span class="text">${total.toLocaleString()}</span>
          <span class="won">원</span></strong>
      </div>

      <div class="summary-icon">
        <img src="/assets/images/cart/cart-minus-icon.svg" alt="minus" />
      </div>

      <div>
        <p>상품 할인</p>
        <strong><span class="text">0</span>
          <span class="won">원</span></strong>
      </div>

      <div class="summary-icon">
        <img src="/assets/images/cart/cart-plus-icon.svg" alt="plus" />
      </div>

      <div>
        <p>배송비</p>
        <strong><span class="text">${delivery.toLocaleString()}</span>
          <span class="won">원</span></strong>
      </div>

      <div class="final">
        <p>결제 예정 금액</p>
        <strong><span class="price">${total.toLocaleString()}</span>
          <span class="won">원</span>
        </strong>
      </div>
    </div>
  `;
}
