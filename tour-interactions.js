(() => {
  const init = () => {
    const section = document.querySelector('.packages');
    const grid = document.querySelector('.package-grid');
    const head = section?.querySelector('.head');
    if (!section || !grid || !head || section.dataset.tourReady) return;
    section.dataset.tourReady = 'true';
    const backdrop = document.createElement('div');
    backdrop.className = 'tour-focus-backdrop';
    document.body.appendChild(backdrop);
    const controls = document.createElement('div');
    controls.className = 'tour-arrows';
    controls.innerHTML = '<button class="tour-arrow" type="button" aria-label="Gói tour trước">←</button><button class="tour-arrow" type="button" aria-label="Gói tour tiếp theo">→</button>';
    head.appendChild(controls);
    const cards = [...grid.querySelectorAll('.package-card')];
    const close = card => { card?.classList.remove('is-expanded'); section.classList.remove('has-expanded'); backdrop.classList.remove('is-open'); document.body.classList.remove('tour-modal-open'); };
    cards.forEach(card => {
      card.tabIndex = 0;
      const copy = document.createElement('div'); copy.className = 'card-expand-copy';
      copy.textContent = 'Xem lịch trình, dịch vụ bao gồm và nhận tư vấn riêng cho gói ' + (card.querySelector('h3')?.textContent || 'tour') + '.';
      card.appendChild(copy);
      card.addEventListener('click', event => {
        if (event.target.closest('button')) return;
        const open = card.classList.contains('is-expanded');
        cards.forEach(item => item.classList.remove('is-active'));
        if (open) { close(card); return; }
        card.classList.add('is-expanded'); section.classList.add('has-expanded'); backdrop.classList.add('is-open'); document.body.classList.add('tour-modal-open'); card.setAttribute('aria-expanded', 'true');
      });
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } });
    });
    backdrop.addEventListener('click', () => close(grid.querySelector('.is-expanded')));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(grid.querySelector('.is-expanded')); });
    controls.querySelector('.tour-arrow:first-child').addEventListener('click', () => grid.scrollBy({ left: -grid.clientWidth * .82, behavior: 'smooth' }));
    controls.querySelector('.tour-arrow:last-child').addEventListener('click', () => grid.scrollBy({ left: grid.clientWidth * .82, behavior: 'smooth' }));
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { section.classList.add('is-revealed'); reveal.disconnect(); } }), { threshold: .2 });
    reveal.observe(section);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
