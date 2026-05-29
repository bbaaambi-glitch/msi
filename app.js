// Nav scroll + back-to-top
const nav = document.getElementById('nav');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 50);
  backToTop.classList.toggle('visible', y > 400);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
});
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

// ===========================
// MAP DATA
// ===========================
const TYPE_COLORS = {
  transport: '#0bc4e3',
  food:      '#f97316',
  shopping:  '#22c55e',
  esports:   '#a855f7',
  msi:       '#c89b3c',
  stay:      '#ec4899',
  theme:     '#ef4444',
};

const DAY_DATA = {
  1: {
    center: [37.555, 127.00], zoom: 11,
    locations: [
      { name: '仁川機場 T2', coords: [37.4602, 126.4407], type: 'transport', time: '16:50' },
      { name: '明洞 樂天百貨 HOKA', coords: [37.5633, 126.9826], type: 'shopping', time: '18:00 早出關' },
      { name: '安國洞 / 韓屋酒店 Dam', coords: [37.5794, 126.9847], type: 'stay', time: '19:30' },
      { name: '益善洞 Ikseon Aetteut', coords: [37.5748, 126.9922], type: 'food', time: '20:00' },
    ],
  },
  2: {
    center: [37.40, 127.10], zoom: 10,
    locations: [
      { name: '鍾路 3 街站（穿梭巴士）', coords: [37.5706, 126.9919], type: 'transport', time: '09:30' },
      { name: '愛寶樂園', coords: [37.2941, 127.2014], type: 'theme', time: '10:40' },
      { name: '明洞 HOKA', coords: [37.5633, 126.9826], type: 'shopping', time: '19:30' },
    ],
    routes: [
      { coords: [[37.5706, 126.9919], [37.2941, 127.2014]], color: '#0bc4e3' },
      { coords: [[37.2941, 127.2014], [37.5633, 126.9826]], color: '#0bc4e3' },
    ],
  },
  3: {
    center: [36.95, 127.25], zoom: 8,
    locations: [
      { name: 'LoL Park + Riot Store', coords: [37.5706, 126.9919], type: 'esports', time: '11:00' },
      { name: '首爾站（寄行李）', coords: [37.5547, 126.9707], type: 'transport', time: '11:05' },
      { name: '大田站', coords: [36.3519, 127.3849], type: 'transport', time: '12:50 KTX' },
      { name: '大善刀切麵', coords: [36.3554, 127.3840], type: 'food', time: '13:00' },
      { name: 'DCC 大田會展中心', coords: [36.3766, 127.3872], type: 'msi', time: '下午' },
    ],
    routes: [
      { coords: [[37.5547, 126.9707], [36.3519, 127.3849]], color: '#c89b3c', dash: '10, 6' },
    ],
  },
  4: {
    center: [36.345, 127.40], zoom: 13,
    locations: [
      { name: '聖心堂麵包', coords: [36.3282, 127.4268], type: 'food', time: '早上 08:00' },
      { name: 'DCC 大決賽', coords: [36.3766, 127.3872], type: 'msi', time: '下午' },
      { name: 'Lotte Mart 儒城店', coords: [36.3570, 127.3341], type: 'shopping', time: '賽後' },
    ],
  },
  5: {
    center: [37.10, 127.10], zoom: 8,
    locations: [
      { name: '大田站 KTX', coords: [36.3519, 127.3849], type: 'transport', time: '10:30' },
      { name: '首爾站 樂天超市', coords: [37.5547, 126.9707], type: 'shopping', time: '11:30' },
      { name: '仁川機場 T2', coords: [37.4602, 126.4407], type: 'transport', time: '12:30 AREX' },
    ],
    routes: [
      { coords: [[36.3519, 127.3849], [37.5547, 126.9707]], color: '#c89b3c', dash: '10, 6' },
      { coords: [[37.5547, 126.9707], [37.4602, 126.4407]], color: '#0bc4e3' },
    ],
  },
};

// ===========================
// INIT LEAFLET MAP
// ===========================
const map = L.map('trip-map', { zoomControl: true, attributionControl: false });

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
}).addTo(map);

L.control.attribution({ prefix: '© OpenStreetMap © CartoDB' }).addTo(map);

let mapLayers = [];

function clearMap() {
  mapLayers.forEach(l => map.removeLayer(l));
  mapLayers = [];
}

function createPin(color, num) {
  return L.divIcon({
    html: `<div class="map-pin" style="background:${color}">${num}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

function renderDay(dayNum) {
  clearMap();
  const data = DAY_DATA[dayNum];
  if (!data) return;

  // Route polylines
  if (data.routes) {
    data.routes.forEach(r => {
      const line = L.polyline(r.coords, {
        color: r.color || '#0bc4e3',
        weight: 2.5,
        dashArray: r.dash || '6, 4',
        opacity: 0.7,
      }).addTo(map);
      mapLayers.push(line);
    });
  }

  // Markers
  data.locations.forEach((loc, i) => {
    const color = TYPE_COLORS[loc.type] || '#ffffff';
    const marker = L.marker(loc.coords, { icon: createPin(color, i + 1) })
      .bindPopup(`
        <div class="popup-name">${i + 1}. ${loc.name}</div>
        <div class="popup-time">${loc.time}</div>
      `, { maxWidth: 200 })
      .addTo(map);
    mapLayers.push(marker);
  });

  map.setView(data.center, data.zoom, { animate: true, duration: 0.6 });
}

// ===========================
// ITINERARY TABS
// ===========================
const tabs = document.querySelectorAll('.itab');
const days = document.querySelectorAll('.iday');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const dayNum = parseInt(tab.dataset.day);
    tabs.forEach(t => t.classList.remove('active'));
    days.forEach(d => d.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`day-${dayNum}`).classList.add('active');
    renderDay(dayNum);
    map.invalidateSize();
  });
});

// Initialize map with Day 1
map.whenReady(() => {
  renderDay(1);
});

// ===========================
// CHECKLIST
// ===========================
const TOTAL = 8;
function toggleCheck(id) {
  const el = document.getElementById(id);
  const card = el.closest('.cl-card');
  const checked = el.classList.toggle('checked');
  card.classList.toggle('cl-done', checked);
  const done = document.querySelectorAll('.cl-status.checked').length;
  document.getElementById('clProgressText').textContent = `${done} / ${TOTAL}`;
  document.getElementById('clProgressFill').style.width = `${(done / TOTAL) * 100}%`;
}

// ===========================
// SCROLL REVEAL
// ===========================
const revealStyle = document.createElement('style');
revealStyle.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(revealStyle);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.flight__card, .cl-card, .iday__header').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.4s ease ${(i % 6) * 0.07}s, transform 0.4s ease ${(i % 6) * 0.07}s`;
  observer.observe(el);
});
