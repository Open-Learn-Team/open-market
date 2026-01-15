import {
  initCommon,
  formatPrice,
  getQueryParam,
  showLoading,
  hideLoading,
} from "/assets/js/common.js";
import { getProducts, searchProducts } from "/utils/api.js";

const createProductCard = (product) => {
  const { id, name, image, price, seller } = product;
  return `
    <li class="product-card">
      <a href="/product/${id}">

        <figure class="product-img">
          <img src="${image}" alt="${name}" loading="lazy" />
        </figure>
        <p class="seller">${seller?.store_name || "판매자"}</p>
        <h3 class="name">${name}</h3>
        <p class="price"><strong>${formatPrice(price)}</strong>원</p>
      </a>
    </li>
  `;
};

const renderProducts = (products, container) => {
  if (!products?.length) {
    container.innerHTML = '<li class="empty">등록된 상품이 없습니다.</li>';
    return;
  }
  container.innerHTML = products.map(createProductCard).join("");
};

const loadProducts = async () => {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  const loader = showLoading(grid);

  try {
    const query = getQueryParam("search");
    const data = query ? await searchProducts(query) : await getProducts();

    hideLoading(loader);
    renderProducts(data.results, grid);
  } catch (err) {
    console.error(err);
    hideLoading(loader);
    grid.innerHTML = `
      <li class="error">
        <p>상품을 불러오는데 실패했습니다.</p>
        <button onclick="location.reload()">다시 시도</button>
      </li>
    `;
  }
};

const init = () => {
  initCommon();
  loadProducts();

  // 배너 첫번째 dot 활성화
  document.querySelector(".banner-dot")?.classList.add("active");
};

document.addEventListener("DOMContentLoaded", init);
