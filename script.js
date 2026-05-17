// ============= NAVIGATION =============
function goPage(name) {
  console.log('[goPage] Navigating to:', name);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    console.log('[goPage] Activated:', target.id);
  } else {
    console.error('[goPage] Page not found: page-' + name);
    return false;
  }
  // Sync header nav active state
  document.querySelectorAll('nav.main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });
  // Update URL hash so user sees page changed and can bookmark
  if (window.location.hash !== '#' + name) {
    history.pushState({page: name}, '', '#' + name);
  }
  // Close fullscreen menu when navigating
  closeFsMenu();
  // Close lang menu
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return false;
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  const name = window.location.hash.replace('#', '') || 'home';
  goPage(name);
});

// Read hash on load
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    goPage(hash);
  }
});

// ============= FULLSCREEN MENU =============
function openFsMenu() {
  const menu = document.getElementById('fsMenu');
  const burger = document.getElementById('burgerBtn');
  if (!menu) return;
  menu.classList.add('open');
  menu.setAttribute('aria-hidden', 'false');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}
function closeFsMenu() {
  const menu = document.getElementById('fsMenu');
  const burger = document.getElementById('burgerBtn');
  if (!menu) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
function toggleFsMenu() {
  const menu = document.getElementById('fsMenu');
  if (!menu) return;
  if (menu.classList.contains('open')) closeFsMenu();
  else openFsMenu();
}

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleFsMenu);

  // Search toggle
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      const isOpen = searchPanel.classList.toggle('open');
      searchPanel.setAttribute('aria-hidden', !isOpen);
      if (isOpen && searchInput) setTimeout(() => searchInput.focus(), 150);
    });
  }
  if (searchClose && searchPanel) {
    searchClose.addEventListener('click', () => {
      searchPanel.classList.remove('open');
      searchPanel.setAttribute('aria-hidden', 'true');
    });
  }

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeFsMenu();
      const langMenu = document.getElementById('langMenu');
      if (langMenu) langMenu.classList.remove('open');
      if (searchPanel) {
        searchPanel.classList.remove('open');
        searchPanel.setAttribute('aria-hidden', 'true');
      }
    }
  });
});

// ============= LANGUAGE PICKER =============
document.addEventListener('click', e => {
  const toggle = e.target.closest('#langToggle');
  const wrap = e.target.closest('.lang-wrap');
  const menu = document.getElementById('langMenu');
  if (!menu) return;

  if (toggle) {
    e.preventDefault();
    e.stopPropagation();
    menu.classList.toggle('open');
    document.getElementById('langToggle').setAttribute('aria-expanded', menu.classList.contains('open'));
    return;
  }

  // Click on a language option
  const opt = e.target.closest('.lang-opt');
  if (opt) {
    const lang = opt.dataset.lang;
    document.querySelectorAll('.lang-opt').forEach(o => o.classList.toggle('active', o === opt));
    document.querySelector('.lang-current').textContent = lang;
    menu.classList.remove('open');
    document.getElementById('langToggle').setAttribute('aria-expanded', 'false');
    // RTL toggle for Arabic
    document.documentElement.dir = (lang === 'AR') ? 'rtl' : 'ltr';
    return;
  }

  if (!wrap) menu.classList.remove('open');
});

function goExplore(cat) {
  goPage('explore');
  setTimeout(() => renderExplore(cat), 50);
}

// ============= MODAL =============
function openDetail(title, addr, img, price) {
  // First check if it's a known museum or tour - open inner detail page instead
  if (museumData[title]) { openMuseumDetail(title); return; }
  if (tourData[title]) { openTourDetail(title); return; }
  // Fallback: small modal
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalAddr').innerText = addr || '';
  if (img) document.getElementById('modalImg').src = img;
  if (price) document.getElementById('modalPrice').innerText = price;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ============= MUSEUM DETAIL PAGE =============
const museumData = {
  "Shirvanshah's Palace": {
    crumb: "Shirvanshah's Palace",
    title: "Shirvanshahs' Palace",
    img: "images/shirvanshah_palace.jpg",
    addr: "1st Castle lane, 76 · Old City",
    hours: "10:00–19:00",
    desc: "A 15th-century palace complex built during the reign of Shirvanshah Khalilullah I. The official residence of the Shirvanshah dynasty after the capital moved from Shamakhi to Baku. Inscribed on the UNESCO World Heritage List in 2000.",
    long: "The Shirvanshahs' Palace Complex consists of the main palace building, divan-khana, the personal mausoleum, the Shah's mosque with a minaret, the Bakuvi mausoleum, the palace's east portal, and a row of supplementary structures. The complex represents one of the rare examples of Azerbaijani medieval architecture and forms part of UNESCO's World Heritage Site Old City. Entry: 5–17 year old children (local): 2.00 ₼ · 5–17 year old children (foreign): 12.00 ₼ · Students: 3.00 ₼ · Adults (local): 7.00 ₼ · Adults (foreign): 24.00 ₼ · Audio guide: +10 ₼ (local), 30 ₼ (foreign).",
    era: "VI cent.", exhibits: "5,000+", visitors: "2.5M", area: "22 ha",
    exhibit360: "Throne of Shirvanshahs · 360° view"
  },
  "Shirvanshah's Palace Museum": {
    crumb: "Shirvanshah's Palace",
    title: "Shirvanshahs' Palace",
    img: "images/shirvanshah_palace.jpg",
    addr: "Memmedguluzadeh st. 32 · Old City",
    hours: "09:00–21:00",
    desc: "A 15th-century palace complex built during the reign of Shirvanshah Khalilullah I. UNESCO-listed since 2000.",
    long: "The Shirvanshahs' Palace Complex consists of the main palace building, divan-khana, the personal mausoleum, the Shah's mosque with a minaret, the Bakuvi mausoleum, the palace's east portal, and a row of supplementary structures. The complex represents one of the rare examples of Azerbaijani medieval architecture and forms part of UNESCO's World Heritage Site Old City.",
    era: "XV c.", exhibits: "5,000+", visitors: "2.5M", area: "22 ha",
    exhibit360: "Throne of Shirvanshahs · 360° view"
  },
  "Maiden Tower": {
    crumb: "Maiden Tower",
    title: "Maiden Tower",
    img: "images/place1.jpg",
    addr: "Old City · Asef Zeynally st.",
    hours: "10:00–18:00",
    desc: "An iconic 12th-century tower in the Old City — one of the most mysterious monuments of Azerbaijan and a UNESCO World Heritage Site.",
    long: "Maiden Tower is one of Baku's most recognisable symbols and one of the world's most enigmatic medieval monuments. Built around the 12th century, the tower's original purpose remains debated — astronomical observatory, defensive fort, or Zoroastrian religious shrine. The 8-story structure stands 28 metres tall with walls up to 5 metres thick. A fire-temple, secret well and observation platform await inside.",
    era: "XII c.", exhibits: "120+", visitors: "1.4M", area: "0.5 ha",
    exhibit360: "Top observation deck · 360° panorama"
  },
  "Maiden Tower Museum": {
    crumb: "Maiden Tower",
    title: "Maiden Tower",
    img: "images/place1.jpg",
    addr: "Old City · Asef Zeynally st.",
    hours: "10:00–18:00",
    desc: "An iconic 12th-century tower in the Old City — UNESCO-listed mystery and Baku symbol.",
    long: "Maiden Tower is one of Baku's most recognisable symbols. Built around the 12th century, its original purpose remains debated — astronomical observatory, defensive fort, or Zoroastrian shrine.",
    era: "XII c.", exhibits: "120+", visitors: "1.4M", area: "0.5 ha",
    exhibit360: "Top observation deck · 360° panorama"
  },
  "Numismatics Museum": {
    crumb: "Numismatics", title: "Numismatics Museum",
    img: "images/city_view.jpg",
    addr: "Ashur Mosque (12th c.) · Old City",
    hours: "10:00–17:00",
    desc: "Located inside the 12th-century Ashur Mosque — coins from across the Silk Road, including Sasanid, Seljuk and Shirvanshah dynasties.",
    long: "The Numismatics Museum holds over 8,000 coins spanning 2,500 years of regional currency — from ancient Greek silver to Soviet rubles. The museum is itself housed in a restored 12th-century mosque, making it one of the most atmospheric small museums in Baku.",
    era: "XII c.", exhibits: "8,000+", visitors: "180k", area: "0.2 ha",
    exhibit360: "Sasanid silver collection · 360° viewer"
  },
  "Miniature Book Museum": {
    crumb: "Miniature Books", title: "Miniature Book Museum",
    img: "images/restaurant1.jpg",
    addr: "Old City · Boyuk Qala st.",
    hours: "11:00–17:00",
    desc: "The world's only museum dedicated to miniature books — over 8,000 books from 70+ countries, smallest the size of a fingernail.",
    long: "Founded by Zarifa Salahova and recognised by Guinness as the largest collection of miniature books in the world. Books are categorised by region, era and topic — fairy tales, classical literature, religious texts and political essays.",
    era: "1982", exhibits: "8,000+", visitors: "95k", area: "0.1 ha",
    exhibit360: "Smallest book in the world · macro 360°"
  },
  "Tahir Salahov Museum": {
    crumb: "T. Salahov House", title: "Tahir Salahov House Museum",
    img: "images/restaurant2.jpg",
    addr: "Old City · Memmedguluzadeh st.",
    hours: "10:00–18:00",
    desc: "The home and studio of one of Azerbaijan's most prominent 20th-century painters — preserved as he left it.",
    long: "Tahir Salahov (1928–2021) was a leading figure of the Soviet 'severe style' movement. His house in the Old City has been preserved as a museum showcasing personal items, original paintings, and the studio where many of his most famous works were created.",
    era: "20th c.", exhibits: "240+", visitors: "62k", area: "0.05 ha",
    exhibit360: "Salahov's studio · 360° tour"
  },
  "Tahir Salahov House Museum": {
    crumb: "T. Salahov House", title: "Tahir Salahov House Museum",
    img: "images/restaurant2.jpg",
    addr: "Old City · Memmedguluzadeh st.",
    hours: "10:00–18:00",
    desc: "Home and studio of Azerbaijan's most prominent 20th-century painter.",
    long: "Tahir Salahov (1928–2021) was a leading figure of the Soviet 'severe style' movement. His house in the Old City has been preserved as a museum.",
    era: "20th c.", exhibits: "240+", visitors: "62k", area: "0.05 ha",
    exhibit360: "Salahov's studio · 360° tour"
  },
  "Underground Bath Museum": {
    crumb: "Underground Bath", title: "Underground Bath Museum",
    img: "images/restaurant3.jpg",
    addr: "Old City · Asef Zeynally st.",
    hours: "10:00–18:00",
    desc: "A 14th-century bath complex preserved underground — a unique example of medieval Azerbaijani spa architecture.",
    long: "The underground location made these baths uniquely energy-efficient — heat from the hammam furnaces dissipated through the surrounding earth, keeping the chambers warm year-round. Restored in 2008 and now open as a museum.",
    era: "XIV c.", exhibits: "60+", visitors: "85k", area: "0.3 ha",
    exhibit360: "Steam chamber · 360° immersive view"
  }
};

function openMuseumDetail(id) {
  const m = museumData[id];
  if (!m) return;
  document.getElementById('muDetailHero').style.backgroundImage =
    `linear-gradient(180deg, rgba(20,15,10,0.30) 0%, rgba(20,15,10,0.85) 100%), url('${m.img}')`;
  document.getElementById('muDetailCrumb').textContent = m.crumb;
  document.getElementById('muDetailTitle').textContent = m.title;
  document.getElementById('muDetailDesc').textContent = m.desc;
  document.getElementById('muDetailHours').textContent = m.hours;
  document.getElementById('muDetailAddr').textContent = m.addr;
  document.getElementById('muDetailLong').textContent = m.long;
  document.getElementById('muStatEra').textContent = m.era;
  document.getElementById('muStatExhibits').textContent = m.exhibits;
  document.getElementById('muStatVisitors').textContent = m.visitors;
  document.getElementById('muStatArea').textContent = m.area;
  document.getElementById('muExhibitTitle').textContent = m.exhibit360;
  document.getElementById('muExhibitImg').src = m.img;

  // Other museums (3 random different ones)
  const otherKeys = Object.keys(museumData).filter(k => k !== id && !museumData[k].title.includes(museumData[id].title.split(' ')[0])).slice(0, 3);
  document.getElementById('muOtherList').innerHTML = otherKeys.map(k => {
    const o = museumData[k];
    return `<div class="place-card" onclick="openMuseumDetail('${k.replace(/'/g,"\\'")}')">
      <div class="img-wrap"><img src="${o.img}" alt=""></div>
      <div class="body">
        <div class="title-row"><h3>${o.title}</h3><span class="rating-pill"><span class="star">★</span> 4.8</span></div>
            <p class="addr">📍 ${o.addr}</p>
            <div class="meta-row"><span class="price">${o.hours}</span></div>
      </div>
    </div>`;
  }).join('');

  goPage('museum-detail');
}

// ============= TOUR DETAIL PAGE =============
const tourData = {
  "Old City Classic Tour": {
    crumb: "Classic Old City Tour",
    title: "Classic Old City Tour",
    img: "images/tour1.jpg",
    desc: "1.5-hour walking tour through the highlights of the Old City — Maiden Tower, Shirvanshah's Palace, hidden courtyards.",
    long: "Our most popular tour, designed for first-time visitors. A licensed local guide takes you through 1100 years of history in 90 minutes — from Sasanid foundations to Soviet streetscapes. Includes priority entry to two major museums and 10% discount in partner cafés.",
    duration: "1.5 hours", langs: "EN, RU, AZ, TR, AR",
    rating: "4.9 · 1847 reviews", price: "€25",
    guideName: "Aysel Mammadova",
    guideBio: "Historian and licensed Old City guide for 9 years. Speaks 5 languages. Specialises in Shirvanshah dynasty history."
  },
  "Classic Old City Tour": {
    crumb: "Classic Old City Tour",
    title: "Classic Old City Tour",
    img: "images/tour1.jpg",
    desc: "1.5-hour walking tour through the highlights of the Old City.",
    long: "Our most popular tour, designed for first-time visitors. A licensed local guide takes you through 1100 years of history in 90 minutes.",
    duration: "1.5 hours", langs: "EN, RU, AZ, TR, AR",
    rating: "4.9 · 1847 reviews", price: "€25",
    guideName: "Aysel Mammadova",
    guideBio: "Historian and licensed Old City guide for 9 years. Speaks 5 languages."
  },
  "Express 1-hour Tour": {
    crumb: "Express Tour",
    title: 'Express "Everything in 1 Hour"',
    img: "images/tour2.jpg",
    desc: "Perfect for cruise &amp; transit guests — see the must-sees in 60 minutes flat.",
    long: "Designed for travellers with limited time — a brisk but comprehensive walk through the must-see sights of the Old City. Quick entry to Maiden Tower observation deck included. Departs every hour from Qosha Qala Gates.",
    duration: "1 hour", langs: "EN, RU, TR",
    rating: "4.7 · 532 reviews", price: "€18",
    guideName: "Tural Aliyev",
    guideBio: "Express tour specialist with cruise & corporate clientele. 6 years experience, 4 languages."
  },
  'Express "Everything in 1 Hour"': {
    crumb: "Express Tour",
    title: 'Express "Everything in 1 Hour"',
    img: "images/tour2.jpg",
    desc: "Perfect for cruise & transit guests — see the must-sees in 60 minutes flat.",
    long: "Designed for travellers with limited time — a brisk but comprehensive walk through the must-see sights of the Old City.",
    duration: "1 hour", langs: "EN, RU, TR",
    rating: "4.7 · 532 reviews", price: "€18",
    guideName: "Tural Aliyev",
    guideBio: "Express tour specialist with cruise & corporate clientele."
  },
  "Gastro Tour": {
    crumb: "Gastro Tour",
    title: "Gastro Tour of Old City",
    img: "images/restaurant1.jpg",
    desc: "2 hours, 5 tastings, 8 heritage establishments. Eat your way through 200 years of Azerbaijani cuisine.",
    long: "From a 200-year-old chaikhana to a Heritage Restaurant serving recipes from the Shirvanshah's court — taste your way through the Old City's culinary heritage. Includes 5 portions of food, 1 tea ceremony and a take-home pakhlava box.",
    duration: "2 hours", langs: "EN, RU, AZ",
    rating: "4.9 · 412 reviews", price: "€45",
    guideName: "Leyla Hasanova",
    guideBio: "Food writer and Heritage Restaurant guide. 8 years specialising in Azerbaijani culinary history. Author of 'Old Baku Kitchen' cookbook."
  },
  "Night Tour: Secrets of the Walls": {
    crumb: "Night Tour",
    title: "Night Tour: Secrets of the Walls",
    img: "images/place1.jpg",
    desc: "1.5 hours after sunset with a costumed guide — legends, ghost stories, hidden corners.",
    long: "When the tourists leave and the lamps come on, the Old City takes on a different character. A costumed guide walks you through legends, ghost stories and hidden corners that look very different in the dark. Tour ends with chai at a private courtyard.",
    duration: "1.5 hours", langs: "EN, RU",
    rating: "4.8 · 287 reviews", price: "€32",
    guideName: "Murad Aliyev",
    guideBio: "Theatre actor and storyteller. Performs the night tour in costume — you'll experience the city as a 15th-century traveller would."
  },
  "Express \"All in 1 Hour\"": {
    crumb: "Express Tour",
    title: 'Express "Everything in 1 Hour"',
    img: "images/tour2.jpg",
    desc: "Perfect for cruise & transit guests — see the must-sees in 60 minutes flat.",
    long: "Designed for travellers with limited time.",
    duration: "1 hour", langs: "EN, RU, TR",
    rating: "4.7 · 532 reviews", price: "€18",
    guideName: "Tural Aliyev",
    guideBio: "Express tour specialist with cruise & corporate clientele."
  }
};

function openTourDetail(id) {
  const t = tourData[id];
  if (!t) return;
  document.getElementById('trDetailHero').style.backgroundImage =
    `linear-gradient(180deg, rgba(20,15,10,0.30) 0%, rgba(20,15,10,0.85) 100%), url('${t.img}')`;
  document.getElementById('trDetailCrumb').textContent = t.crumb;
  document.getElementById('trDetailTitle').textContent = t.title;
  document.getElementById('trDetailDesc').innerHTML = t.desc;
  document.getElementById('trDetailDur').textContent = t.duration;
  document.getElementById('trDetailLangs').textContent = t.langs;
  document.getElementById('trDetailRating').textContent = t.rating;
  document.getElementById('trDetailLong').textContent = t.long;
  document.getElementById('trDetailPrice').textContent = t.price;
  document.getElementById('trVideoPoster').src = t.img;
  document.getElementById('trGuideName').textContent = t.guideName;
  document.getElementById('trGuideBio').textContent = t.guideBio;

  // Other tours
  const otherKeys = Object.keys(tourData).filter(k => k !== id && !tourData[k].title.startsWith(tourData[id].title.split(' ')[0])).slice(0, 3);
  document.getElementById('trOtherList').innerHTML = otherKeys.map(k => {
    const o = tourData[k];
    return `<div class="place-card" onclick="openTourDetail('${k.replace(/'/g,"\\'")}')">
      <div class="img-wrap"><img src="${o.img}" alt=""></div>
      <div class="body">
        <div class="title-row"><h3>${o.title}</h3><span class="rating-pill"><span class="star">★</span> ${o.rating.split(' ')[0]}</span></div>
            <p class="addr">⏱ ${o.duration} · 🗣 ${o.langs}</p>
            <div class="meta-row"><span class="price">${o.price}</span></div>
      </div>
    </div>`;
  }).join('');

  goPage('tour-detail');
}

// ============= 360° EXHIBIT VIEWER (mock) =============
let exhibit360Angle = 0;
function rotateExhibit(dir) {
  exhibit360Angle = (exhibit360Angle + dir * 30 + 360) % 360;
  const img = document.getElementById('muExhibitImg');
  const bar = document.getElementById('muExhibit360Bar');
  if (img) img.style.transform = `rotate(${dir * 0}deg)`; // visual hint only
  if (img) img.style.filter = `hue-rotate(${exhibit360Angle * 0.3}deg) brightness(${1 - Math.abs(exhibit360Angle - 180) / 360 * 0.15})`;
  if (bar) bar.style.width = ((exhibit360Angle / 360) * 100) + '%';
}
// Drag to rotate
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('muExhibit360');
    if (!viewer) return;
    let dragX = null;
    viewer.addEventListener('pointerdown', e => { dragX = e.clientX; viewer.setPointerCapture(e.pointerId); });
    viewer.addEventListener('pointermove', e => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      if (Math.abs(dx) > 10) {
        rotateExhibit(dx > 0 ? 1 : -1);
        dragX = e.clientX;
      }
    });
    viewer.addEventListener('pointerup', () => { dragX = null; });
    viewer.addEventListener('pointercancel', () => { dragX = null; });
  });
})();

// ============= QUANTITY CONTROL =============
function qtyChange(btn, delta) {
  const ctrl = btn.closest('.qty-control');
  const valEl = ctrl.querySelector('.qty-val');
  let v = parseInt(valEl.textContent) || 1;
  v = Math.max(1, Math.min(20, v + delta));
  // For "2 adults" pattern keep label
  if (valEl.textContent.includes('adult')) {
    valEl.textContent = v + (v === 1 ? ' adult' : ' adults');
  } else {
    valEl.textContent = v;
  }
}

// ============= CARD HELPER =============
function placeCardHTML(it) {
  return `<div class="place-card" onclick="openDetail('${(it.name||'').replace(/'/g,"\\'")}', '${(it.addr||'').replace(/'/g,"\\'")}', '${it.img}', '${it.price||''}')">
    <div class="img-wrap">
      <img src="${it.img}" alt="">
      ${it.tag ? `<span class="pill ${it.tagCls||'pill-feature'}">${it.tag}</span>` : ''}
      <button class="heart" onclick="event.stopPropagation();this.classList.toggle('active')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>
    <div class="body">
      <div class="title-row">
        <h3>${it.name}</h3>
        <span class="rating-pill"><span class="star">★</span> ${it.rating}</span>
      </div>
      <p class="addr">📍 ${it.addr}</p>
      ${it.price ? `<div class="meta-row"><span class="price">${it.price}</span></div>` : ''}
      ${it.cta ? `<button class="buy-btn">${it.cta}</button>` : ''}
    </div>
  </div>`;
}

// ============= EXPLORE =============
const exploreData = {
  'Museums': [
    { name: "Shirvanshah's Palace", addr: "Memmedguluzadeh st. 32", img: "images/shirvanshah_palace.jpg", rating: 4.8, tag: 'UNESCO', tagCls: 'pill-unesco', price: '€12', cta: 'Buy Ticket' },
    { name: "Maiden Tower Museum", addr: "Old City", img: "images/place1.jpg", rating: 4.9, tag: 'UNESCO', tagCls: 'pill-unesco', price: '€10', cta: 'Buy Ticket' },
    { name: "Numismatics Museum", addr: "Ashur Mosque", img: "images/city_view.jpg", rating: 4.7, price: '€6', cta: 'Buy Ticket' },
    { name: "Miniature Book Museum", addr: "Old City", img: "images/restaurant1.jpg", rating: 4.8, price: 'Free', cta: 'Reserve' },
    { name: "Tahir Salahov House Museum", addr: "Old City", img: "images/restaurant2.jpg", rating: 4.6, price: '€8', cta: 'Buy Ticket' },
    { name: "Underground Bath Museum", addr: "Old City", img: "images/restaurant3.jpg", rating: 4.7, price: '€7', cta: 'Buy Ticket' },
    { name: "Sacred Relics Exhibition", addr: "Beyler Mosque", img: "images/place1.jpg", rating: 4.5, price: 'Free', cta: 'Visit' },
    { name: "Miniature Art Museum", addr: "Old City", img: "images/shirvanshah_palace.jpg", rating: 4.6, price: '€5', cta: 'Buy Ticket' },
  ],
  'Cafe & Restaurants': [
    { name: "Terrace 145", addr: "Memmedguluzadeh st. 32", img: "images/restaurant1.jpg", rating: 5.0, price: '€€€', cta: 'Reserve' },
    { name: "Karavansaray Heritage", addr: "Boyuk Qala st. 12", img: "images/restaurant2.jpg", rating: 4.7, tag: 'Heritage', tagCls: 'pill-feature', price: '€€€€', cta: 'Reserve' },
    { name: "Mugham Club", addr: "Old City", img: "images/restaurant3.jpg", rating: 4.9, tag: 'Live Music', price: '€€€', cta: 'Reserve' },
    { name: "Old City Restaurant", addr: "Fuzuli st. 32", img: "images/restaurant1.jpg", rating: 4.5, price: '€€', cta: 'Reserve' },
    { name: "Sehirli Tendir", addr: "Mirza Mansur st.", img: "images/restaurant2.jpg", rating: 4.4, tag: '☪ Halal', tagCls: 'pill-self', price: '€€', cta: 'Reserve' },
    { name: "Saray Restaurant", addr: "Maiden Tower zone", img: "images/restaurant3.jpg", rating: 4.6, price: '€€€', cta: 'Reserve' },
    { name: "Old City Tea House", addr: "Kichik Qala st.", img: "images/restaurant1.jpg", rating: 4.5, price: '€', cta: 'Visit' },
    { name: "Art Club Restaurant", addr: "Fuzuli st. 32", img: "images/restaurant2.jpg", rating: 4.8, price: '€€€', cta: 'Reserve' },
  ],
  'Hotels': [
    { name: "Sultan Inn Boutique", addr: "Old City · Free WiFi · Breakfast", img: "images/place1.jpg", rating: 4.8, tag: 'Premium', price: '€180/night', cta: 'Book' },
    { name: "Four Seasons Baku", addr: "Neftchilar Ave · Adjacent", img: "images/city_view.jpg", rating: 4.9, tag: '5★', price: '€340/night', cta: 'Book' },
    { name: "Old City Inn", addr: "Old City · Heritage building", img: "images/restaurant1.jpg", rating: 4.7, tag: 'Heritage', tagCls: 'pill-feature', price: '€120/night', cta: 'Book' },
    { name: "Sahil Hotel", addr: "Free WiFi · Breakfast", img: "images/shirvanshah_palace.jpg", rating: 4.6, price: '€95/night', cta: 'Book' },
    { name: "Boutique Heritage", addr: "B&B · Family run", img: "images/restaurant3.jpg", rating: 4.9, tag: 'B&B', price: '€85/night', cta: 'Book' },
    { name: "Maiden View Hotel", addr: "Tower view · Rooftop", img: "images/restaurant2.jpg", rating: 4.8, price: '€140/night', cta: 'Book' },
    { name: "Caspian Palace", addr: "Free WiFi · Breakfast", img: "images/place1.jpg", rating: 4.8, price: '€155/night', cta: 'Book' },
    { name: "Rotunda Hotel", addr: "Free WiFi · Breakfast", img: "images/city_view.jpg", rating: 4.7, price: '€110/night', cta: 'Book' },
  ],
  'Shops': [
    { name: "Buxara Craftsmen Yard", addr: "Boyuk Qala st.", img: "images/restaurant1.jpg", rating: 4.9, tag: 'Workshop', tagCls: 'pill-feature', price: 'From €20', cta: 'Visit' },
    { name: "Carpet Bazaar", addr: "Maiden Tower zone", img: "images/restaurant2.jpg", rating: 4.8, price: 'From €80', cta: 'Visit' },
    { name: "Heritage Crafts", addr: "Asef Zeynally st.", img: "images/restaurant3.jpg", rating: 4.6, price: 'From €15', cta: 'Visit' },
    { name: "Aziz Coppersmith", addr: "Old City", img: "images/place1.jpg", rating: 4.9, tag: 'Master', tagCls: 'pill-vip', price: 'From €40', cta: 'Visit' },
    { name: "Spice Market", addr: "Sabir st.", img: "images/city_view.jpg", rating: 4.7, price: 'From €5', cta: 'Visit' },
    { name: "Old City Souvenirs", addr: "Boyuk Qala st.", img: "images/restaurant1.jpg", rating: 4.5, price: 'From €10', cta: 'Visit' },
  ],
  'Architectural monuments': [
    { name: "Juma Mosque", addr: "Old City", img: "images/shirvanshah_palace.jpg", rating: 4.7, price: 'Free', cta: 'Visit' },
    { name: "Multani Caravansaray", addr: "Old City", img: "images/city_view.jpg", rating: 4.6, price: 'Free', cta: 'Visit' },
    { name: "Bukhara Caravansaray", addr: "Old City", img: "images/restaurant1.jpg", rating: 4.5, price: 'Free', cta: 'Visit' },
    { name: "Sinig Qala Minaret", addr: "Old City", img: "images/place1.jpg", rating: 4.8, price: 'Free', cta: 'Visit' },
  ],
  'Landmarks': [
    { name: "Maiden Tower", addr: "Old City", img: "images/place1.jpg", rating: 4.9, tag: 'UNESCO', tagCls: 'pill-unesco', price: '€10', cta: 'Buy Ticket' },
    { name: "Shirvanshah's Palace", addr: "Old City", img: "images/shirvanshah_palace.jpg", rating: 4.8, tag: 'UNESCO', tagCls: 'pill-unesco', price: '€12', cta: 'Buy Ticket' },
    { name: "Qosha Qala Gates", addr: "Old City", img: "images/city_view.jpg", rating: 4.7, price: 'Free', cta: 'Visit' },
    { name: "Sinig Qala", addr: "Old City", img: "images/restaurant1.jpg", rating: 4.5, price: 'Free', cta: 'Visit' },
  ],
  'Art Galleries': [
    { name: "Contemporary Art Gallery", addr: "Memmedguluzadeh st.", img: "images/restaurant2.jpg", rating: 5.0, price: 'Free', cta: 'Visit' },
    { name: "Aziza's Studio &amp; Gallery", addr: "Hidden courtyard", img: "images/restaurant3.jpg", rating: 4.9, tag: 'Like a Local', tagCls: 'pill-feature', price: 'Free', cta: 'Visit' },
    { name: "National Art Gallery", addr: "Niyazi st. 9", img: "images/restaurant1.jpg", rating: 4.5, price: '€5', cta: 'Buy Ticket' },
    { name: "Art is Everything", addr: "Memmedguluzadeh st.", img: "images/place1.jpg", rating: 5.0, price: 'Free', cta: 'Visit' },
  ],
  'Tour Agencies': [
    { name: "Old City Agency", addr: "Memmedguluzadeh st.", img: "images/tour1.jpg", rating: 5.0, tag: 'Licensed', tagCls: 'pill-feature', price: 'From €25', cta: 'Book' },
    { name: "Old City Tours", addr: "Fuzuli st.", img: "images/tour2.jpg", rating: 4.8, price: 'From €20', cta: 'Book' },
    { name: "Tours Here", addr: "Fuzuli st.", img: "images/tour1.jpg", rating: 4.5, price: 'From €18', cta: 'Book' },
    { name: "Baku Discovery", addr: "Boyuk Qala st.", img: "images/tour2.jpg", rating: 4.6, price: 'From €22', cta: 'Book' },
  ],
  'Hidden Gems': [
    { name: "Hidden Sufi Well", addr: "Old City · By appointment", img: "images/city_view.jpg", rating: 5.0, tag: 'Like a Local', tagCls: 'pill-feature', price: '€12', cta: 'Reserve' },
    { name: "Secret Rooftop", addr: "Old City · Sunset only", img: "images/place1.jpg", rating: 4.9, tag: 'Hidden Gem', price: 'Free', cta: 'Get directions' },
    { name: "12th-century courtyard", addr: "By the Maiden Tower", img: "images/shirvanshah_palace.jpg", rating: 4.8, price: 'Free', cta: 'Get directions' },
    { name: "Underground passage", addr: "Near Multani caravansaray", img: "images/restaurant3.jpg", rating: 4.7, price: '€5', cta: 'Visit' },
  ],
  'Park': [
    { name: "Philharmonic Garden", addr: "Old City", img: "images/place1.jpg", rating: 4.9, price: 'Free', cta: 'Visit' },
    { name: "Boulevard Seaside Park", addr: "Neftchilar Ave.", img: "images/restaurant1.jpg", rating: 4.7, price: 'Free', cta: 'Visit' },
    { name: "Central Park", addr: "Memmedguluzadeh st.", img: "images/city_view.jpg", rating: 4.8, price: 'Free', cta: 'Visit' },
  ],
  'Wellness': [
    { name: "Hadji Bani Hammam", addr: "Old City · Authentic ritual", img: "images/restaurant3.jpg", rating: 4.8, tag: 'Hammam', tagCls: 'pill-feature', price: '€55', cta: 'Reserve' },
    { name: "Sunset Yoga at the walls", addr: "Maiden Tower zone", img: "images/city_view.jpg", rating: 4.9, tag: 'Unique', tagCls: 'pill-vip', price: '€20', cta: 'Reserve' },
    { name: "SPA at Sultan Inn", addr: "Inside the Boutique Hotel", img: "images/place1.jpg", rating: 4.7, price: 'From €80', cta: 'Reserve' },
  ],
  'Mobility': [
    { name: "Park &amp; Ride · Qala Gate", addr: "Free shuttle every 15 min", img: "images/tour1.jpg", rating: 4.5, tag: 'Free shuttle', tagCls: 'pill-self', price: 'Free', cta: 'Get directions' },
    { name: "Old City Buggy stop A", addr: "Boyuk Qala st.", img: "images/tour2.jpg", rating: 4.5, price: '€2', cta: 'Call shuttle' },
    { name: "Bicycle rental", addr: "Maiden Tower zone", img: "images/tour1.jpg", rating: 4.7, price: '€8/day', cta: 'Reserve' },
  ],
  'Utilities': [
    { name: "Public WC", addr: "Boyuk Qala st.", img: "images/place1.jpg", rating: 4.0, price: 'Free', cta: 'Get directions' },
    { name: "Drinking water station", addr: "Asef Zeynally st.", img: "images/city_view.jpg", rating: 4.5, price: 'Free', cta: 'Get directions' },
    { name: "ATM Kapital Bank", addr: "Maiden Tower zone", img: "images/restaurant1.jpg", rating: 4.6, price: '–', cta: 'Get directions' },
    { name: "Pharmacy", addr: "Sabir st.", img: "images/restaurant2.jpg", rating: 4.7, price: '–', cta: 'Get directions' },
    { name: "Free Wi-Fi · Old City", addr: "Across all main streets", img: "images/place1.jpg", rating: 4.8, price: 'Free', cta: 'How to connect' },
  ],
};

function renderExplore(cat) {
  document.querySelectorAll('#exploreTabs .explore-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  const items = exploreData[cat] || [];
  document.getElementById('exploreContent').innerHTML = '<div class="listing-grid">' + items.map(placeCardHTML).join('') + '</div>';
}
document.querySelectorAll('#exploreTabs .explore-tab').forEach(t => t.onclick = () => renderExplore(t.dataset.cat));
renderExplore('Museums');

// ============= TOURS =============
const tourListData = [
  { name: 'Classic Old City Tour', addr: '1.5h · 5 languages · Bestseller', img: 'images/tour1.jpg', rating: 4.9, price: '€25', tag: 'Classic', tagCls: 'pill-feature', cta: 'Book Tour' },
  { name: 'Express "All in 1 Hour"', addr: '1h · For cruise &amp; transit', img: 'images/tour2.jpg', rating: 4.7, price: '€18', tag: 'Express', tagCls: 'pill-walking', cta: 'Book Tour' },
  { name: 'Gastro Tour', addr: '2h · 5 tastings included', img: 'images/restaurant1.jpg', rating: 4.9, price: '€45', tag: 'Gastro', tagCls: 'pill-thematic', cta: 'Book Tour' },
  { name: 'Crafts Tour', addr: '2.5h · 4 workshops', img: 'images/restaurant2.jpg', rating: 4.8, price: '€38', tag: 'Crafts', tagCls: 'pill-thematic', cta: 'Book Tour' },
  { name: 'Night: Secrets of the Walls', addr: '1.5h · Costumed guide', img: 'images/place1.jpg', rating: 4.8, price: '€32', tag: 'Night', tagCls: 'pill-vip', cta: 'Book Tour' },
  { name: 'Family Quest', addr: '2h · For kids 6–12', img: 'images/tour1.jpg', rating: 4.9, price: '€55 / family', tag: 'Family', tagCls: 'pill-self', cta: 'Book Tour' },
  { name: 'VIP / Diplomatic', addr: '3h · Private · After hours', img: 'images/shirvanshah_palace.jpg', rating: 5.0, price: 'From €280', tag: 'VIP', tagCls: 'pill-vip', cta: 'Book Tour' },
  { name: 'Photo Tour', addr: '2h · Pro photographer', img: 'images/city_view.jpg', rating: 4.9, price: '€95', tag: 'Photo', tagCls: 'pill-thematic', cta: 'Book Tour' },
  { name: 'AR Time Machine', addr: '2h · 10+ AR points', img: 'images/place1.jpg', rating: 4.9, price: '€55', tag: 'AR', tagCls: 'pill-vip', cta: 'Book Tour' },
  { name: 'Qala Day-Trip', addr: 'Half day · Includes lunch', img: 'images/tour2.jpg', rating: 4.8, price: '€68', tag: 'Day-trip', tagCls: 'pill-thematic', cta: 'Book Tour' },
  { name: 'Spiritual Route', addr: '2h · Mosques &amp; Sufi sites', img: 'images/shirvanshah_palace.jpg', rating: 4.6, price: '€28', cta: 'Book Tour' },
  { name: 'Architectural Deep-Dive', addr: '3h · With architect', img: 'images/restaurant1.jpg', rating: 4.7, price: '€85', cta: 'Book Tour' },
];
document.getElementById('toursContent').innerHTML = tourListData.map(placeCardHTML).join('');

// ============= EAT =============
document.getElementById('eatContent').innerHTML = exploreData['Cafe & Restaurants'].map(placeCardHTML).join('');

// ============= STAY =============
document.getElementById('stayContent').innerHTML = exploreData['Hotels'].map(placeCardHTML).join('');

// ============= LIVE =============
function renderLive(act) {
  document.querySelectorAll('#liveTabs .explore-tab').forEach(t => t.classList.toggle('active', t.dataset.act === act));
  const c = document.getElementById('liveContent');
  if (act === 'Events') {
    const events = [
      { title: 'National Nowruz celebration', date: '21 March 2026', cat: 'Cultural', img: 'images/event1.jpg', price: '€8' },
      { title: 'Mugham Concert Night', date: '28 May 2026', cat: 'Music', img: 'images/place1.jpg', price: '€15' },
      { title: 'International Tourists Festival', date: '5 June 2026', cat: 'Festival', img: 'images/city_view.jpg', price: 'Free' },
      { title: 'Old City Marathon', date: '12 June 2026', cat: 'Sport', img: 'images/tour1.jpg', price: '€12' },
      { title: 'Carpet Weaving Workshop', date: '18 June 2026', cat: 'Workshop', img: 'images/restaurant2.jpg', price: '€35' },
      { title: 'Heritage Day Tour', date: '20 June 2026', cat: 'Cultural', img: 'images/shirvanshah_palace.jpg', price: '€25' },
    ];
    c.innerHTML = '<div class="events-grid">' + events.map(e => `
      <div class="event-card" onclick="openDetail('${e.title.replace(/'/g, "\\'")}', '${e.cat} event', '${e.img}', '${e.price}')">
        <div class="event-img"><img src="${e.img}" alt=""><span class="event-cat-tag">${e.cat}</span></div>
        <div class="event-body">
          <div class="event-date">📅 ${e.date}</div>
          <h3>${e.title}</h3>
          <div class="event-meta"><span>🕘 16:30–22:00</span><span>📍 Qosha Gala</span></div>
          <button class="event-buy">Buy Ticket</button>
        </div>
      </div>`).join('') + '</div>';
  } else if (act === 'Calendar') {
    // Calendar grid for current month (May 2026 used as example)
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = new Date(2026, 4, 10); // May 10, 2026
    const year = today.getFullYear(); const month = today.getMonth();
    const monthName = months[month];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Events keyed by date
    const calEvents = {
      3: [{title:'Old City Run', cat:'Sport'}],
      9: [{title:'Old City Marathon', cat:'Sport'}],
      14: [{title:'Mugham Night', cat:'Music'}],
      18: [{title:'Carpet Workshop', cat:'Workshop'}, {title:'Sufi Theater', cat:'Theater'}],
      22: [{title:'Heritage Day', cat:'Cultural'}],
      28: [{title:'Mugham Concert', cat:'Music'}],
    };
    let cells = '';
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-first
    for (let i = 0; i < startOffset; i++) cells += '<div class="cal-cell empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate();
      const dayEvents = calEvents[d] || [];
      cells += `<div class="cal-cell${isToday ? ' today' : ''}${dayEvents.length ? ' has-event' : ''}">
        <div class="cal-day">${d}</div>
        ${dayEvents.slice(0,2).map(e => `<div class="cal-event cat-${e.cat.toLowerCase()}">${e.title}</div>`).join('')}
        ${dayEvents.length > 2 ? `<div class="cal-more">+${dayEvents.length - 2} more</div>` : ''}
      </div>`;
    }
    c.innerHTML = `
      <div class="cal-wrap">
        <div class="cal-head">
          <div class="cal-month-label">${monthName} ${year}</div>
          <div class="cal-nav">
            <button class="cal-nav-btn">‹ Prev</button>
            <button class="cal-nav-btn active">Today</button>
            <button class="cal-nav-btn">Next ›</button>
          </div>
        </div>
        <div class="cal-weekdays">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div class="cal-grid">${cells}</div>
        <div class="cal-legend">
          <span class="cal-legend-item"><span class="dot cat-cultural"></span>Cultural</span>
          <span class="cal-legend-item"><span class="dot cat-music"></span>Music</span>
          <span class="cal-legend-item"><span class="dot cat-sport"></span>Sport</span>
          <span class="cal-legend-item"><span class="dot cat-workshop"></span>Workshop</span>
          <span class="cal-legend-item"><span class="dot cat-festival"></span>Festival</span>
          <span class="cal-legend-item"><span class="dot cat-theater"></span>Theater</span>
        </div>
      </div>`;
  } else if (act === 'News') {
    const news = [
      { title: 'New AR Time Machine experience launches at Maiden Tower', date: '8 May 2026', cat: 'Innovation', img: 'images/place1.jpg', excerpt: 'Visitors can now travel back to 12th-century Baku through augmented reality at 10 historical points across the Old City.' },
      { title: 'Shirvanshah\'s Palace restoration completed after 18 months', date: '5 May 2026', cat: 'Heritage', img: 'images/shirvanshah_palace.jpg', excerpt: 'The Divan-khana courtyard reopens to the public following extensive conservation work led by ICOMOS-certified specialists.' },
      { title: 'İçərişəhər wins Green Destinations Top 100 award', date: '1 May 2026', cat: 'Awards', img: 'images/city_view.jpg', excerpt: 'The Old City has been recognized for its sustainable tourism initiatives at the ITB Berlin convention.' },
      { title: 'Heritage Pass sales reach 1 million milestone', date: '25 April 2026', cat: 'Milestone', img: 'images/restaurant1.jpg', excerpt: 'The pass has welcomed visitors from over 80 countries since launch — most popular with German and Turkish travellers.' },
      { title: 'Eight new Heritage Restaurants certified', date: '20 April 2026', cat: 'Gastro', img: 'images/restaurant2.jpg', excerpt: 'Family-run establishments serving recipes 200+ years old now bear the official Heritage Restaurant seal.' },
      { title: 'Old City joins UNESCO Creative Cities Network', date: '15 April 2026', cat: 'UNESCO', img: 'images/restaurant3.jpg', excerpt: 'The neighborhood becomes part of a global network of cities recognized for crafts and folk art.' },
    ];
    c.innerHTML = '<div class="news-grid">' + news.map(n => `
      <article class="news-card" onclick="openDetail('${n.title.replace(/'/g,"\\'")}', '${n.date} · ${n.cat}', '${n.img}')">
        <div class="news-img"><img src="${n.img}" alt=""><span class="news-cat-tag">${n.cat}</span></div>
        <div class="news-body">
          <div class="news-date">📰 ${n.date}</div>
          <h3>${n.title}</h3>
          <p>${n.excerpt}</p>
          <a class="link-arrow">Read more →</a>
        </div>
      </article>`).join('') + '</div>';
  } else if (act === 'Announcement') {
    const announcements = [
      { type: 'urgent', icon: '⚠', title: 'Sabir street temporarily closed', date: '10 May 2026', body: 'Due to ongoing restoration works between Boyuk Qala and Asef Zeynally streets, Sabir street is closed to pedestrians from 9–14 May. Detour via Qız Qalası available.' },
      { type: 'info', icon: 'ℹ', title: 'Updated opening hours for summer 2026', date: '8 May 2026', body: 'Starting 1 June, all museums extend their summer hours: 09:00–22:00 (Mon–Sun). Maiden Tower remains 10:00–18:00.' },
      { type: 'info', icon: '🎉', title: 'Free entry for children under 12 — extended', date: '5 May 2026', body: 'The free entry program for children under 12 (with adult Heritage Pass) has been extended through the entire 2026 tourist season.' },
      { type: 'urgent', icon: '🚧', title: 'Maiden Tower partial scaffolding 12–15 May', date: '3 May 2026', body: 'Routine inspection scaffolding will be visible on the south face of Maiden Tower for 4 days. Tower remains open. Photo-opportunity may be limited.' },
      { type: 'info', icon: '📱', title: 'Mobile app v3.2 released', date: '1 May 2026', body: 'New update includes offline maps for the Qala reserve, improved AR Time Machine, and Telegram-based emergency support button.' },
      { type: 'info', icon: '🅿️', title: 'New Park & Ride location opens at Qala Gate', date: '28 April 2026', body: 'Free shuttle now runs every 15 minutes between the new Qala Gate parking (300 spaces) and the Old City. Saves €10 vs city center parking.' },
    ];
    c.innerHTML = '<div class="announcement-list">' + announcements.map(a => `
      <div class="announce-card ${a.type}">
        <div class="announce-icon">${a.icon}</div>
        <div class="announce-body">
          <div class="announce-meta">
            <span class="announce-tag">${a.type === 'urgent' ? 'Urgent' : 'Notice'}</span>
            <span class="announce-date">${a.date}</span>
          </div>
          <h3>${a.title}</h3>
          <p>${a.body}</p>
        </div>
      </div>`).join('') + '</div>';
  } else {
    // Posts (Community Feed)
    c.innerHTML = `
      <div style="max-width:720px;margin:0 auto;">
        <div style="background:#FFF;border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#9b59b6,#e91e63);"></div>
          <input type="text" placeholder="What do you think about Old City?" style="flex:1;border:none;outline:none;background:transparent;font-size:14px;">
          <button style="background:var(--bg-soft);border:none;width:36px;height:36px;border-radius:10px;cursor:pointer;">📷</button>
        </div>
        <div style="background:#FFF;border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#9b59b6,#e91e63);"></div>
            <div><div style="font-weight:700;">Ulviyya Imamova</div><div style="font-size:12px;color:var(--text-muted);">29 May 2026 · 16:32</div></div>
          </div>
          <div style="font-size:14px;line-height:1.6;margin-bottom:14px;">Walking through the narrow streets of İçərişəhər at sunset is something else 😍 #DiscoverIcherisheher</div>
          <img src="images/shirvanshah_palace.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;margin-bottom:14px;">
          <div style="display:flex;gap:24px;align-items:center;padding-top:14px;border-top:1px solid var(--border);">
            <button style="background:none;border:none;color:var(--red);font-weight:600;font-size:13px;cursor:pointer;">❤ 342</button>
            <button style="background:none;border:none;color:var(--text-muted);font-weight:600;font-size:13px;cursor:pointer;">💬 342 Comments</button>
          </div>
        </div>
        <div style="background:#FFF;border:1px solid var(--border);border-radius:16px;padding:22px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#3498db,#1abc9c);"></div>
            <div><div style="font-weight:700;">Tural Aliyev</div><div style="font-size:12px;color:var(--text-muted);">28 May 2026 · 11:08</div></div>
          </div>
          <div style="font-size:14px;line-height:1.6;margin-bottom:14px;">Best dolma in town at Karavansaray. Heritage Pass paid for itself in three sites already. Highly recommended!</div>
          <div style="display:flex;gap:24px;align-items:center;padding-top:14px;border-top:1px solid var(--border);">
            <button style="background:none;border:none;color:var(--text-muted);font-weight:600;font-size:13px;cursor:pointer;">❤ 142</button>
            <button style="background:none;border:none;color:var(--text-muted);font-weight:600;font-size:13px;cursor:pointer;">💬 84 Comments</button>
          </div>
        </div>
      </div>`;
  }
}
document.querySelectorAll('#liveTabs .explore-tab').forEach(t => t.onclick = () => renderLive(t.dataset.act));
renderLive('Events');

// ============= DEALS PAGE =============
const dealsData = [
  { badge: '−20%', title: 'Museum + Lunch Combo', desc: "Shirvanshah's Palace + traditional lunch", oldp: '€22', newp: '€18', img: 'images/shirvanshah_palace.jpg' },
  { badge: 'EARLY BIRD', title: 'Morning Walking Tour', desc: '1.5h tour starting at 08:00', oldp: '€25', newp: '€19', img: 'images/tour1.jpg' },
  { badge: 'ONLINE −15%', title: 'Heritage Pass 48h', desc: 'All museums + tour + audio guide', oldp: '€49', newp: '€42', img: 'images/place1.jpg' },
  { badge: '−33%', title: 'Stay 3, Pay 2', desc: 'Boutique B&amp;Bs · Off-peak nights', oldp: '', newp: '−33%', img: 'images/city_view.jpg' },
  { badge: 'HAPPY HOUR', title: 'Tea + Pakhlava combo', desc: '17:00–19:00 · All chaikhanas', oldp: '€8', newp: '€5', img: 'images/restaurant1.jpg' },
  { badge: 'COMBO', title: 'Tour + Hammam + Dinner', desc: 'Full evening experience', oldp: '€135', newp: '€95', img: 'images/restaurant3.jpg' },
  { badge: 'NEW', title: 'AR Time Machine launch', desc: 'First 100 visitors per day', oldp: '€55', newp: '€39', img: 'images/place1.jpg' },
  { badge: 'NOWRUZ', title: 'Spring Festival Pass', desc: '21–28 March only', oldp: '€42', newp: '€32', img: 'images/event1.jpg' },
];
document.getElementById('dealsContent').innerHTML = dealsData.map(d => `
  <div class="deal-card" onclick="openDetail('${d.title.replace(/'/g,"\\'")}', '${d.desc.replace(/'/g,"\\'")}', '${d.img}', '${d.newp}')">
    <span class="badge">${d.badge}</span>
    <h3>${d.title}</h3>
    <p>${d.desc}</p>
    <div class="price-row">
      <span class="price">${d.oldp ? `<strike>${d.oldp}</strike>` : ''}${d.newp}</span>
      <span class="arrow">→</span>
    </div>
  </div>`).join('');

// ============= HERO SEARCH — guests & autocomplete =============
let heroGuestsCount = 2;
function changeGuests(dir) {
  heroGuestsCount = Math.max(1, Math.min(20, heroGuestsCount + dir));
  const el = document.getElementById('heroGuests');
  if (el) el.textContent = heroGuestsCount + (heroGuestsCount === 1 ? ' adult' : ' adults');
}

(function() {
  const input = document.getElementById('heroSearchInput');
  const ac = document.getElementById('heroAutocomplete');
  if (!input || !ac) return;

  // Build searchable list from museumData + tourData + exploreData
  function getAll() {
    const items = [];
    if (typeof museumData !== 'undefined') {
      Object.keys(museumData).forEach(k => items.push({ name: k, type: 'Museum', icon: '🏛', data: museumData[k] }));
    }
    if (typeof tourData !== 'undefined') {
      Object.keys(tourData).forEach(k => items.push({ name: k, type: 'Tour', icon: '🚶', data: tourData[k] }));
    }
    if (typeof exploreData !== 'undefined') {
      Object.keys(exploreData).forEach(cat => {
        (exploreData[cat] || []).forEach(it => items.push({ name: it.name, type: cat, icon: '📍', data: it }));
      });
    }
    return items;
  }

  function render(q) {
    const all = getAll();
    const matches = all.filter(it => it.name && it.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
    if (!matches.length) {
      ac.innerHTML = '';
      ac.classList.remove('open');
      return;
    }
    ac.innerHTML = matches.map(it => `
      <div class="ac-item" data-name="${it.name.replace(/"/g, '&quot;')}" data-type="${it.type}">
        <div class="ac-icon">${it.icon}</div>
        <div class="ac-content">
          <div class="ac-title">${it.name}</div>
          <div class="ac-sub">${it.type}</div>
        </div>
      </div>`).join('');
    ac.classList.add('open');
    ac.querySelectorAll('.ac-item').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.getAttribute('data-name');
        const type = el.getAttribute('data-type');
        input.value = name;
        ac.classList.remove('open');
        // Smart navigation
        if (typeof museumData !== 'undefined' && museumData[name]) {
          openMuseumDetail(name);
        } else if (typeof tourData !== 'undefined' && tourData[name]) {
          openTourDetail(name);
        } else {
          openDetail(name, '', '', '');
        }
      });
    });
  }

  input.addEventListener('input', e => {
    const q = e.target.value.trim();
    if (q.length < 2) {
      ac.classList.remove('open');
      return;
    }
    render(q);
  });
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) render(input.value.trim());
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#searchWhatField')) ac.classList.remove('open');
  });
})();

// ============= ABOUT INTRO CAROUSEL =============
(function() {
  const carousel = document.getElementById('aboutCarousel');
  const dotsBox = document.getElementById('aboutCarouselDots');
  if (!carousel || !dotsBox) return;
  const imgs = carousel.querySelectorAll('.about-carousel-img');
  let idx = 0;
  imgs.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'about-carousel-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => go(i));
    dotsBox.appendChild(d);
  });
  function go(i) {
    idx = i;
    imgs.forEach((im, mi) => im.classList.toggle('active', mi === idx));
    dotsBox.querySelectorAll('.about-carousel-dot').forEach((d, di) => d.classList.toggle('active', di === idx));
  }
  setInterval(() => go((idx + 1) % imgs.length), 4500);
})();

// ============= EXPLORE MAP TOGGLE =============
(function() {
  const toggle = document.getElementById('exploreMapToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const wrap = toggle.closest('.explore-map-wrap');
    if (!wrap) return;
    const collapsed = wrap.classList.toggle('collapsed');
    const label = toggle.querySelector('span');
    if (label) label.textContent = collapsed ? 'Show map' : 'Hide map';
  });
})();

// ============= FULL-WIDTH HERO BANNER CAROUSEL =============
(function() {
  const track = document.getElementById('hbnTrack');
  const dotsBox = document.getElementById('hbnDots');
  if (!track || !dotsBox) return;
  const slides = track.querySelectorAll('.hbn-slide');
  const total = slides.length;
  let index = 0;
  let auto;
  const DURATION = 5500;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hbn-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { hbnGo(i); resetAuto(); });
    dotsBox.appendChild(d);
  });

  function hbnGo(i) {
    index = ((i % total) + total) % total;
    slides.forEach((s, si) => s.classList.toggle('active', si === index));
    dotsBox.querySelectorAll('.hbn-dot').forEach((d, di) => d.classList.toggle('active', di === index));
  }
  window.hbnMove = function(dir) { hbnGo(index + dir); resetAuto(); };

  function resetAuto() {
    clearInterval(auto);
    auto = setInterval(() => hbnGo(index + 1), DURATION);
  }

  const wrap = document.querySelector('.hero-banner-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(auto));
    wrap.addEventListener('mouseleave', resetAuto);
  }
  resetAuto();
})();

// ============= INSPIRATION BANNER CAROUSEL =============
(function() {
  const track = document.getElementById('rbTrack');
  const dotsBox = document.getElementById('rbDots');
  const progressBar = document.getElementById('rbProgress');
  if (!track || !dotsBox) return;

  const banners = track.querySelectorAll('.rb-banner');
  const total = banners.length;
  let index = 0;
  let auto, progressTimer;
  const DURATION = 5000;

  banners.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'rb-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { rbGo(i); resetAuto(); });
    dotsBox.appendChild(d);
  });

  function rbGo(i) {
    index = ((i % total) + total) % total;
    banners.forEach((b, bi) => b.classList.toggle('active', bi === index));
    dotsBox.querySelectorAll('.rb-dot').forEach((d, di) => d.classList.toggle('active', di === index));
  }

  window.rbMove = function(dir) {
    rbGo(index + dir);
    resetAuto();
  };

  function startProgress() {
    if (!progressBar) return;
    clearInterval(progressTimer);
    let elapsed = 0;
    progressBar.style.width = '0%';
    progressTimer = setInterval(() => {
      elapsed += 50;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      progressBar.style.width = pct + '%';
      if (elapsed >= DURATION) clearInterval(progressTimer);
    }, 50);
  }

  function resetAuto() {
    clearInterval(auto);
    startProgress();
    auto = setInterval(() => {
      rbGo(index + 1);
      startProgress();
    }, DURATION);
  }

  const wrap = document.querySelector('.reasons-banner-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => {
      clearInterval(auto);
      clearInterval(progressTimer);
    });
    wrap.addEventListener('mouseleave', resetAuto);
  }

  resetAuto();
})();

// ============= HERITAGE CAROUSEL =============
let heritageIndex = 0;
function heritageMove(dir) {
  const carousel = document.getElementById('heritageCarousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.heritage-card');
  const total = cards.length;
  const visible = 2;
  const maxIndex = Math.max(0, total - visible);
  heritageIndex = Math.max(0, Math.min(maxIndex, heritageIndex + dir));
  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = 16;
  carousel.style.transform = `translateX(-${heritageIndex * (cardWidth + gap)}px)`;

  // Highlight matching pin
  document.querySelectorAll('.heritage-pin').forEach(p => p.classList.remove('active'));
  const activeId = parseInt(cards[heritageIndex].getAttribute('data-id'));
  const activePin = document.querySelector(`.heritage-pin[data-id="${activeId}"]`);
  if (activePin) activePin.classList.add('active');
}

(function() {
  // Click pin → scroll carousel to that card
  document.addEventListener('click', e => {
    const pin = e.target.closest('.heritage-pin');
    if (!pin) return;
    const id = pin.getAttribute('data-id');
    const carousel = document.getElementById('heritageCarousel');
    if (!carousel) return;
    const cards = carousel.querySelectorAll('.heritage-card');
    cards.forEach((c, i) => {
      if (c.getAttribute('data-id') === id) {
        heritageIndex = Math.min(i, cards.length - 2);
        heritageMove(0);
      }
    });
  });
})();

// ============= MEDIA SECTION =============
const mediaData = {
  news: [
    { date: '04.05.2026', title: 'Beynəlxalq Xalça Festivalı uğurla başa çatdı', img: 'images/place1.jpg' },
    { date: '02.05.2026', title: 'Beynəlxalq Xalça Forumu öz işini yekunlaşdırdı', img: 'images/restaurant1.jpg' },
    { date: '26.04.2026', title: 'Onuncu Respublika Gənc Memarlar və Tələbələrin İşləri Müsabiqəsi keçirildi', img: 'images/shirvanshah_palace.jpg' },
    { date: '20.04.2026', title: 'Maiden Tower restoration completed', img: 'images/place1.jpg' },
    { date: '15.04.2026', title: 'AR Time Machine launches across 10 historical points', img: 'images/city_view.jpg' },
    { date: '10.04.2026', title: 'New Heritage Restaurants certified', img: 'images/restaurant2.jpg' },
  ],
  events: [
    { date: '12.06.2026', title: 'Carpet Weaving Workshop at Buxara Caravansaray', img: 'images/restaurant2.jpg' },
    { date: '28.05.2026', title: 'Mugham Concert Night at Maiden Tower', img: 'images/place1.jpg' },
    { date: '16.05.2026', title: 'Old City Run 2026 — annual marathon', img: 'images/tour1.jpg' },
    { date: '20.06.2026', title: 'Heritage Day — free entry to all museums', img: 'images/shirvanshah_palace.jpg' },
    { date: '05.07.2026', title: 'International Tourists Festival', img: 'images/city_view.jpg' },
  ],
  announce: [
    { date: '10.05.2026', title: 'Sabir street closed 9–14 May due to restoration', img: 'images/city_view.jpg' },
    { date: '08.05.2026', title: 'Summer opening hours: museums extend to 22:00', img: 'images/shirvanshah_palace.jpg' },
    { date: '05.05.2026', title: 'Free entry for children under 12 — extended', img: 'images/place1.jpg' },
    { date: '01.05.2026', title: 'Mobile app v3.2 released with AR improvements', img: 'images/tour2.jpg' },
  ]
};
let mediaType = 'news';
let mediaIndex = 0;
function renderMedia() {
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  const items = mediaData[mediaType] || [];
  const visible = items.slice(mediaIndex, mediaIndex + 4);
  grid.innerHTML = visible.map(m => `
    <div class="media-card">
      <div class="media-card-img"><img src="${m.img}" alt=""></div>
      <div class="media-card-body">
        <div class="media-card-date">${m.date}</div>
        <h4>${m.title}</h4>
        <a class="media-card-link">Read more →</a>
      </div>
    </div>`).join('');
}
function mediaMove(dir) {
  const items = mediaData[mediaType] || [];
  const max = Math.max(0, items.length - 4);
  mediaIndex = Math.max(0, Math.min(max, mediaIndex + dir));
  renderMedia();
}
(function() {
  document.addEventListener('click', e => {
    const tab = e.target.closest('#mediaTabs .media-tab');
    if (!tab) return;
    document.querySelectorAll('#mediaTabs .media-tab').forEach(t => t.classList.toggle('active', t === tab));
    mediaType = tab.getAttribute('data-mtype');
    mediaIndex = 0;
    renderMedia();
  });
  renderMedia();
})();

// ============= UNIVERSAL IMAGE FALLBACK =============
// Şəkillər yüklənməsə kartlar pozulmasın
(function() {
  function handleImageError(img) {
    img.style.display = 'none';
    // Background image olan elementləri də idarə et
    const bg = img.closest('[style*="background-image"]');
    if (bg) {
      bg.style.background = 'linear-gradient(135deg, #C9A86A 0%, #8B6F47 60%, #6B5840 100%)';
    }
  }
  // Mövcud şəkilləri yoxla
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => handleImageError(img));
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
  });
  // Sonradan əlavə olunan şəkillər üçün
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const imgs = node.tagName === 'IMG' ? [node] : node.querySelectorAll?.('img') || [];
          imgs.forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
            if (img.complete && img.naturalWidth === 0) {
              handleImageError(img);
            }
          });
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

/* ================ A11Y: keyboard activation for clickable elements ================ */
(function () {
  function makeAccessible(el) {
    if (el.dataset.a11yReady === '1') return;
    var tag = el.tagName;
    // Native button / link with href / form control already keyboard-accessible
    if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') { el.dataset.a11yReady = '1'; return; }
    if (tag === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') { el.dataset.a11yReady = '1'; return; }
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    el.dataset.a11yReady = '1';
  }
  function enhanceAll() {
    document.querySelectorAll('[onclick]').forEach(makeAccessible);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target;
    if (!t || !t.hasAttribute || !t.hasAttribute('onclick')) return;
    var tag = t.tagName;
    if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (tag === 'A' && t.getAttribute('href') && t.getAttribute('href') !== '#') return;
    e.preventDefault();
    t.click();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAll);
  } else {
    enhanceAll();
  }
  // Re-scan on DOM mutations so dynamically rendered cards stay accessible
  var a11yObserver = new MutationObserver(function () { enhanceAll(); });
  a11yObserver.observe(document.body, { childList: true, subtree: true });
})();

/* ================ A11Y: favorite/heart buttons (aria-pressed) ================ */
(function () {
  function syncPressed(el) {
    if (!el.classList.contains('heart-btn') && !el.classList.contains('fav-btn') && !/heart|favorite|fav/i.test(el.className)) return;
    el.setAttribute('aria-pressed', el.classList.contains('active') ? 'true' : 'false');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Add to favorites');
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[onclick*="classList.toggle(\'active\')"]');
    if (!el) return;
    // Wait for the inline handler to flip the class
    setTimeout(function () { syncPressed(el); }, 0);
  });
  function init() {
    document.querySelectorAll('[onclick*="classList.toggle(\'active\')"]').forEach(syncPressed);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ================ A11Y: modal dialog role + focus management ================ */
(function () {
  var modal = document.getElementById('detailModal') || document.querySelector('.detail-modal, .modal');
  if (!modal) return;
  if (!modal.hasAttribute('role')) modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  if (!modal.hasAttribute('aria-label')) modal.setAttribute('aria-label', 'Details');
  var lastFocus = null;
  function focusableIn(root) {
    return root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
  }
  // Detect open state by class or inline display
  function isOpen() {
    var st = window.getComputedStyle(modal);
    return st.display !== 'none' && st.visibility !== 'hidden' && modal.classList.contains('active') || modal.classList.contains('open') || modal.classList.contains('show');
  }
  var openObserver = new MutationObserver(function () {
    var open = modal.classList.contains('active') || modal.classList.contains('open') || modal.classList.contains('show') || (modal.style.display && modal.style.display !== 'none');
    if (open) {
      lastFocus = document.activeElement;
      var first = focusableIn(modal)[0];
      if (first) try { first.focus(); } catch (e) {}
    } else if (lastFocus) {
      try { lastFocus.focus(); } catch (e) {}
      lastFocus = null;
    }
  });
  openObserver.observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
  // Focus trap
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = focusableIn(modal);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
