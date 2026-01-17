// 상품 등록/수정 JS
import {
  isLoggedIn,
  getUserType,
  createProduct,
  updateProduct,
  getProductDetail,
} from "/utils/api.js";
import { renderFooter } from "/components/Footer.js";

// DOM 요소
const $form = document.getElementById("productForm");
const $imageInput = document.getElementById("productImage");
const $previewImage = document.getElementById("previewImage");
const $uploadPlaceholder = document.getElementById("uploadPlaceholder");
const $productName = document.getElementById("productName");
const $nameCount = document.getElementById("nameCount");
const $productPrice = document.getElementById("productPrice");
const $shippingMethod = document.getElementById("shippingMethod");
const $shippingFee = document.getElementById("shippingFee");
const $productStock = document.getElementById("productStock");
const $productInfo = document.getElementById("productInfo");
const $cancelBtn = document.getElementById("cancelBtn");
const $methodBtns = document.querySelectorAll(".method-btn");

// 수정 모드인지 확인 (URL에 id가 있으면 수정)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const isEditMode = !!productId;

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

// 이미지 미리보기
const initImageUpload = () => {
  $imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    const validTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("PNG, JPG, GIF 파일만 업로드 가능합니다.");
      e.target.value = "";
      return;
    }

    // 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      $previewImage.src = e.target.result;
      $previewImage.classList.add("active");
      $uploadPlaceholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
};

// 글자 수 카운트
const initNameCount = () => {
  $productName.addEventListener("input", () => {
    const length = $productName.value.length;
    $nameCount.textContent = length;
  });
};

// 배송방법 버튼
const initShippingMethod = () => {
  $methodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      $methodBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      $shippingMethod.value = btn.dataset.method;
    });
  });
};

// 폼 유효성 검사
const validateForm = () => {
  let isValid = true;

  // 이미지 검사 (신규 등록 시 필수)
  if (!isEditMode && !$imageInput.files[0]) {
    alert("상품 이미지를 등록해주세요.");
    return false;
  }

  // 상품명 검사
  if (!$productName.value.trim()) {
    alert("상품명을 입력해주세요.");
    $productName.focus();
    return false;
  }

  // 판매가 검사
  if (!$productPrice.value || Number($productPrice.value) <= 0) {
    alert("판매가를 입력해주세요.");
    $productPrice.focus();
    return false;
  }

  // 배송비 검사
  if (!$shippingFee.value || Number($shippingFee.value) < 0) {
    alert("배송비를 입력해주세요.");
    $shippingFee.focus();
    return false;
  }

  // 재고 검사
  if (!$productStock.value || Number($productStock.value) < 0) {
    alert("재고를 입력해주세요.");
    $productStock.focus();
    return false;
  }

  // 상품 정보 검사
  if (!$productInfo.value.trim()) {
    alert("상품 상세 정보를 입력해주세요.");
    $productInfo.focus();
    return false;
  }

  return true;
};

// 폼 제출
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const formData = new FormData();
  formData.append("name", $productName.value.trim());
  formData.append("price", Number($productPrice.value));
  formData.append("shipping_method", $shippingMethod.value);
  formData.append("shipping_fee", Number($shippingFee.value));
  formData.append("stock", Number($productStock.value));
  formData.append("info", $productInfo.value.trim());

  // 이미지가 있으면 추가
  if ($imageInput.files[0]) {
    formData.append("image", $imageInput.files[0]);
  }

  try {
    if (isEditMode) {
      await updateProduct(productId, formData);
      alert("상품이 수정되었습니다.");
    } else {
      await createProduct(formData);
      alert("상품이 등록되었습니다.");
    }
    window.location.href = "/pages/seller/";
  } catch (error) {
    console.error("상품 저장 실패:", error);
    alert(error.data?.detail || "상품 저장에 실패했습니다.");
  }
};

// 수정 모드: 기존 데이터 불러오기
const loadProductData = async () => {
  if (!isEditMode) return;

  try {
    const product = await getProductDetail(productId);

    // 폼에 데이터 채우기
    $productName.value = product.name;
    $nameCount.textContent = product.name.length;
    $productPrice.value = product.price;
    $shippingMethod.value = product.shipping_method;
    $shippingFee.value = product.shipping_fee;
    $productStock.value = product.stock;
    $productInfo.value = product.info;

    // 배송방법 버튼 활성화
    $methodBtns.forEach((btn) => {
      const isActive = btn.dataset.method === product.shipping_method;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // 이미지 미리보기
    if (product.image) {
      $previewImage.src = product.image;
      $previewImage.classList.add("active");
      $uploadPlaceholder.style.display = "none";
    }

    // 페이지 타이틀 변경
    document.querySelector(".page-title").textContent = "상품 수정";
    document.title = "상품 수정 - HODU 판매자 센터";
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    alert("상품 정보를 불러올 수 없습니다.");
    window.location.href = "/pages/seller/";
  }
};

// 취소 버튼
const initCancel = () => {
  $cancelBtn.addEventListener("click", () => {
    if (confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")) {
      window.location.href = "/pages/seller/";
    }
  });
};

// 초기화
const init = () => {
  if (!checkAuth()) return;

  initImageUpload();
  initNameCount();
  initShippingMethod();
  initCancel();

  $form.addEventListener("submit", handleSubmit);

  // 수정 모드면 데이터 불러오기
  loadProductData();
  renderFooter('#footer');
  
};

document.addEventListener("DOMContentLoaded", init);
