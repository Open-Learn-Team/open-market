import { renderHeader } from '/components/Header.js';
import { renderFooter } from '/components/Footer.js';
import { initModalListeners } from '/components/Modal.js';

// ========== 경로 체크 (404 리다이렉트) ==========
// 새로운 코드
const validPaths = [
  '/',
  '/pages/login/',
  '/pages/login',
  '/pages/signup/',
  '/pages/signup',
  '/pages/product-list/',
  '/pages/product-list',
  '/pages/product-detail/',
  '/pages/product-detail',
  '/pages/cart/',
  '/pages/cart',
  '/pages/not-found/',
  '/pages/not-found',
  '/pages/order/',        // ← 추가
  '/pages/order',         // ← 추가
  '/pages/seller/',
];


const currentPath = window.location.pathname;
const isValidPath = validPaths.some(path => 
  currentPath === path || 
  currentPath === path.slice(0, -1) ||
  currentPath.startsWith(path)
);

if (!isValidPath && !currentPath.includes('.')) {
  window.location.replace('/pages/not-found/');
}
// ================================================

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