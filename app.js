// Nav scroll effect
const nav = document.getElementById('nav');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 50);
  backToTop.classList.toggle('visible', y > 400);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Checklist
const TOTAL = 8;

function toggleCheck(id) {
  const el = document.getElementById(id);
  const card = el.closest('.cl-card');
  const checked = el.classList.toggle('checked');
  card.classList.toggle('cl-done', checked);
  updateProgress();
}

function updateProgress() {
  const done = document.querySelectorAll('.cl-status.checked').length;
  document.getElementById('clProgressText').textContent = `${done} / ${TOTAL}`;
  document.getElementById('clProgressFill').style.width = `${(done / TOTAL) * 100}%`;
}

// Scroll reveal animation
const style = document.createElement('style');
style.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.flight__card, .tl-card, .cl-card, .day__heading'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = `opacity 0.45s ease ${(i % 8) * 0.055}s, transform 0.45s ease ${(i % 8) * 0.055}s`;
  observer.observe(el);
});
