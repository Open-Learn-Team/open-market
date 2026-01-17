import { isLoggedIn, getUserType, logout } from "/utils/api.js";
import { showAlertModal } from "/components/Modal.js";

// 이미지 import
import logoHodu from "/assets/images/Logo-hodu.svg";
import searchIcon from "/assets/images/search.png";
import cartIcon from "/assets/images/icon-shopping-cart.svg";
import userIcon from "/assets/images/icon-user.svg";
import shoppingBagIcon from "/assets/images/icon-shopping-bag.svg";
import cartIconHover from "/assets/images/icon-shopping-cart-2.svg";
import userIconHover from "/assets/images/icon-user-2.svg";

export const createHeader = () => {
  const header = document.createElement("header");
  header.className = "header";

  const loggedIn = isLoggedIn();
  const userType = getUserType();
  const isSeller = userType === "SELLER";

  header.innerHTML = `
    <section class="header-inner">
      <h1 class="logo">
        <a href="/"><img src="${logoHodu}" alt="HODU" /></a>
      </h1>

      <form class="search-bar" role="search">
        <label for="search-input" class="sr-only">상품 검색</label>
        <input type="search" id="search-input" placeholder="상품을 검색해보세요!" />
        <button type="submit" aria-label="검색">
          <img src="${searchIcon}" alt="" width="28" height="28">
        </button>
      </form>

      <nav class="user-menu">
        <ul>
          ${
            !isSeller
              ? `
            <li>
              <a href="${loggedIn ? "/pages/cart/" : "#"}" class="menu-link ${
                  !loggedIn ? "require-login" : ""
                }">
                <img src="${cartIcon}" alt="" width="32" height="32">
                <span>장바구니</span>
              </a>
            </li>
          `
              : ""
          }
          
          ${
            loggedIn
              ? `
            <li class="mypage-wrap">
              <button type="button" class="mypage-btn" aria-expanded="false">
                <img src="${userIcon}" alt="" width="32" height="32">
                <span>마이페이지</span>
              </button>
              <ul class="dropdown">
                <li><a href="/pages/mypage/">마이페이지</a></li>
                <li><button type="button" class="logout-btn">로그아웃</button></li>
              </ul>
            </li>
            
            ${
              isSeller
                ? `
              <li>
                <a href="/pages/seller/" class="seller-center-btn">
                  <img src="${shoppingBagIcon}" alt="" width="32" height="32">
                  <span>판매자 센터</span>
                </a>
              </li>
            `
                : ""
            }
          `
              : `
            <li>
              <a href="/pages/login/" class="menu-link">
                <img src="${userIcon}" alt="" width="32" height="32">
                <span>로그인</span>
              </a>
            </li>
          `
          }
        </ul>
      </nav>
    </section>
  `;

  bindEvents(header);
  return header;
};

const bindEvents = (header) => {
  const searchForm = header.querySelector(".search-bar");
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = header.querySelector("#search-input").value.trim();
    if (query) window.location.href = `/?search=${encodeURIComponent(query)}`;
  });

  const mypageBtn = header.querySelector(".mypage-btn");
  const dropdown = header.querySelector(".dropdown");

  mypageBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("active");
    mypageBtn.setAttribute("aria-expanded", isOpen);
    mypageBtn.closest(".mypage-wrap").classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      !mypageBtn?.contains(e.target)
    ) {
      dropdown.classList.remove("active");
      mypageBtn?.setAttribute("aria-expanded", "false");
      mypageBtn?.closest(".mypage-wrap")?.classList.remove("active");
    }
  });

  header.querySelector(".logout-btn")?.addEventListener("click", logout);

  header.querySelectorAll(".require-login").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("showLoginModal"));
    });
  });

  // 장바구니 호버
  const cartLink = header.querySelector('a[href="/pages/cart/"]');
  if (cartLink) {
    const cartImg = cartLink.querySelector("img");
    const cartSpan = cartLink.querySelector("span");
    cartLink.addEventListener("mouseenter", () => {
      cartImg.src = cartIconHover;
      cartSpan.style.color = "#21BF48";
    });
    cartLink.addEventListener("mouseleave", () => {
      cartImg.src = cartIcon;
      cartSpan.style.color = "";
    });
  }

  // 마이페이지 호버
  if (mypageBtn) {
    const mypageImg = mypageBtn.querySelector("img");
    const mypageSpan = mypageBtn.querySelector("span");
    mypageBtn.addEventListener("mouseenter", () => {
      mypageImg.src = userIconHover;
      mypageSpan.style.color = "#21BF48";
    });
    mypageBtn.addEventListener("mouseleave", () => {
      mypageImg.src = userIcon;
      mypageSpan.style.color = "";
    });
  }

  // 로그인 버튼 호버
  const loginLink = header.querySelector('a[href="/pages/login/"]');
  if (loginLink) {
    const loginImg = loginLink.querySelector("img");
    const loginSpan = loginLink.querySelector("span");
    loginLink.addEventListener("mouseenter", () => {
      loginImg.src = userIconHover;
      loginSpan.style.color = "#21BF48";
    });
    loginLink.addEventListener("mouseleave", () => {
      loginImg.src = userIcon;
      loginSpan.style.color = "";
    });
  }

  // 마이페이지 링크 클릭 시 모달
  const mypageLink = header.querySelector('a[href="/pages/mypage/"]');
  if (mypageLink) {
    mypageLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAlertModal("서비스 준비 중입니다.");
    });
  }
};

export const renderHeader = (container) => {
  const el = createHeader();
  if (typeof container === "string") {
    document.querySelector(container)?.prepend(el);
  } else {
    container?.prepend(el);
  }
  return el;
};