import { renderHeader } from '/components/Header.js';
import { renderFooter } from '/components/Footer.js';
import { initModalListeners } from '/components/Modal.js';

// 공통 초기화
export const initCommon = () => {
  renderHeader(document.body);
  renderFooter(document.body);
  initModalListeners();
};

// 가격 포맷 (1000 -> "1,000")
export const formatPrice = (price) => price.toLocaleString('ko-KR');

// URL 파라미터 가져오기
export const getQueryParam = (param) => new URLSearchParams(window.location.search).get(param);

// 로딩 스피너
export const showLoading = (container) => {
  const loader = document.createElement('div');
  loader.className = 'loading-spinner';
  loader.innerHTML = '<div class="spinner"></div>';
  
  if (typeof container === 'string') {
    document.querySelector(container)?.appendChild(loader);
  } else {
    container?.appendChild(loader);
  }
  return loader;
};

export const hideLoading = (loader) => loader?.remove();