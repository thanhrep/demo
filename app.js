const theme = document.createElement('link'); theme.rel = 'stylesheet'; theme.href = 'natural-theme.css'; document.head.appendChild(theme);
const salesLayout = document.createElement('link'); salesLayout.rel = 'stylesheet'; salesLayout.href = 'natural-sales-layout.css'; document.head.appendChild(salesLayout);
const mobilePolish = document.createElement('link'); mobilePolish.rel = 'stylesheet'; mobilePolish.href = 'mobile-polish.css'; document.head.appendChild(mobilePolish);
const nav = document.querySelector('.nav');
const menu = document.querySelector('#menu');
const links = document.querySelector('#navigation');
function closeMenu() {
  links.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', closeMenu);
document.querySelectorAll('.choose-package').forEach(button => {
  button.addEventListener('click', () => {
    const select = document.querySelector('#package');
    select.value = [...select.options].find(option => option.textContent.startsWith(button.dataset.package))?.value || '';
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.querySelector('#start').focus(), 600);
  });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); menu.focus(); } });
document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });
const updateNav = () => nav.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', updateNav, { passive: true });
updateNav();
const slides = [...document.querySelectorAll('.slides img')];
document.querySelectorAll('main img').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });
document.querySelectorAll('img').forEach(img => {
  if (!img.alt) img.alt = img.closest('.brand') ? 'Sky Ha Giang Loop' : 'Mountain landscape';
  const fallback = () => { img.onerror = null; img.src = 'assets/page-background.jpg'; };
  img.onerror = fallback;
  if (img.complete && !img.naturalWidth) fallback();
});
const backgroundImages = ['assets/bg-01.jpg','assets/bg-02.jpg','assets/bg-03.jpg','assets/bg-04.jpg','assets/bg-05.jpg','assets/bg-06.jpg','assets/bg-07.jpg','assets/bg-08.jpg'];
const scene = document.querySelector('.scene-bg');
let sceneIndex = 0;
function rotateBackground() {
  scene.style.backgroundImage = 'url("' + backgroundImages[sceneIndex] + '")';
  sceneIndex = (sceneIndex + 1) % backgroundImages.length;
}
rotateBackground();
setInterval(rotateBackground, 9000);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
slides[0].classList.add('active');
let paused = false;
function setMotion() {
  document.body.classList.toggle('motion-paused', paused);
}
setMotion();
setInterval(() => {
  if (paused || document.hidden) return;
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 7000);
document.querySelector('#form').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const body = 'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nPackage: ' + data.get('package') + '\nStart date: ' + data.get('start') + '\nEnd date: ' + data.get('end') + '\nTravellers: ' + data.get('guests') + '\n\n' + data.get('message');
  const link = document.createElement('a');
  link.href = 'mailto:sky@traverl.com?subject=Ha%20Giang%20trip%20enquiry&body=' + encodeURIComponent(body);
  link.textContent = 'Open email draft';
  const status = document.querySelector('#status');
  status.replaceChildren('Your draft is ready. Send it from your email app: ', link);
});

const packageSection = document.querySelector('.packages');
const packageGrid = document.querySelector('.package-grid');
if (packageSection && packageGrid) {
  const backdrop = document.createElement('div');
  backdrop.className = 'tour-focus-backdrop';
  document.body.appendChild(backdrop);
  const arrows = document.createElement('div');
  arrows.className = 'tour-arrows';
  arrows.innerHTML = '<button class="tour-arrow" type="button" aria-label="Gói tour trước">←</button><button class="tour-arrow" type="button" aria-label="Gói tour tiếp theo">→</button>';
  packageSection.querySelector('.head').appendChild(arrows);
  const cards = [...packageGrid.querySelectorAll('.package-card')];
  cards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    const copy = document.createElement('div'); copy.className = 'card-expand-copy';
    copy.textContent = 'Xem lịch trình, dịch vụ bao gồm và nhận tư vấn riêng cho gói ' + (card.querySelector('h3')?.textContent || 'tour') + '.';
    card.appendChild(copy);
    card.addEventListener('click', event => {
      if (event.target.closest('button')) return;
      if (card.classList.contains('is-expanded')) { closeTour(card); return; }
      cards.forEach(other => other.classList.remove('is-active'));
      card.classList.add('is-expanded'); packageSection.classList.add('has-expanded'); backdrop.classList.add('is-open'); document.body.classList.add('tour-modal-open');
      card.setAttribute('aria-expanded', 'true');
    });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } });
  });
  function closeTour(card) { card.classList.remove('is-expanded'); packageSection.classList.remove('has-expanded'); backdrop.classList.remove('is-open'); document.body.classList.remove('tour-modal-open'); card.removeAttribute('aria-expanded'); }
  backdrop.addEventListener('click', () => { const open = packageGrid.querySelector('.is-expanded'); if (open) closeTour(open); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { const open = packageGrid.querySelector('.is-expanded'); if (open) closeTour(open); } });
  arrows.querySelector('.tour-arrow:first-child').addEventListener('click', () => packageGrid.scrollBy({ left: -packageGrid.clientWidth * .82, behavior: 'smooth' }));
  arrows.querySelector('.tour-arrow:last-child').addEventListener('click', () => packageGrid.scrollBy({ left: packageGrid.clientWidth * .82, behavior: 'smooth' }));
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { packageSection.classList.add('is-revealed'); reveal.disconnect(); } }), { threshold: .2 });
  reveal.observe(packageSection);
}
