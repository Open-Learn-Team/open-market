const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

// 토큰 관리
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

// 유저 정보
export const setUserInfo = (info) =>
  localStorage.setItem("user_info", JSON.stringify(info));
export const getUserInfo = () => {
  const info = localStorage.getItem("user_info");
  return info ? JSON.parse(info) : null;
};
export const isLoggedIn = () => !!getToken();
export const getUserType = () => getUserInfo()?.user_type || null;

// API 요청
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
        return fetch(`${BASE_URL}${endpoint}`, config).then((r) => r.json());
      }
      removeTokens();
      window.location.href = "/pages/login/";
      return null;
    }

    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

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

// 로그인/로그아웃
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

// 회원가입
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
    body: JSON.stringify({
      company_registration_number: number,
    }),
  });

// 상품
export const getProducts = (page = 1) => fetchAPI(`/products/?page=${page}`);
export const searchProducts = (query) =>
  fetchAPI(`/products/?search=${encodeURIComponent(query)}`);
export const getProductDetail = (id) => fetchAPI(`/products/${id}/`);

// 장바구니
export const getCart = () => fetchAPI("/cart/");
export const addToCart = (productId, quantity) =>
  fetchAPI("/cart/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
export const updateCartItem = (id, quantity) =>
  fetchAPI(`/cart/${id}/`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
export const deleteCartItem = (id) =>
  fetchAPI(`/cart/${id}/`, { method: "DELETE" });

// 주문
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
