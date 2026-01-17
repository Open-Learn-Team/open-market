// 판매자 센터 JS
import {
  isLoggedIn,
  getUserType,
  getUserInfo,
  getSellerProducts,
  deleteProduct,
} from "/utils/api.js";
import { formatPrice } from "/assets/js/common.js";
import { renderFooter } from "/components/Footer.js";

// DOM 요소
const $storeName = document.getElementById("storeName");
const $productCount = document.getElementById("productCount");
const $productList = document.getElementById("productList");
const $emptyState = document.getElementById("emptyState");
const $deleteModal = document.getElementById("deleteModal");
const $cancelDelete = document.getElementById("cancelDelete");
const $confirmDelete = document.getElementById("confirmDelete");

// 삭제할 상품 ID 저장
let deleteTargetId = null;

// 권한 체크
const checkAuth = () => {
  if (!isLoggedIn()) {
    alert("로그인이 필요합니다.");
    window.location.href = "/pages/login/";
    return false;
  }

  if (getUserType() !== "SELLER") {
    alert("판매자만 접근할 수 있습니다.");
    window.location.href = "/";
    return false;
  }

  return true;
};

// 상품 목록 불러오기
const loadProducts = async () => {
  try {
    const userInfo = getUserInfo();

    // 스토어명 표시
    $storeName.textContent = userInfo?.store_name || userInfo?.name || "스토어";

    // 판매자 상품 불러오기 (토큰 인증 기반)
    const data = await getSellerProducts();

    // 상품 개수 표시
    $productCount.textContent = data.count || 0;

    if (data.results?.length > 0) {
      renderProducts(data.results);
      $emptyState.style.display = "none";
    } else {
      $productList.innerHTML = "";
      $emptyState.style.display = "block";
    }
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    $productList.innerHTML = "";
    $emptyState.style.display = "block";
  }
};

// 상품 목록 렌더링
const renderProducts = (products) => {
  $productList.innerHTML = "";

  products.forEach((product) => {
    const tr = document.createElement("tr");
    tr.dataset.id = product.id;

    const tdProduct = document.createElement("td");
    const productInfoDiv = document.createElement("div");
    productInfoDiv.className = "product-info";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = product.name;

    const stockSpan = document.createElement("span");
    stockSpan.className = "stock";
    stockSpan.textContent = `재고: ${product.stock}개`;

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(stockSpan);

    productInfoDiv.appendChild(img);
    productInfoDiv.appendChild(infoDiv);
    tdProduct.appendChild(productInfoDiv);

    const tdPrice = document.createElement("td");
    tdPrice.className = "product-price";
    tdPrice.textContent = formatPrice(product.price) + "원";

    const tdEdit = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn-edit";
    editBtn.dataset.id = product.id;
    editBtn.textContent = "수정";
    tdEdit.appendChild(editBtn);

    const tdDelete = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete";
    deleteBtn.dataset.id = product.id;
    deleteBtn.textContent = "삭제";
    tdDelete.appendChild(deleteBtn);

    tr.appendChild(tdProduct);
    tr.appendChild(tdPrice);
    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);

    $productList.appendChild(tr);
  });

  // 이벤트 바인딩
  bindProductEvents();
};

// 상품 버튼 이벤트
const bindProductEvents = () => {
  // 수정 버튼
  $productList.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      window.location.href = `/pages/seller/upload/?id=${productId}`;
    });
  });

  // 삭제 버튼
  $productList.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteTargetId = btn.dataset.id;
      $deleteModal.classList.add("active");
    });
  });
};

// 삭제 모달 이벤트
const initModalEvents = () => {
  // 취소 버튼
  $cancelDelete.addEventListener("click", () => {
    deleteTargetId = null;
    $deleteModal.classList.remove("active");
  });

  // 삭제 확인 버튼
  $confirmDelete.addEventListener("click", async () => {
    if (!deleteTargetId) return;

    try {
      await deleteProduct(deleteTargetId);
      alert("상품이 삭제되었습니다.");
      $deleteModal.classList.remove("active");
      deleteTargetId = null;
      loadProducts(); // 새로고침
    } catch (error) {
      alert("삭제에 실패했습니다.");
      console.error(error);
    }
  });

  // 모달 외부 클릭
  $deleteModal.addEventListener("click", (e) => {
    if (e.target === $deleteModal) {
      deleteTargetId = null;
      $deleteModal.classList.remove("active");
    }
  });
};

// 사이드바 메뉴 이벤트
const initSidebar = () => {
  const menuItems = document.querySelectorAll(".sidebar-nav a");

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // active 클래스 이동
      menuItems.forEach((i) => i.parentElement.classList.remove("active"));
      item.parentElement.classList.add("active");

      // 메뉴별 동작 (추후 구현)
    });
  });
};

// 초기화
const init = () => {
  if (!checkAuth()) return;

  initModalEvents();
  initSidebar();
  loadProducts();
  renderFooter("#footer");
};

document.addEventListener("DOMContentLoaded", init);
