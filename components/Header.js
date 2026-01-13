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
        <a href="/"><img src="/assets/images/Logo-hodu.svg" alt="HODU" /></a>
      </h1>

      <form class="search-bar" role="search">
        <label for="search-input" class="sr-only">상품 검색</label>
        <input type="search" id="search-input" placeholder="상품을 검색해보세요!" />
        <button type="submit" aria-label="검색">
          <img src="/assets/images/search.png" alt="" width="28" height="28">
        </button>
      </form>

      <nav class="user-menu">
        <ul>
          ${!isSeller ? `
            <!-- 구매자: 장바구니 -->
            <li>
              <a href="${loggedIn ? '/pages/cart/' : '#'}" class="menu-link ${!loggedIn ? 'require-login' : ''}">
                <img src="/assets/images/icon-shopping-cart.svg" alt="" width="32" height="32">
                <span>장바구니</span>
              </a>
            </li>
          ` : ''}
          
          ${loggedIn ? `
            <!-- 로그인: 마이페이지 드롭다운 -->
            <li class="mypage-wrap">
              <button type="button" class="mypage-btn" aria-expanded="false">
                <img src="/assets/images/icon-user.svg" alt="" width="32" height="32">
                <span>마이페이지</span>
              </button>
              <ul class="dropdown">
                <li><a href="/pages/mypage/">마이페이지</a></li>
                <li><button type="button" class="logout-btn">로그아웃</button></li>
              </ul>
            </li>
            
            ${isSeller ? `
              <!-- 판매자: 판매자 센터 버튼 -->
              <li>
                <a href="/pages/seller/" class="seller-center-btn">
                  <img src="/assets/images/icon-shopping-bag.svg" alt="" width="32" height="32">
                  <span>판매자 센터</span>
                </a>
              </li>
            ` : ''}
          ` : `
            <!-- 비로그인: 로그인 버튼 -->
            <li>
              <a href="/pages/login/" class="menu-link">
                <img src="/assets/images/icon-user.svg" alt="" width="32" height="32">
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
  const searchForm = header.querySelector('.search-bar');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = header.querySelector('#search-input').value.trim();
    if (query) window.location.href = `/?search=${encodeURIComponent(query)}`;
  });

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

  header.querySelector('.logout-btn')?.addEventListener('click', logout);

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