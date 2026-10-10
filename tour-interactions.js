(() => {
  const init = () => {
    const section = document.querySelector('.packages');
    const grid = document.querySelector('.package-grid');
    const head = section?.querySelector('.head');
    if (!section || !grid || !head || section.dataset.tourReady) return;
    section.dataset.tourReady = 'true';
    document.querySelectorAll('.tour-focus-backdrop').forEach(node => node.remove());
    const backdrop = document.createElement('div');
    backdrop.className = 'tour-focus-backdrop';
    document.body.appendChild(backdrop);
    document.querySelectorAll('.tour-arrows').forEach(node => node.remove());
    const controls = document.createElement('div');
    controls.className = 'tour-arrows';
    controls.innerHTML = '<button class="tour-arrow" type="button" aria-label="Gói tour trước">←</button><button class="tour-arrow" type="button" aria-label="Gói tour tiếp theo">→</button>';
    head.appendChild(controls);
    const dedupe = new MutationObserver(() => { const nodes = [...document.querySelectorAll('.tour-arrows')]; nodes.slice(1).forEach(node => node.remove()); });
    dedupe.observe(head, { childList: true });
    setTimeout(() => dedupe.disconnect(), 15000);
    if (grid.querySelectorAll('.package-card').length < 5) {
      const extra = document.createElement('article');
      extra.className = 'package-card demo';
      extra.innerHTML = '<span class="tag">5 ngày / 4 đêm</span><h3>HÀNH TRÌNH GIA ĐÌNH</h3><p>Nhịp đi chậm, phòng gia đình, trải nghiệm bản địa và các điểm dừng dễ đi.</p><strong>từ 295 đô la Mỹ <small>/người</small></strong><button class="pill choose-package" type="button" data-package="Family Escape">Chọn gói</button>';
      grid.appendChild(extra);
      const select = document.querySelector('#package');
      if (select && ![...select.options].some(option => option.value === 'Family Escape')) select.add(new Option('Hành trình gia đình — từ 295 đô la Mỹ/người', 'Family Escape'));
    }
    const cards = [...grid.querySelectorAll('.package-card')];
    const close = card => { card?.classList.remove('is-expanded'); section.classList.remove('has-expanded'); backdrop.classList.remove('is-open'); document.body.classList.remove('tour-modal-open'); };
    cards.forEach(card => {
      card.tabIndex = 0;
      const copy = document.createElement('div'); copy.className = 'card-expand-copy';
      copy.textContent = 'Xem lịch trình, dịch vụ bao gồm và nhận tư vấn riêng cho gói ' + (card.querySelector('h3')?.textContent || 'tour') + '.';
      card.appendChild(copy);
      card.addEventListener('click', event => {
        if (event.target.closest('button')) return;
        event.stopImmediatePropagation();
        cards.forEach(item => item.classList.remove('is-active'));
        if (card.classList.contains('is-expanded')) { close(card); return; }
        card.classList.add('is-expanded'); section.classList.add('has-expanded'); backdrop.classList.add('is-open'); document.body.classList.add('tour-modal-open'); card.setAttribute('aria-expanded', 'true');
      }, true);
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } });
      card.querySelector('.choose-package')?.addEventListener('click', event => { event.stopPropagation(); const select = document.querySelector('#package'); if (select) select.value = card.querySelector('.choose-package').dataset.package; document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); });
    });
    backdrop.addEventListener('click', () => close(grid.querySelector('.is-expanded')));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(grid.querySelector('.is-expanded')); });
    let carouselIndex = 0;
    const moveGrid = direction => {
      const gridRect = grid.getBoundingClientRect();
      const visibleIndex = cards.findIndex(card => {
        const rect = card.getBoundingClientRect();
        return rect.right > gridRect.left + 2 && rect.left < gridRect.right - 2;
      });
      carouselIndex = Math.max(0, Math.min(cards.length - 1, Math.max(0, visibleIndex) + direction));
      const cardRect = cards[carouselIndex].getBoundingClientRect();
      const desired = grid.scrollLeft + cardRect.left - gridRect.left - 12;
      const target = Math.max(0, Math.min(desired, grid.scrollWidth - grid.clientWidth));
      cards.forEach(item => item.classList.remove('is-active'));
      cards[carouselIndex].classList.add('is-active');
      grid.scrollTo({ left: target, behavior: 'smooth' });
      setTimeout(() => cards[carouselIndex]?.classList.remove('is-active'), 700);
    };
    controls.querySelector('.tour-arrow:first-child').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); moveGrid(-1); });
    controls.querySelector('.tour-arrow:last-child').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); moveGrid(1); });
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { section.classList.add('is-revealed'); reveal.disconnect(); } }), { threshold: .2 });
    reveal.observe(section);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
