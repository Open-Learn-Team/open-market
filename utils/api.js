const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

// ─────────────────────────────
// 토큰 관리
// ─────────────────────────────
export const getToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const setTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const removeTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info");
};

// ─────────────────────────────
// 유저 정보
// ─────────────────────────────
export const setUserInfo = (info) =>
  localStorage.setItem("user_info", JSON.stringify(info));

export const getUserInfo = () => {
  const info = localStorage.getItem("user_info");
  return info ? JSON.parse(info) : null;
};

export const isLoggedIn = () => !!getToken();
export const getUserType = () => getUserInfo()?.user_type || null;

// ─────────────────────────────
// Access Token Refresh
// ─────────────────────────────
const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${BASE_URL}/accounts/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// ─────────────────────────────
// JSON 요청 전용 fetch (기존 fetchAPI)
// ─────────────────────────────
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        config.headers["Authorization"] = `Bearer ${getToken()}`;
        return fetch(`${BASE_URL}${endpoint}`, config).then(async (r) => {
          if (r.status === 204) return null;
          const ct = r.headers.get("content-type") || "";
          return ct.includes("application/json") ? r.json() : r.text();
        });
      }
      removeTokens();
      window.location.href = "/pages/login/";
      return null;
    }

    // 204 No Content 처리 (DELETE에서 자주 나옴)
    if (res.status === 204) return null;

    // JSON이 아닐 수도 있으니 안전하게 파싱
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) throw { status: res.status, data };
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// ─────────────────────────────
// FormData 요청 전용 fetch (이미지 업로드/수정용)
// ─────────────────────────────
// FormData 사용 시 Content-Type을 직접 지정하면 안 됩니다(boundary 문제)
const fetchFormAPI = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        config.headers.Authorization = `Bearer ${getToken()}`;
        const retryRes = await fetch(`${BASE_URL}${endpoint}`, config);
        const retryData = await retryRes.json();
        if (!retryRes.ok) throw { status: retryRes.status, data: retryData };
        return retryData;
      }

      removeTokens();
      window.location.href = "/pages/login/";
      return null;
    }

    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
  } catch (err) {
    console.error("Form API Error:", err);
    throw err;
  }
};

// ─────────────────────────────
// 로그인/로그아웃
// ─────────────────────────────
export const login = async (username, password) => {
  const res = await fetch(`${BASE_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };

  setTokens(data.access, data.refresh);
  setUserInfo(data.user);
  return data;
};

export const logout = () => {
  removeTokens();
  window.location.href = "/";
};

// ─────────────────────────────
// 회원가입
// ─────────────────────────────
export const signupBuyer = (userData) =>
  fetchAPI("/accounts/buyer/signup/", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const signupSeller = (userData) =>
  fetchAPI("/accounts/seller/signup/", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const validateUsername = (username) =>
  fetchAPI("/accounts/validate-username/", {
    method: "POST",
    body: JSON.stringify({ username }),
  });

export const validateCompanyNumber = (number) =>
  fetchAPI("/accounts/seller/validate-registration-number/", {
    method: "POST",
    body: JSON.stringify({ company_registration_number: number }),
  });

// ─────────────────────────────
// 상품
// ─────────────────────────────
export const getProducts = (page = 1) => fetchAPI(`/products/?page=${page}`);

export const searchProducts = (query) =>
  fetchAPI(`/products/?search=${encodeURIComponent(query)}`);

export const getProductDetail = (id) => fetchAPI(`/products/${id}/`);

// ─────────────────────────────
// 장바구니 (BUYER)
// ─────────────────────────────
// 장바구니
// 목록 보기
export const getCart = () => fetchAPI("/cart/");
// 물건 넣기
export const addToCart = (productId, quantity) =>
  fetchAPI("/cart/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
// 디테일
export const cartDetail = (id) => fetchAPI(`/cart/${id}/`, { method: "GET" });
// 수량 수정하기
export const updateCartItem = (id, quantity) =>
  fetchAPI(`/cart/${id}/`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
//개별 삭제하기
export const deleteCartItem = (id) =>
  fetchAPI(`/cart/${id}/`, { method: "DELETE" });
// 전체 삭제하기
export const deleteCartAll = () => fetchAPI("/cart/", { method: "DELETE" });

// ─────────────────────────────
// 주문 (BUYER)
// ─────────────────────────────
// direct_order에서 order_kind vs order_type은 명세에 혼용이 있어 확실하지 않음.
// 지금은 네 기존 코드 유지(order_kind)로 둠.
export const createDirectOrder = (orderData) =>
  fetchAPI("/order/", {
    method: "POST",
    body: JSON.stringify({ order_kind: "direct_order", ...orderData }),
  });

export const createCartOrder = (orderData) =>
  fetchAPI("/order/", {
    method: "POST",
    body: JSON.stringify({ order_type: "cart_order", ...orderData }),
  });

export const getOrders = () => fetchAPI("/order/");

// ─────────────────────────────
// ========== 판매자 기능 ==========
// ─────────────────────────────

// 판매자 상품 불러오기 (seller name 기반)
export const getSellerProducts = (sellerName) =>
  fetchAPI(`/${encodeURIComponent(sellerName)}/products/`);

// 상품 등록 (FormData)
export const createProduct = (formData) =>
  fetchFormAPI("/products/", {
    method: "POST",
    body: formData,
  });

// 상품 수정 (FormData)
export const updateProduct = (id, formData) =>
  fetchFormAPI(`/products/${id}/`, {
    method: "PUT",
    body: formData,
  });

// 상품 삭제 (JSON wrapper 사용)
export const deleteProduct = (id) =>
  fetchAPI(`/products/${id}/`, { method: "DELETE" });
