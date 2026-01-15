export function renderSummary(cart, container) {
  const checkedItems = cart.filter((i) => i.checked);
  const total = checkedItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  container.innerHTML = `
    <div class="summary-box">
      <div class="shipping">
        <div>
          <p>총 상품금액</p>
          <strong>${total.toLocaleString()}원</strong>
        </div>

        <div class="summary-icon">
          <img src="/assets/images/cart/cart-minus-icon.svg" alt="minus" />
        </div>

        <div>
          <p>상품 할인</p>
          <strong>0원</strong>
        </div>

        <div class="summary-icon">
          <img src="/assets/images/cart/cart-plus-icon.svg" alt="plus" />
        </div>

        <div>
          <p>배송비</p>
          <strong>0원</strong>
        </div>
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
