export const createFooter = () => {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  footer.innerHTML = `
    <section class="footer-inner">
      <article class="footer-top">
        <nav>
          <ul class="footer-links">
            <li><a href="#">호두샵 소개</a></li>
            <li><a href="#">이용약관</a></li>
            <li><a href="#" class="bold">개인정보처리방침</a></li>
            <li><a href="#">전자금융거래약관</a></li>
            <li><a href="#">청소년보호정책</a></li>
            <li><a href="#">제휴문의</a></li>
          </ul>
        </nav>
        <ul class="social-links">
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="인스타그램">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#767676"/>
                <rect x="8" y="8" width="16" height="16" rx="4" stroke="#F2F2F2" stroke-width="1.5"/>
                <circle cx="16" cy="16" r="4" stroke="#F2F2F2" stroke-width="1.5"/>
                <circle cx="21" cy="11" r="1" fill="#F2F2F2"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="페이스북">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#767676"/>
                <path d="M18 12h2V9h-2.5A3.5 3.5 0 0014 12.5V14h-2v3h2v7h3v-7h2.5l.5-3h-3v-1.5c0-.28.22-.5.5-.5H18z" fill="#F2F2F2"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="유튜브">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#767676"/>
                <path d="M24.5 12.5c-.2-.9-.9-1.6-1.8-1.8-1.6-.4-6.7-.4-6.7-.4s-5.1 0-6.7.4c-.9.2-1.6.9-1.8 1.8-.4 1.6-.4 3.5-.4 3.5s0 1.9.4 3.5c.2.9.9 1.6 1.8 1.8 1.6.4 6.7.4 6.7.4s5.1 0 6.7-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.5.4-3.5s0-1.9-.4-3.5z" fill="#F2F2F2"/>
                <path d="M14 19v-6l5 3-5 3z" fill="#767676"/>
              </svg>
            </a>
          </li>
        </ul>
      </article>

      <address class="company-info">
        <strong>(주)HODU SHOP</strong>
        <p>제주특별자치도 제주시 동광로 137 제주코딩베이스캠프</p>
        <p>사업자 번호 : 000-0000-0000 | 통신판매업</p>
        <p>대표 : 김호두</p>
      </address>
    </section>
  `;

  return footer;
};

export const renderFooter = (container) => {
  const el = createFooter();
  if (typeof container === 'string') {
    document.querySelector(container)?.append(el);
  } else {
    container?.append(el);
  }
  return el;
};