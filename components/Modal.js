let modalEl = null;

const createModal = (message, onConfirm, onCancel) => {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <article class="modal">
      <button type="button" class="modal-close" aria-label="닫기">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 4l14 14M18 4L4 18" stroke="#c4c4c4" stroke-width="2"/>
        </svg>
      </button>
      <p class="modal-msg">${message}</p>
      <div class="modal-btns">
        <button type="button" class="btn-cancel">아니오</button>
        <button type="button" class="btn-confirm">예</button>
      </div>
    </article>
  `;

  modal.querySelector('.modal-close').onclick = () => closeModal(onCancel);
  modal.querySelector('.btn-cancel').onclick = () => closeModal(onCancel);
  modal.querySelector('.btn-confirm').onclick = () => closeModal(onConfirm);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(onCancel);
  });

  return modal;
};

const closeModal = (callback) => {
  modalEl?.remove();
  modalEl = null;
  callback?.();
};

export const showLoginModal = () => {
  if (modalEl) return;
  modalEl = createModal(
    '로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?',
    () => window.location.href = '/pages/login/',
    null
  );
  document.body.appendChild(modalEl);
};

export const showConfirmModal = (message, onConfirm) => {
  if (modalEl) return;
  modalEl = createModal(message, onConfirm, null);
  document.body.appendChild(modalEl);
};

export const showAlertModal = (message) => {
  return new Promise((resolve) => {
    if (modalEl) {
      resolve();
      return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <article class="modal">
        <button type="button" class="modal-close" aria-label="닫기">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4l14 14M18 4L4 18" stroke="#c4c4c4" stroke-width="2"/>
          </svg>
        </button>
        <p class="modal-msg">${message}</p>
        <div class="modal-btns">
          <button type="button" class="btn-confirm only">확인</button>
        </div>
      </article>
    `;
    
    const closeAlertModal = () => {
      modal.remove();
      modalEl = null;
      resolve();
    };
    
    modal.querySelector('.modal-close').onclick = closeAlertModal;
    modal.querySelector('.btn-confirm').onclick = closeAlertModal;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAlertModal();
    });
    
    modalEl = modal;
    document.body.appendChild(modal);
  });
};

export const initModalListeners = () => {
  window.addEventListener('showLoginModal', showLoginModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl) closeModal();
  });
};