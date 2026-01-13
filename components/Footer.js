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
              <img src="/assets/images/icon-insta.svg" alt="" width="32" height="32">
            </a>
          </li>
          <li>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="페이스북">
              <img src="/assets/images/icon-fb.svg" alt="" width="32" height="32">
            </a>
          </li>
          <li>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="유튜브">
              <img src="/assets/images/icon-yt.svg" alt="" width="32" height="32">
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