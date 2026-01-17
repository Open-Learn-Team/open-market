import {
  initCommon,
  formatPrice,
  getQueryParam,
  showLoading,
  hideLoading,
} from "/assets/js/common.js";
import { getProducts, searchProducts } from "/utils/api.js";

const BANNER_AUTO_PLAY_INTERVAL = 4000;

let bannerData = [];
let currentIndex = 0;
let autoPlayTimer = null;

const createProductCard = (product) => {
  const { id, name, image, price, seller } = product;

  const li = document.createElement("li");
  li.className = "product-card";

  const a = document.createElement("a");
  a.href = `/product/${id}`;

  const figure = document.createElement("figure");
  figure.className = "product-img";

  const img = document.createElement("img");
  img.src = image;
  img.alt = name;
  img.loading = "lazy";

  figure.appendChild(img);

  const sellerP = document.createElement("p");
  sellerP.className = "seller";
  sellerP.textContent = seller?.store_name || "판매자";

  const nameH3 = document.createElement("h3");
  nameH3.className = "name";
  nameH3.textContent = name;

  const priceP = document.createElement("p");
  priceP.className = "price";
  const priceStrong = document.createElement("strong");
  priceStrong.textContent = formatPrice(price);
  priceP.appendChild(priceStrong);
  priceP.appendChild(document.createTextNode("원"));

  a.appendChild(figure);
  a.appendChild(sellerP);
  a.appendChild(nameH3);
  a.appendChild(priceP);

  li.appendChild(a);

  return li;
};

const renderProducts = (products, container, query = null) => {
  let titleEl = document.querySelector(".search-result-title");

  if (query) {
    if (!titleEl) {
      titleEl = document.createElement("p");
      titleEl.className = "search-result-title";
      container.parentElement.insertBefore(titleEl, container);
    }
    titleEl.textContent = `"${query}" 검색 결과 (${products.length}개)`;
    titleEl.style.display = "block";
  } else {
    if (titleEl) titleEl.style.display = "none";
  }

  container.innerHTML = "";

  if (!products?.length) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty";
    emptyLi.textContent = query
      ? `"${query}" 검색 결과가 없습니다.`
      : "등록된 상품이 없습니다.";
    container.appendChild(emptyLi);
    return;
  }

  products.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
};

const renderBanner = (products) => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");

  if (!track || !dotsContainer) return;

  bannerData = products.slice(0, 5);

  if (bannerData.length === 0) return;

  track.innerHTML = "";
  bannerData.forEach((product) => {
    const figure = document.createElement("figure");
    figure.className = "banner-slide";

    const a = document.createElement("a");
    a.href = `/product/${product.id}`;

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    a.appendChild(img);
    figure.appendChild(a);
    track.appendChild(figure);
  });

  dotsContainer.innerHTML = "";
  bannerData.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "banner-dot";
    button.dataset.index = index;
    dotsContainer.appendChild(button);
  });

  initBanner();
};

const initBanner = () => {
  const track = document.getElementById("bannerTrack");
  const dots = document.querySelectorAll(".banner-dot");
  const prevBtn = document.querySelector(".banner-nav.prev");
  const nextBtn = document.querySelector(".banner-nav.next");

  if (!track || bannerData.length === 0) return;

  const totalSlides = bannerData.length;

  const goToSlide = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, BANNER_AUTO_PLAY_INTERVAL);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoPlay();
    });
  });

  track.addEventListener("mouseenter", stopAutoPlay);
  track.addEventListener("mouseleave", startAutoPlay);

  goToSlide(0);
  startAutoPlay();
};

const toggleBanner = (show) => {
  const banner = document.querySelector(".banner");
  if (banner) {
    banner.style.display = show ? "block" : "none";
  }
};

const loadProducts = async () => {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  const loader = showLoading(grid);
  const query = getQueryParam("search");

  try {
    const data = query ? await searchProducts(query) : await getProducts();

    hideLoading(loader);
    renderProducts(data.results, grid, query);

    if (query) {
      toggleBanner(false);
    } else {
      toggleBanner(true);
      renderBanner(data.results);
    }
  } catch (err) {
    console.error(err);
    hideLoading(loader);

    grid.innerHTML = "";
    const errorLi = document.createElement("li");
    errorLi.className = "error";

    const errorP = document.createElement("p");
    errorP.textContent = "상품을 불러오는데 실패했습니다.";

    const retryButton = document.createElement("button");
    retryButton.textContent = "다시 시도";
    retryButton.onclick = () => location.reload();

    errorLi.appendChild(errorP);
    errorLi.appendChild(retryButton);
    grid.appendChild(errorLi);
  }
};

const init = () => {
  initCommon();
  loadProducts();
};

document.addEventListener("DOMContentLoaded", init);
