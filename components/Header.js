import { isLoggedIn, getUserType, logout } from '/utils/api.js';

export const createHeader = () => {
  const header = document.createElement('header');
  header.className = 'header';
  
  const loggedIn = isLoggedIn();
  const userType = getUserType();
  const isSeller = userType === 'SELLER';

  header.innerHTML = `
    <section class="header-inner">
      <h1 class="logo">
        <a href="/"><img src="/assets/images/logo-hodu.svg" alt="HODU" /></a>
      </h1>

      <form class="search-bar" role="search">
        <label for="search-input" class="sr-only">상품 검색</label>
        <input type="search" id="search-input" placeholder="상품을 검색해보세요!" />
        <button type="submit" aria-label="검색">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="12.5" cy="12.5" r="9" stroke="#21BF48" stroke-width="3"/>
            <line x1="19.5" y1="19.5" x2="24" y2="24" stroke="#21BF48" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </button>
      </form>

      <nav class="user-menu">
        <ul>
          ${!isSeller ? `
            <li>
              <a href="${loggedIn ? '/pages/cart/' : '#'}" class="${!loggedIn ? 'require-login' : ''}">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M5.33 2.67H2.67v2.66h1.56l3.33 13.34h16.88l2.23-10.67H9.33v2.67h14.22l-1.33 5.33H9.78L6.45 2.67H5.33Z" fill="currentColor"/>
                  <circle cx="10" cy="24" r="2" fill="currentColor"/>
                  <circle cx="22" cy="24" r="2" fill="currentColor"/>
                </svg>
                <span>장바구니</span>
              </a>
            </li>
          ` : ''}
          
          ${loggedIn ? `
            <li class="mypage-wrap">
              <button type="button" class="mypage-btn" aria-expanded="false">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="10" r="6" stroke="${isSeller ? '#21BF48' : 'currentColor'}" stroke-width="2"/>
                  <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="${isSeller ? '#21BF48' : 'currentColor'}" stroke-width="2"/>
                </svg>
                <span ${isSeller ? 'class="primary"' : ''}>마이페이지</span>
              </button>
              <ul class="dropdown">
                <li><a href="/pages/mypage/">마이페이지</a></li>
                <li><button type="button" class="logout-btn">로그아웃</button></li>
              </ul>
            </li>
            ${isSeller ? `
              <li>
                <a href="/pages/seller-center/" class="seller-btn">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="8" width="24" height="16" rx="2" stroke="white" stroke-width="2"/>
                    <path d="M4 14h24" stroke="white" stroke-width="2"/>
                  </svg>
                  <span>판매자 센터</span>
                </a>
              </li>
            ` : ''}
          ` : `
            <li>
              <a href="/pages/login/">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="10" r="6" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>로그인</span>
              </a>
            </li>
          `}
        </ul>
      </nav>
    </section>
  `;

  bindEvents(header);
  return header;
};

const bindEvents = (header) => {
  // 검색
  const searchForm = header.querySelector('.search-bar');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = header.querySelector('#search-input').value.trim();
    if (query) window.location.href = `/?search=${encodeURIComponent(query)}`;
  });

  // 마이페이지 드롭다운
  const mypageBtn = header.querySelector('.mypage-btn');
  const dropdown = header.querySelector('.dropdown');

  mypageBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('active');
    mypageBtn.setAttribute('aria-expanded', isOpen);
    mypageBtn.closest('.mypage-wrap').classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.contains(e.target) && !mypageBtn?.contains(e.target)) {
      dropdown.classList.remove('active');
      mypageBtn?.setAttribute('aria-expanded', 'false');
      mypageBtn?.closest('.mypage-wrap')?.classList.remove('active');
    }
  });

  // 로그아웃
  header.querySelector('.logout-btn')?.addEventListener('click', logout);

  // 비로그인 장바구니 클릭
  header.querySelectorAll('.require-login').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('showLoginModal'));
    });
  });
};

export const renderHeader = (container) => {
  const el = createHeader();
  if (typeof container === 'string') {
    document.querySelector(container)?.prepend(el);
  } else {
    container?.prepend(el);
  }
  return el;
};