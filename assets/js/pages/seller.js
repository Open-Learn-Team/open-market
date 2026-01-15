// 판매자 센터 JS
import { 
  isLoggedIn, 
  getUserType, 
  getUserInfo,
  getSellerProducts, 
  deleteProduct 
} from '/utils/api.js';

// DOM 요소
const $storeName = document.getElementById('storeName');
const $productCount = document.getElementById('productCount');
const $productList = document.getElementById('productList');
const $emptyState = document.getElementById('emptyState');
const $deleteModal = document.getElementById('deleteModal');
const $cancelDelete = document.getElementById('cancelDelete');
const $confirmDelete = document.getElementById('confirmDelete');

// 삭제할 상품 ID 저장
let deleteTargetId = null;

// 가격 포맷
const formatPrice = (price) => Number(price).toLocaleString('ko-KR');

// 권한 체크
const checkAuth = () => {
  if (!isLoggedIn()) {
    alert('로그인이 필요합니다.');
    window.location.href = '/pages/login/';
    return false;
  }
  
  if (getUserType() !== 'SELLER') {
    alert('판매자만 접근할 수 있습니다.');
    window.location.href = '/';
    return false;
  }
  
  return true;
};

// 상품 목록 불러오기
const loadProducts = async () => {
  try {
    const userInfo = getUserInfo();
    const sellerName = userInfo?.name;
    
    if (!sellerName) {
      console.error('판매자 이름을 찾을 수 없습니다.');
      return;
    }
    
    // 스토어명 표시
    $storeName.textContent = userInfo?.store_name || sellerName;
    
    // 판매자 상품 불러오기
    const data = await getSellerProducts(sellerName);
    
    // 상품 개수 표시
    $productCount.textContent = data.count || 0;
    
    if (data.results?.length > 0) {
      renderProducts(data.results);
      $emptyState.style.display = 'none';
    } else {
      $productList.innerHTML = '';
      $emptyState.style.display = 'block';
    }
  } catch (error) {
    console.error('상품 로딩 실패:', error);
    $productList.innerHTML = '';
    $emptyState.style.display = 'block';
  }
};

// 상품 목록 렌더링
const renderProducts = (products) => {
  $productList.innerHTML = products.map(product => `
    <tr data-id="${product.id}">
      <td>
        <div class="product-info">
          <img src="${product.image}" alt="${product.name}">
          <div class="info">
            <span class="name">${product.name}</span>
            <span class="stock">재고: ${product.stock}개</span>
          </div>
        </div>
      </td>
      <td class="product-price">${formatPrice(product.price)}원</td>
      <td>
        <button type="button" class="btn-edit" data-id="${product.id}">수정</button>
      </td>
      <td>
        <button type="button" class="btn-delete" data-id="${product.id}">삭제</button>
      </td>
    </tr>
  `).join('');
  
  // 이벤트 바인딩
  bindProductEvents();
};

// 상품 버튼 이벤트
const bindProductEvents = () => {
  // 수정 버튼
  $productList.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      window.location.href = `/pages/seller/upload/?id=${productId}`;
    });
  });
  
  // 삭제 버튼
  $productList.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTargetId = btn.dataset.id;
      $deleteModal.classList.add('active');
    });
  });
};

// 삭제 모달 이벤트
const initModalEvents = () => {
  // 취소 버튼
  $cancelDelete.addEventListener('click', () => {
    deleteTargetId = null;
    $deleteModal.classList.remove('active');
  });
  
  // 삭제 확인 버튼
  $confirmDelete.addEventListener('click', async () => {
    if (!deleteTargetId) return;
    
    try {
      await deleteProduct(deleteTargetId);
      alert('상품이 삭제되었습니다.');
      $deleteModal.classList.remove('active');
      deleteTargetId = null;
      loadProducts(); // 새로고침
    } catch (error) {
      alert('삭제에 실패했습니다.');
      console.error(error);
    }
  });
  
  // 모달 외부 클릭
  $deleteModal.addEventListener('click', (e) => {
    if (e.target === $deleteModal) {
      deleteTargetId = null;
      $deleteModal.classList.remove('active');
    }
  });
};

// 사이드바 메뉴 이벤트
const initSidebar = () => {
  const menuItems = document.querySelectorAll('.sidebar-nav a');
  
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // active 클래스 이동
      menuItems.forEach(i => i.parentElement.classList.remove('active'));
      item.parentElement.classList.add('active');
      
      // 메뉴별 동작 (추후 구현)
      const menu = item.dataset.menu;
      console.log('선택된 메뉴:', menu);
    });
  });
};

// 초기화
const init = () => {
  if (!checkAuth()) return;
  
  initModalEvents();
  initSidebar();
  loadProducts();
};

document.addEventListener('DOMContentLoaded', init);