// Theme styles load in the head, before responsive overrides, for a stable cascade.
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

