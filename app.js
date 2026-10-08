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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); menu.focus(); } });
document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });
const updateNav = () => nav.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', updateNav, { passive: true });
updateNav();
const slides = [...document.querySelectorAll('.slides img')];
const landscape = [
  'https://cdnphoto.dantri.com.vn/SPHeG0xgZIfVFbx2pip8LjD3yyY%3D/thumb_w/990/2021/07/01/207644897175849684504427969722800068904751n-1625130463593.jpg',
  'https://media.vanverre.nl/landscape2/product2/Vietnam%20-%20Ha%20Giang%20-%2010.jpg',
  'https://vietnamtrustcarrentals.com/vnt_upload/news/01_2025/Ma-Pi-Leng-Pass.jpg',
  'https://media.mia.vn/uploads/blog-du-lich/hanh-trinh-lang-thang-ha-giang-bang-xe-may-day-thu-vi-15-1668444071.jpg'
];
document.querySelectorAll('.card img').forEach((img, i) => { img.src = landscape[i]; });
const gallery = [...document.querySelectorAll('.gallery img')];
gallery.forEach((img, i) => { img.src = landscape[i]; });
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
const motion = document.querySelector('.motion-toggle');
let paused = false;
function setMotion() {
  document.body.classList.toggle('motion-paused', paused);
  motion.setAttribute('aria-pressed', String(paused));
  motion.textContent = paused ? 'Resume motion' : 'Pause motion';
}
motion.addEventListener('click', () => { paused = !paused; setMotion(); });
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
  const body = 'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\n\n' + data.get('message');
  const link = document.createElement('a');
  link.href = 'mailto:hagiangmotorbiketour@gmail.com?subject=Ha%20Giang%20trip%20enquiry&body=' + encodeURIComponent(body);
  link.textContent = 'Open email draft';
  const status = document.querySelector('#status');
  status.replaceChildren('Your draft is ready. Send it from your email app: ', link);
});
