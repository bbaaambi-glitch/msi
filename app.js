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
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-label', navLinks.classList.contains('open') ? '메뉴 닫기' : '메뉴 열기');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Itinerary tabs
const tabs = document.querySelectorAll('.itab');
const days = document.querySelectorAll('.iday');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const dayNum = tab.dataset.day;
    tabs.forEach(t => t.classList.remove('active'));
    days.forEach(d => d.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`day-${dayNum}`).classList.add('active');
  });
});

// Intersection Observer for fade-in animations
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.about__card, .phase, .venue__card, .food__card, .transport__card, .tip__card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  observer.observe(el);
});

document.addEventListener('animationstart', () => {}, { once: true });

// Apply in-view class
const style = document.createElement('style');
style.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
