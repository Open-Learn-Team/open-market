import {
  initCommon,
  formatPrice,
  getQueryParam,
  showLoading,
  hideLoading,
} from "/assets/js/common.js";
import { getProducts, searchProducts } from "/utils/api.js";

// ─────────────────────────────
// 배너 관련 변수
// ─────────────────────────────
let bannerData = [];
let currentIndex = 0;
let autoPlayTimer = null;

// ─────────────────────────────
// 상품 카드 생성
// ─────────────────────────────
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

const renderProducts = (products, container, query = null) => {
  // 검색 결과 타이틀 (그리드 밖에 표시)
  let titleEl = document.querySelector('.search-result-title');
  
  if (query) {
    // 타이틀 요소가 없으면 생성
    if (!titleEl) {
      titleEl = document.createElement('p');
      titleEl.className = 'search-result-title';
      container.parentElement.insertBefore(titleEl, container);
    }
    titleEl.textContent = `"${query}" 검색 결과 (${products.length}개)`;
    titleEl.style.display = 'block';
  } else {
    // 검색이 아니면 타이틀 숨김
    if (titleEl) titleEl.style.display = 'none';
  }

  // 상품 목록
  if (!products?.length) {
    container.innerHTML = query 
      ? `<li class="empty">"${query}" 검색 결과가 없습니다.</li>`
      : '<li class="empty">등록된 상품이 없습니다.</li>';
    return;
  }
  
  container.innerHTML = products.map(createProductCard).join("");
};

// ─────────────────────────────
// 배너 렌더링
// ─────────────────────────────
const renderBanner = (products) => {
  const track = document.getElementById('bannerTrack');
  const dotsContainer = document.getElementById('bannerDots');
  
  if (!track || !dotsContainer) return;
  
  bannerData = products.slice(0, 5);
  
  if (bannerData.length === 0) return;
  
  track.innerHTML = bannerData.map((product) => `
    <figure class="banner-slide">
      <a href="/product/${product.id}">
        <img src="${product.image}" alt="${product.name}" />
      </a>
    </figure>
  `).join("");
  
  dotsContainer.innerHTML = bannerData.map((_, index) => `
    <button type="button" class="banner-dot" data-index="${index}"></button>
  `).join("");
  
  initBanner();
};

// ─────────────────────────────
// 배너 슬라이드 기능
// ─────────────────────────────
const initBanner = () => {
  const track = document.getElementById('bannerTrack');
  const dots = document.querySelectorAll('.banner-dot');
  const prevBtn = document.querySelector('.banner-nav.prev');
  const nextBtn = document.querySelector('.banner-nav.next');
  
  if (!track || bannerData.length === 0) return;
  
  const totalSlides = bannerData.length;
  
  const goToSlide = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };
  
  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);
  
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 4000);
  };
  
  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };
  
  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAutoPlay();
  });
  
  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoPlay();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoPlay();
    });
  });
  
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  
  goToSlide(0);
  startAutoPlay();
};

// ─────────────────────────────
// 배너 표시/숨김
// ─────────────────────────────
const toggleBanner = (show) => {
  const banner = document.querySelector('.banner');
  if (banner) {
    banner.style.display = show ? 'block' : 'none';
  }
};

// ─────────────────────────────
// 상품 로드
// ─────────────────────────────
const loadProducts = async () => {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  const loader = showLoading(grid);
  const query = getQueryParam("search");

  try {
    const data = query ? await searchProducts(query) : await getProducts();

    hideLoading(loader);
    renderProducts(data.results, grid, query);
    
    // 검색 중이면 배너 숨김, 아니면 표시
    if (query) {
      toggleBanner(false);
    } else {
      toggleBanner(true);
      renderBanner(data.results);
    }
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

// ─────────────────────────────
// 초기화
// ─────────────────────────────
const init = () => {
  initCommon();
  loadProducts();
};

document.addEventListener("DOMContentLoaded", init);