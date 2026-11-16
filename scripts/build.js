/**
 * Sri Lanka Tourism Platform Static Site Generator
 * Generates high-quality, SEO-optimized, responsive HTML pages:
 * - Homepage (18 comprehensive sections)
 * - 9 Province Pages (both .html and /index.html)
 * - 25 District Pages (both .html and /index.html)
 * - 151 Destination Pages (both .html and /index.html)
 * - Master Discovery Catalog (destinations.html)
 * - Interactive Sri Lanka Map (map.html)
 * - Travel Itineraries & Routes (itineraries.html)
 * - Admin Content Manager (admin/index.html)
 * - sitemap.xml & robots.txt
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Load datasets
const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const provinces = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'provinces.json'), 'utf8'));
const districts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'districts.json'), 'utf8'));
const itineraries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'itineraries.json'), 'utf8'));
const destinations = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'destinations.json'), 'utf8'));

console.log(`Building platform with ${provinces.length} provinces, ${districts.length} districts, ${destinations.length} destinations.`);

// Ensure directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDir(path.join(ROOT_DIR, 'provinces'));
ensureDir(path.join(ROOT_DIR, 'districts'));
ensureDir(path.join(ROOT_DIR, 'places'));
ensureDir(path.join(ROOT_DIR, 'admin'));

// Helper dictionaries
const provinceMap = new Map();
provinces.forEach(p => provinceMap.set(p.id, p));

const districtMap = new Map();
districts.forEach(d => districtMap.set(d.id, d));

const destinationMap = new Map();
destinations.forEach(d => destinationMap.set(d.slug, d));
destinations.forEach(d => destinationMap.set(d.id, d));

const categoryMap = new Map();
categories.forEach(c => categoryMap.set(c.id, c));

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPrefix(depth) {
  if (depth === 1) return '../';
  if (depth === 2) return '../../';
  return '';
}

// Navigation & Header template
function renderHeader(depth = 0, activeNav = '') {
  const p = getPrefix(depth);
  return `
  <!-- Top bar -->
  <div class="header-top d-none d-md-block">
    <div class="container d-flex justify-content-between align-items-center">
      <div>
        <span><i class="fa fa-compass text-warning mr-1"></i> Sri Lanka Tourism & Travel Discovery</span>
        <span class="mx-3 text-muted">|</span>
        <span><i class="fa fa-map-marker text-info mr-1"></i> 9 Provinces &bull; 25 Districts &bull; 150+ Curated Destinations</span>
      </div>
      <div>
        <a href="${p}destinations.html"><i class="fa fa-search"></i> Find Places</a>
        <a href="${p}map.html"><i class="fa fa-map"></i> Island Map</a>
        <a href="${p}itineraries.html"><i class="fa fa-calendar"></i> Itineraries</a>
      </div>
    </div>
  </div>

  <!-- Main Header -->
  <header class="header-area">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between main-menubar">
        <a href="${p}index.html" class="navbar-brand-text text-decoration-none">
          <i class="fa fa-leaf mr-2 text-success"></i>Visit Sri Lanka<span>.</span>
        </a>
        <nav class="d-none d-lg-flex align-items-center nav-menu">
          <a href="${p}index.html" class="${activeNav === 'home' ? 'active' : ''}">Home</a>
          <a href="${p}destinations.html" class="${activeNav === 'destinations' ? 'active' : ''}">Destinations</a>
          <div class="dropdown d-inline-block">
            <a href="#" class="dropdown-toggle ${activeNav === 'provinces' ? 'active' : ''}" data-toggle="dropdown">Provinces</a>
            <div class="dropdown-menu shadow-sm border-0">
              ${provinces.map(pr => `<a class="dropdown-item py-2" href="${p}provinces/${pr.slug}.html">${pr.name}</a>`).join('')}
            </div>
          </div>
          <div class="dropdown d-inline-block">
            <a href="#" class="dropdown-toggle ${activeNav === 'districts' ? 'active' : ''}" data-toggle="dropdown">Districts</a>
            <div class="dropdown-menu shadow-sm border-0" style="max-height: 400px; overflow-y: auto;">
              ${districts.map(dt => `<a class="dropdown-item py-1" href="${p}districts/${dt.slug}.html">${dt.name}</a>`).join('')}
            </div>
          </div>
          <a href="${p}itineraries.html" class="${activeNav === 'itineraries' ? 'active' : ''}">Itineraries</a>
          <a href="${p}map.html" class="${activeNav === 'map' ? 'active' : ''}">Map</a>
          <a href="${p}destinations.html" class="btn btn-sl-primary btn-sm ml-3 text-white"><i class="fa fa-compass"></i> Explore All</a>
        </nav>
        <button class="btn btn-sl-outline d-lg-none" type="button" data-toggle="collapse" data-target="#mobileNav">
          <i class="fa fa-bars"></i>
        </button>
      </div>
      <div class="collapse d-lg-none pb-3" id="mobileNav">
        <div class="d-flex flex-column gap-2 pt-2">
          <a href="${p}index.html" class="py-2">Home</a>
          <a href="${p}destinations.html" class="py-2">Destinations (150+)</a>
          <a href="${p}map.html" class="py-2">Interactive Map</a>
          <a href="${p}itineraries.html" class="py-2">Travel Itineraries</a>
          <div class="py-2 font-weight-bold text-muted">Provinces:</div>
          <div class="pl-2">
            ${provinces.map(pr => `<a href="${p}provinces/${pr.slug}.html" class="d-block py-1 text-muted">${pr.name}</a>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

// Footer template
function renderFooter(depth = 0) {
  const p = getPrefix(depth);
  return `
  <footer class="sl-footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
          <h4 class="text-white font-weight-bold mb-3"><i class="fa fa-leaf text-success mr-2"></i>Visit Sri Lanka</h4>
          <p class="text-muted pr-lg-4">Your official independent discovery platform covering all 9 provinces, 25 districts, and over 150 curated natural attractions, cultural monuments, wildlife reserves, and hidden gems across the Pearl of the Indian Ocean.</p>
        </div>

        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <h5>All 9 Provinces</h5>
          <ul class="list-unstyled">
            ${provinces.map(pr => `<li><a href="${p}provinces/${pr.slug}.html"><i class="fa fa-angle-right mr-2 text-teal"></i>${pr.name}</a></li>`).join('')}
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <h5>Popular Districts</h5>
          <ul class="list-unstyled">
            <li><a href="${p}districts/colombo.html"><i class="fa fa-angle-right mr-2"></i>Colombo District</a></li>
            <li><a href="${p}districts/kandy.html"><i class="fa fa-angle-right mr-2"></i>Kandy District</a></li>
            <li><a href="${p}districts/galle.html"><i class="fa fa-angle-right mr-2"></i>Galle District</a></li>
            <li><a href="${p}districts/matale.html"><i class="fa fa-angle-right mr-2"></i>Matale (Sigiriya)</a></li>
            <li><a href="${p}districts/nuwara-eliya.html"><i class="fa fa-angle-right mr-2"></i>Nuwara Eliya</a></li>
            <li><a href="${p}districts/badulla.html"><i class="fa fa-angle-right mr-2"></i>Badulla (Ella)</a></li>
            <li><a href="${p}districts/jaffna.html"><i class="fa fa-angle-right mr-2"></i>Jaffna District</a></li>
            <li><a href="${p}districts/trincomalee.html"><i class="fa fa-angle-right mr-2"></i>Trincomalee District</a></li>
          </ul>
        </div>

        <div class="col-lg-2 col-md-6">
          <h5>Discovery Links</h5>
          <ul class="list-unstyled">
            <li><a href="${p}destinations.html"><i class="fa fa-compass mr-2"></i>All Places</a></li>
            <li><a href="${p}map.html"><i class="fa fa-map mr-2"></i>Interactive Map</a></li>
            <li><a href="${p}itineraries.html"><i class="fa fa-calendar mr-2"></i>Itineraries</a></li>
            <li><a href="${p}admin/index.html"><i class="fa fa-cog mr-2"></i>Content Explorer</a></li>
          </ul>
        </div>
      </div>

      <!-- Trust & Platform Commitment Badges Strip -->
      <div class="sl-footer-badges">
        <div class="sl-footer-badge-item">
          <i class="fa fa-unlock-alt"></i>
          <span>100% Free &amp; Open Access</span>
        </div>
        <div class="sl-footer-badge-item">
          <i class="fa fa-map-marker"></i>
          <span>Verified GPS Coordinates</span>
        </div>
        <div class="sl-footer-badge-item">
          <i class="fa fa-shield"></i>
          <span>Zero Paid Sponsorships</span>
        </div>
        <div class="sl-footer-badge-item">
          <i class="fa fa-camera"></i>
          <span>Authentic Place Photography</span>
        </div>
      </div>

      <div class="sl-footer-bottom text-center">
        <p class="mb-2 text-muted">&copy; 2026 <strong class="text-white font-weight-600">Visit Sri Lanka Discovery Platform</strong> &bull; Developed by <a href="https://www.sadeeshajayaweera.dev/" target="_blank" rel="noopener">Sadeesha Jayaweera</a></p>
        <p class="mb-0 text-muted sl-footer-attribution">Photographs via Unsplash &amp; Wikimedia Commons contributors under open educational &amp; creative commons licenses.</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="${p}js/vendor/jquery-2.2.4.min.js"></script>
  <script src="${p}js/vendor/bootstrap.min.js"></script>
  <script src="${p}js/jquery.magnific-popup.min.js"></script>
  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <!-- Compiled platform data bundle -->
  <script src="${p}js/destinations-data.js"></script>
  <!-- Platform client logic -->
  <script src="${p}js/tourism-platform.js"></script>
  `;
}

// Asset path resolver across different folder depths
function resolveAssetPath(url, depth = 0) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:')) {
    return url;
  }
  const p = typeof depth === 'string' ? depth : getPrefix(depth);
  const clean = url.replace(/^\/+/, '');
  return `${p}${clean}`;
}

// Category fallback helper using 100% reliable local Sri Lanka photographs
function getCategoryFallback(category, depth = 0) {
  const p = typeof depth === 'string' ? depth : getPrefix(depth);
  const fallbacks = {
    'beaches-coastal': `${p}img/galle.jpg`,
    'islands': `${p}img/Tourist_SriLanka.jpg`,
    'surfing-spots': `${p}img/Tourist_SriLanka.jpg`,
    'historical-sites': `${p}img/dambulla.jpg`,
    'ancient-cities': `${p}img/sl2.jpg`,
    'unesco-world-heritage': `${p}img/dambulla.jpg`,
    'wildlife-safari': `${p}img/yala.webp`,
    'wildlife-safaris': `${p}img/yala.webp`,
    'national-parks': `${p}img/yala.webp`,
    'nature-reserves': `${p}img/sl5.jpg`,
    'waterfalls': `${p}img/nuwaraeliya.jpg`,
    'mountains-highlands': `${p}img/nuwaraeliya.jpg`,
    'tea-plantations': `${p}img/nuwaraeliya.jpg`,
    'cultural-spiritual': `${p}img/kandy.jpg`,
    'buddhist-temples': `${p}img/kandy.jpg`,
    'hindu-temples': `${p}img/kandy.jpg`,
    'religious-spiritual': `${p}img/kandy.jpg`,
    'botanical-gardens': `${p}img/nuwaraeliya.jpg`,
    'adventure-outdoor': `${p}img/sl8.jpg`,
    'rainforests': `${p}img/sl5.jpg`
  };
  return fallbacks[category] || `${p}img/Tourist_SriLanka.jpg`;
}

// Format district name cleanly, eliminating any double "District"
function formatDistrictName(nameOrId) {
  if (!nameOrId) return '';
  const dist = districtMap.get(nameOrId);
  const raw = dist ? dist.name : nameOrId;
  return raw.replace(/\s+District$/i, '');
}

// Destination Card component
function renderDestinationCard(dest, depth = 0) {
  const p = getPrefix(depth);
  const fallbackImg = getCategoryFallback(dest.category, depth);
  const rawImg = (dest.images && dest.images[0] && dest.images[0].imageUrl) || fallbackImg;
  const heroImg = resolveAssetPath(rawImg, depth);
  const cleanDistName = formatDistrictName(dest.districtId);
  const cat = categoryMap.get(dest.category);
  const catName = cat ? cat.name : (dest.category || 'Attraction');
  const gemBadge = dest.hiddenGem ? `<div class="sl-badge-gem"><i class="fa fa-diamond"></i> Hidden Gem</div>` : '';

  return `
  <div class="col-lg-4 col-md-6 mb-4">
    <div class="sl-card">
      <div class="sl-card-img-wrap">
        <img src="${heroImg}" alt="${escapeHtml(dest.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackImg}';">
        <span class="sl-badge-category">${escapeHtml(catName)}</span>
        ${gemBadge}
      </div>
      <div class="sl-card-body">
        <div class="sl-card-location"><i class="fa fa-map-pin"></i> ${escapeHtml(cleanDistName)} District</div>
        <h3 class="sl-card-title"><a href="${p}places/${dest.slug}.html">${escapeHtml(dest.name)}</a></h3>
        <p class="sl-card-text">${escapeHtml(dest.shortDescription || '')}</p>
        <div class="sl-card-footer">
          <div class="sl-card-meta"><i class="fa fa-clock-o"></i> ${escapeHtml(dest.visitingDuration || '2-3 Hours')}</div>
          <a href="${p}places/${dest.slug}.html" class="btn btn-sm btn-sl-primary">Explore Guide <i class="fa fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </div>`;
}

// -------------------------------------------------------------
// 1. GENERATE HOMEPAGE (index.html)
// -------------------------------------------------------------
function generateHomepage() {
  console.log('Generating index.html...');
  const p = '';
  
  // Slices for the 18 sections
  const popularDests = destinations.filter(d => d.popular).slice(0, 6);
  const hiddenGems = destinations.filter(d => d.hiddenGem).slice(0, 6);
  const naturalWonders = destinations.filter(d => ['nature-reserves', 'mountains-highlands', 'waterfalls', 'rainforests'].includes(d.category)).slice(0, 6);
  const beautifulBeaches = destinations.filter(d => ['beaches-coastal', 'islands', 'surfing-spots'].includes(d.category)).slice(0, 6);
  const heritageSites = destinations.filter(d => ['historical-sites', 'unesco-world-heritage', 'ancient-cities'].includes(d.category)).slice(0, 6);
  const wildlifeSafaris = destinations.filter(d => ['wildlife-safaris', 'national-parks'].includes(d.category)).slice(0, 6);
  const mountainWaterfalls = destinations.filter(d => ['waterfalls', 'mountains-highlands'].includes(d.category)).slice(0, 6);
  const adventureDests = destinations.filter(d => ['adventure-sports', 'surfing-spots', 'hiking-trails'].includes(d.category)).slice(0, 6);
  const spiritualPlaces = destinations.filter(d => ['buddhist-temples', 'hindu-temples', 'religious-spiritual'].includes(d.category)).slice(0, 6);
  const recentlyAdded = destinations.slice(-6);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>Visit Sri Lanka | Comprehensive Island Travel & Tourism Discovery Platform</title>
  <meta name="description" content="Discover the wonder of Sri Lanka. Comprehensive travel discovery covering all 9 provinces, 25 districts, and 150+ iconic destinations, waterfalls, UNESCO ruins, wildlife safaris, and pristine beaches.">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png?v=4">
  <!-- OpenGraph -->
  <meta property="og:title" content="Visit Sri Lanka | Official Travel Discovery Platform">
  <meta property="og:description" content="Explore all 9 provinces, 25 districts, and 150+ verified destinations with interactive maps, rich travel guides, and authentic itineraries.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80">
  <meta property="og:type" content="website">

  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/magnific-popup.css">
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="css/tourism-platform.css">

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Visit Sri Lanka Discovery Platform",
    "url": "https://visitsrilanka.gov.lk/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://visitsrilanka.gov.lk/destinations.html?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
</head>
<body>

  ${renderHeader(0, 'home')}

  <!-- 1. HERO SECTION & LIVE SEARCH -->
  <section class="sl-hero">
    <div class="container">
      <div class="sl-hero-content">
        <div class="sl-hero-badge"><i class="fa fa-sparkles mr-1"></i> The Wonder of Asia</div>
        <h1 class="sl-hero-title">Discover the Wonder of Sri Lanka</h1>
        <p class="sl-hero-subtitle">From golden beaches and mist-covered mountains to ancient kingdoms and breathtaking wildlife, explore an island filled with unforgettable experiences.</p>
        
        <!-- Live Search Box -->
        <div class="sl-search-box">
          <i class="fa fa-search search-icon"></i>
          <input type="text" id="sl-hero-search-input" class="form-control" placeholder="Search destinations, beaches, waterfalls, temples, wildlife... (e.g. Ella, Sigiriya, Mirissa)" autocomplete="off">
          <div id="sl-search-dropdown" class="sl-search-dropdown"></div>
        </div>

        <div class="sl-search-chips">
          <span class="text-white font-weight-bold mr-1" style="font-size: 13px;">Popular:</span>
          <span class="sl-search-chip" data-search="Sigiriya">Sigiriya</span>
          <span class="sl-search-chip" data-search="Ella">Ella</span>
          <span class="sl-search-chip" data-search="Galle Fort">Galle Fort</span>
          <span class="sl-search-chip" data-search="Beaches">Beaches</span>
          <span class="sl-search-chip" data-search="Waterfalls">Waterfalls</span>
          <span class="sl-search-chip" data-search="Wildlife">Wildlife Safaris</span>
          <span class="sl-search-chip" data-search="Kandy">Kandy</span>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-4">
          <a href="#provinces-section" class="btn btn-sl-primary"><i class="fa fa-map mr-1"></i> Discover Provinces</a>
          <a href="destinations.html" class="btn btn-sl-secondary"><i class="fa fa-compass mr-1"></i> Explore 150+ Places</a>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  <div class="container">
    <div class="sl-stats-bar">
      <div class="row">
        <div class="col-md-3 col-6 sl-stat-box">
          <div class="sl-stat-number">9</div>
          <div class="sl-stat-label">Provinces Covered</div>
        </div>
        <div class="col-md-3 col-6 sl-stat-box">
          <div class="sl-stat-number">25</div>
          <div class="sl-stat-label">Districts Detailed</div>
        </div>
        <div class="col-md-3 col-6 sl-stat-box">
          <div class="sl-stat-number">151</div>
          <div class="sl-stat-label">Curated Destinations</div>
        </div>
        <div class="col-md-3 col-6 sl-stat-box">
          <div class="sl-stat-number">8</div>
          <div class="sl-stat-label">UNESCO World Heritage Sites</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. EXPLORE SRI LANKA BY PROVINCE -->
  <section id="provinces-section" class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header text-center">
        <span class="sl-section-subtitle">Geographical Wonder</span>
        <h2 class="sl-section-title">Explore Sri Lanka by Province</h2>
        <p class="sl-section-desc mx-auto">From the bustling coastal hub of the Western Province to the cultural mountains of Central and northern archipelagos, discover all nine unique administrative regions.</p>
      </div>

      <div class="row">
        ${provinces.map(pr => `
        <div class="col-lg-4 col-md-6 mb-4">
          <a href="provinces/${pr.slug}.html" class="sl-geo-card">
            <img src="${resolveAssetPath(pr.heroImage, 0)}" alt="${escapeHtml(pr.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='img/Tourist_SriLanka.jpg';">
            <div class="sl-geo-overlay">
              <span class="sl-geo-tag">Province</span>
              <h3 class="sl-geo-title">${escapeHtml(pr.name)}</h3>
              <div class="sl-geo-meta">
                <span><i class="fa fa-building-o"></i> ${escapeHtml(pr.capital)}</span>
                <span><i class="fa fa-map-marker"></i> ${pr.districts ? pr.districts.length : 0} Districts</span>
              </div>
            </div>
          </a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 3. EXPLORE SRI LANKA BY DISTRICT -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header d-flex flex-column flex-md-row justify-content-between align-items-md-end">
        <div>
          <span class="sl-section-subtitle">Administrative Discovery</span>
          <h2 class="sl-section-title mb-0">Explore All 25 Districts</h2>
          <p class="sl-section-desc mb-0">Every district has its own distinct heritage, geographical character, culinary delights, and adventures.</p>
        </div>
        <a href="destinations.html" class="btn btn-sl-outline mt-3 mt-md-0">View Catalog <i class="fa fa-arrow-right"></i></a>
      </div>

      <div class="row mt-4">
        ${districts.map(dt => `
        <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
          <div class="sl-card" style="min-height: 220px;">
            <div class="sl-card-body">
              <div class="sl-card-location"><i class="fa fa-map-marker"></i> ${formatProvinceName(dt.provinceId)}</div>
              <h4 class="sl-card-title mb-2"><a href="districts/${dt.slug}.html">${escapeHtml(formatDistrictName(dt.name))} District</a></h4>
              <p class="sl-card-text mb-3" style="-webkit-line-clamp: 2;">${escapeHtml(dt.overview || '')}</p>
              <div class="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                <span class="text-muted" style="font-size: 12px;"><i class="fa fa-flag"></i> ${escapeHtml(dt.capital)}</span>
                <a href="districts/${dt.slug}.html" class="btn btn-xs btn-sl-outline" style="font-size: 11px; padding: 4px 10px;">Explore District &raquo;</a>
              </div>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 4. MOST POPULAR DESTINATIONS -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header text-center">
        <span class="sl-section-subtitle">Iconic Highlights</span>
        <h2 class="sl-section-title">Most Popular Destinations</h2>
        <p class="sl-section-desc mx-auto">World-renowned landmarks, iconic UNESCO fortresses, and unforgettable experiences that define a journey to Sri Lanka.</p>
      </div>
      <div class="row">
        ${popularDests.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
      <div class="text-center mt-3">
        <a href="destinations.html?filter=popular" class="btn btn-sl-primary btn-lg">Browse All Popular Places <i class="fa fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

  <!-- 5. HIDDEN GEMS OF SRI LANKA -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle"><i class="fa fa-diamond text-warning"></i> Off the Beaten Track</span>
        <h2 class="sl-section-title">Hidden Gems of Sri Lanka</h2>
        <p class="sl-section-desc">Pristine isolated islands, ancient forest monasteries, and uncrowded wilderness viewpoints untouched by mass tourism.</p>
      </div>
      <div class="row">
        ${hiddenGems.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
      <div class="text-center mt-3">
        <a href="destinations.html?filter=hiddengem" class="btn btn-sl-secondary btn-lg">Discover More Hidden Gems <i class="fa fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

  <!-- 6. NATURAL WONDERS -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Pristine Landscapes</span>
        <h2 class="sl-section-title">Natural Wonders</h2>
        <p class="sl-section-desc">Prehistoric primary rainforests, dramatic cliff precipices, and mountain ranges home to extraordinary endemic biodiversity.</p>
      </div>
      <div class="row">
        ${naturalWonders.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 7. BEAUTIFUL BEACHES -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Tropical Coastlines</span>
        <h2 class="sl-section-title">Beautiful Beaches & Surf Breaks</h2>
        <p class="sl-section-desc">Over 1,340 kilometers of coastline offering tranquil turquoise lagoons, world-tour surf point breaks, and powdery white sand bays.</p>
      </div>
      <div class="row">
        ${beautifulBeaches.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 8. HISTORICAL AND CULTURAL HERITAGE -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">2,500 Years of Civilization</span>
        <h2 class="sl-section-title">Historical & Cultural Heritage</h2>
        <p class="sl-section-desc">Grand monolithic rock citadels, colossal brick stupas, and medieval hydraulic irrigation marvels of ancient Sinhalese kings.</p>
      </div>
      <div class="row">
        ${heritageSites.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 9. WILDLIFE AND NATIONAL PARKS -->
  <section class="sl-section sl-section-dark">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle" style="color: #4ade80;"><i class="fa fa-paw"></i> Wildlife Expeditions</span>
        <h2 class="sl-section-title">Wildlife & National Parks</h2>
        <p class="sl-section-desc">One of the greatest biodiversity hotspots on Earth: home to high leopard densities, massive elephant gatherings, and migratory marine giants.</p>
      </div>
      <div class="row">
        ${wildlifeSafaris.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 10. MOUNTAINS AND WATERFALLS -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Highland Mist & Cascades</span>
        <h2 class="sl-section-title">Mountains & Cascading Waterfalls</h2>
        <p class="sl-section-desc">Sri Lanka has over 400 waterfalls nestled amidst mist-shrouded tea plantations and soaring central peaks.</p>
      </div>
      <div class="row">
        ${mountainWaterfalls.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 11. ADVENTURE AND OUTDOOR EXPERIENCES -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Adrenaline & Active Exploration</span>
        <h2 class="sl-section-title">Adventure & Outdoor Experiences</h2>
        <p class="sl-section-desc">White water rafting down the Kelani River, world-class kitesurfing in Kalpitiya, and trekking through the Knuckles wilderness.</p>
      </div>
      <div class="row">
        ${adventureDests.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 12. RELIGIOUS AND SPIRITUAL DESTINATIONS -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Sacred Sanctuaries</span>
        <h2 class="sl-section-title">Religious & Spiritual Destinations</h2>
        <p class="sl-section-desc">Sacred sites revered across Buddhism, Hinduism, Islam, and Christianity, including the Temple of the Sacred Tooth Relic and Kataragama.</p>
      </div>
      <div class="row">
        ${spiritualPlaces.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 13. DISCOVER SRI LANKAN CULTURE -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header text-center">
        <span class="sl-section-subtitle">Vibrant Living Traditions</span>
        <h2 class="sl-section-title">Discover Sri Lankan Culture</h2>
        <p class="sl-section-desc mx-auto">Immerse yourself in authentic experiences that have flourished for millennia across this multifaceted island.</p>
      </div>

      <div class="row">
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="sl-card p-4 text-center">
            <div style="font-size: 38px; color: #0f766e; margin-bottom: 12px;"><i class="fa fa-coffee"></i></div>
            <h4 class="font-weight-bold mb-2">World Famous Ceylon Tea</h4>
            <p class="text-muted" style="font-size: 13.5px;">Tour historic highland estates, witness hand-plucking of the two leaves and a bud, and taste premium single-estate orthodox teas.</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="sl-card p-4 text-center">
            <div style="font-size: 38px; color: #d97706; margin-bottom: 12px;"><i class="fa fa-cutlery"></i></div>
            <h4 class="font-weight-bold mb-2">Exquisite Island Spices & Cuisine</h4>
            <p class="text-muted" style="font-size: 13.5px;">Savor authentic Sri Lankan rice and curry, fresh coconut sambol, hoppers, Jaffna crab curry, and true Ceylon cinnamon.</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="sl-card p-4 text-center">
            <div style="font-size: 38px; color: #881337; margin-bottom: 12px;"><i class="fa fa-music"></i></div>
            <h4 class="font-weight-bold mb-2">Festivals & Traditional Drumming</h4>
            <p class="text-muted" style="font-size: 13.5px;">Experience the hypnotic beats of Geta Bera drums and the world-famous Kandy Esala Perahera pageant under the full moon.</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="sl-card p-4 text-center">
            <div style="font-size: 38px; color: #0284c7; margin-bottom: 12px;"><i class="fa fa-paint-brush"></i></div>
            <h4 class="font-weight-bold mb-2">Handicrafts & Gemstones</h4>
            <p class="text-muted" style="font-size: 13.5px;">Marvel at traditional Dumbara weaving, intricate brass metalwork, devil dance masks of Ambalangoda, and legendary Ceylon blue sapphires.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 14. RECOMMENDED TRAVEL ROUTES & ITINERARIES -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header d-flex flex-column flex-md-row justify-content-between align-items-md-end">
        <div>
          <span class="sl-section-subtitle">Expert Route Planning</span>
          <h2 class="sl-section-title mb-0">Recommended Travel Routes</h2>
          <p class="sl-section-desc mb-0">Carefully curated journey blueprints from quick 3-day express highlights to comprehensive 21-day all-province odysseys.</p>
        </div>
        <a href="itineraries.html" class="btn btn-sl-primary mt-3 mt-md-0">View All 14 Itineraries &raquo;</a>
      </div>

      <div class="row mt-4">
        ${itineraries.durationItineraries.slice(0, 3).map(it => `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-itinerary-card">
            <div class="sl-card-img-wrap" style="aspect-ratio: 16/9;">
              <img src="${resolveAssetPath(it.heroImage, 0)}" alt="${escapeHtml(it.title)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='img/Tourist_SriLanka.jpg';">
              <span class="sl-itinerary-badge position-absolute" style="top: 14px; left: 14px;"><i class="fa fa-calendar"></i> ${escapeHtml(it.duration)}</span>
            </div>
            <div class="sl-card-body">
              <h4 class="font-weight-bold mb-2"><a href="itineraries.html#${it.slug}" class="text-dark">${escapeHtml(it.title)}</a></h4>
              <p class="text-muted small mb-3">${escapeHtml(it.tagline)}</p>
              <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <span class="text-muted small"><i class="fa fa-car mr-1 text-teal"></i> ${it.days.length} Days</span>
                <a href="itineraries.html#${it.slug}" class="btn btn-sm btn-sl-outline">View Route Plan &raquo;</a>
              </div>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 15. BEST PLACES TO VISIT BY SEASON -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header text-center">
        <span class="sl-section-subtitle">Year-Round Tropical Paradise</span>
        <h2 class="sl-section-title">Best Places to Visit by Season</h2>
        <p class="sl-section-desc mx-auto">Sri Lanka enjoys dual monsoon cycles, meaning that when one coast receives rain, the other enjoys brilliant sunshine.</p>
      </div>

      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="sl-card p-4 border-left" style="border-left: 6px solid #0f766e !important;">
            <div class="d-flex align-items-center mb-3">
              <div style="font-size: 28px; color: #0f766e; margin-right: 14px;"><i class="fa fa-sun-o"></i></div>
              <div>
                <h4 class="font-weight-bold mb-0">December to April (South & West Coast Season)</h4>
                <span class="text-muted small">Peak Season for Galle, Mirissa, Colombo & Central Highlands</span>
              </div>
            </div>
            <p class="text-muted">The southwest coast and central hill country enjoy warm, sunny, dry days and calm seas. Ideal for whale watching in Mirissa, surfing in Weligama, climbing Adam's Peak, and exploring Galle Fort.</p>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <span class="badge badge-light p-2 border">Galle Fort</span>
              <span class="badge badge-light p-2 border">Mirissa</span>
              <span class="badge badge-light p-2 border">Ella</span>
              <span class="badge badge-light p-2 border">Horton Plains</span>
              <span class="badge badge-light p-2 border">Bentota</span>
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="sl-card p-4 border-left" style="border-left: 6px solid #d97706 !important;">
            <div class="d-flex align-items-center mb-3">
              <div style="font-size: 28px; color: #d97706; margin-right: 14px;"><i class="fa fa-water"></i></div>
              <div>
                <h4 class="font-weight-bold mb-0">May to September (East Coast & Cultural Triangle)</h4>
                <span class="text-muted small">Peak Season for Trincomalee, Pasikudah, Arugam Bay & Jaffna</span>
              </div>
            </div>
            <p class="text-muted">While monsoon rains touch the southwest, the eastern shores and northern plains bask in brilliant sunshine and glassy waters. Prime time for world-class surfing at Arugam Bay and snorkeling at Pigeon Island.</p>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <span class="badge badge-light p-2 border">Arugam Bay</span>
              <span class="badge badge-light p-2 border">Nilaveli Beach</span>
              <span class="badge badge-light p-2 border">Pigeon Island</span>
              <span class="badge badge-light p-2 border">Pasikudah</span>
              <span class="badge badge-light p-2 border">Sigiriya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 16. RECENTLY ADDED DESTINATIONS -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Fresh Additions</span>
        <h2 class="sl-section-title">Recently Added Highlights</h2>
        <p class="sl-section-desc">Continually expanding our verified repository with hidden archaeological sanctuaries and pristine nature spots.</p>
      </div>
      <div class="row">
        ${recentlyAdded.map(d => renderDestinationCard(d, 0)).join('')}
      </div>
    </div>
  </section>

  <!-- 17. TRAVEL PLANNING INFORMATION -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header text-center">
        <span class="sl-section-subtitle">Practical Visitor Guide</span>
        <h2 class="sl-section-title">Essential Travel Planning Information</h2>
        <p class="sl-section-desc mx-auto">Key practical information to ensure your Sri Lankan holiday is smooth, memorable, and culturally respectful.</p>
      </div>

      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card p-4">
            <h5 class="font-weight-bold mb-3"><i class="fa fa-id-card text-teal mr-2"></i>Visa & Entry Requirements</h5>
            <p class="text-muted small">Most nationalities must obtain an Electronic Travel Authorization (ETA) online before arriving in Sri Lanka via the official government portal. Ensure your passport is valid for at least 6 months beyond entry.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card p-4">
            <h5 class="font-weight-bold mb-3"><i class="fa fa-money text-teal mr-2"></i>Currency & Payments</h5>
            <p class="text-muted small">The official currency is the Sri Lankan Rupee (LKR). ATMs are widely available across major cities and tourist towns. Credit cards are widely accepted at hotels and restaurants; carry cash for street markets and tuk-tuks.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card p-4">
            <h5 class="font-weight-bold mb-3"><i class="fa fa-train text-teal mr-2"></i>Transportation & Getting Around</h5>
            <p class="text-muted small">Sri Lanka has a picturesque railway network connecting Colombo, Kandy, Nuwara Eliya, Ella, and the Southern Coast. Modern Southern and Central Expressways ensure swift travel by private vehicle or highway AC bus.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card p-4">
            <h5 class="font-weight-bold mb-3"><i class="fa fa-heart text-teal mr-2"></i>Cultural Etiquette</h5>
            <p class="text-muted small">When visiting Buddhist temples and Hindu kovils, remove shoes and hats. Dress modestly covering shoulders and knees. Never pose for photos with your back turned directly against a Buddha statue.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card p-4">
            <h5 class="font-weight-bold mb-3"><i class="fa fa-plug text-teal mr-2"></i>Electricity & Connectivity</h5>
            <p class="text-muted small">Standard voltage is 230V (50Hz) using UK-style Type G (three rectangular pins) and Type D plugs. Tourist 4G/5G SIM cards (Dialog, Mobitel) can be purchased immediately at the CMB arrival hall with extensive high-speed island coverage.</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card p-4">
            <h5 class="font-weight-bold mb-3"><i class="fa fa-shield text-teal mr-2"></i>Health & Safety</h5>
            <p class="text-muted small">Sri Lanka is one of Asia's safest travel destinations with friendly, welcoming locals. Drink filtered or bottled water, apply tropical mosquito repellent, and use sun protection when exploring during midday.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 18. FOOTER -->
  ${renderFooter(0)}

</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');
  console.log('Homepage index.html generated successfully.');
}

// -------------------------------------------------------------
// 2. GENERATE PROVINCE PAGES (provinces/[slug].html and /index.html)
// -------------------------------------------------------------
function generateProvincePages() {
  console.log(`Generating ${provinces.length} province pages...`);

  provinces.forEach(pr => {
    const provinceDests = destinations.filter(d => d.provinceId === pr.id);
    const provinceDistricts = districts.filter(d => d.provinceId === pr.id);
    const hiddenGems = provinceDests.filter(d => d.hiddenGem);
    const popularDests = provinceDests.filter(d => d.popular);

    const prLat = typeof pr.latitude === 'number' ? pr.latitude : 7.8731;
    const prLng = typeof pr.longitude === 'number' ? pr.longitude : 80.7718;
    const prArea = pr.areaKm2 ? `${pr.areaKm2.toLocaleString()} km²` : (pr.area || 'N/A');
    const prOverview = pr.shortDescription || pr.fullDescription || '';
    const prGeo = pr.geographicalInformation || {};
    const prTerrain = prGeo.terrain || 'Coastal lowlands, lagoons, and interior mountain valleys';
    const prClimate = prGeo.climate || 'Tropical climate';
    const prRivers = Array.isArray(prGeo.majorRivers) ? prGeo.majorRivers.join(', ') : (prGeo.majorRivers || 'Multiple river basins');
    const prNatural = pr.naturalAttractionsSummary || 'Protected nature reserves, botanical gardens and wildlife habitats.';
    const prActivities = pr.highlights || pr.recommendedActivities || [];

    function createProvinceHtml(depth) {
      const p = getPrefix(depth);
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>${escapeHtml(pr.name)} Travel & Tourism Guide | Visit Sri Lanka</title>
  <meta name="description" content="Complete travel guide to ${escapeHtml(pr.name)}, Sri Lanka. Explore capital ${escapeHtml(pr.capital)}, ${provinceDistricts.length} districts, ${provinceDests.length} top tourist destinations, nature reserves, and hidden gems.">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/provinces/${pr.slug}.html">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="${p}favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="${p}img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="${p}img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="${p}img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="${p}img/apple-touch-icon.png?v=4">
  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(pr.name)} Travel Guide | Visit Sri Lanka">
  <meta property="og:description" content="${escapeHtml(prOverview)}">
  <meta property="og:image" content="${resolveAssetPath(pr.heroImage, depth)}">

  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/bootstrap.css">
  <link rel="stylesheet" href="${p}css/font-awesome.min.css">
  <link rel="stylesheet" href="${p}css/magnific-popup.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="${p}css/tourism-platform.css">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "${escapeHtml(pr.name)}",
    "description": "${escapeHtml(prOverview)}",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${prLat},
      "longitude": ${prLng}
    }
  }
  </script>
</head>
<body>

  ${renderHeader(depth, 'provinces')}

  <!-- Detail Hero Banner -->
  <section class="sl-detail-hero" style="background-image: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('${resolveAssetPath(pr.heroImage, depth)}');">
    <div class="container">
      <div class="sl-breadcrumbs">
        <a href="${p}index.html">Home</a> <span>/</span>
        <a href="${p}index.html#provinces-section">Provinces</a> <span>/</span>
        <span class="text-white">${escapeHtml(pr.name)}</span>
      </div>
      <h1 class="sl-detail-title">${escapeHtml(pr.name)}</h1>
      <p class="lead text-light mb-0" style="max-width: 800px;">${escapeHtml(pr.sinhalaName)} | ${escapeHtml(pr.tamilName)}</p>
      
      <div class="sl-pills-bar">
        <div class="sl-pill"><i class="fa fa-flag text-warning"></i> Capital: ${escapeHtml(pr.capital)}</div>
        <div class="sl-pill"><i class="fa fa-map-o text-info"></i> Area: ${escapeHtml(prArea)}</div>
        <div class="sl-pill"><i class="fa fa-map-pin text-success"></i> ${provinceDistricts.length} Districts</div>
        <div class="sl-pill"><i class="fa fa-compass text-warning"></i> ${provinceDests.length} Curated Places</div>
        <div class="sl-pill"><i class="fa fa-calendar text-white"></i> Duration: ${escapeHtml(pr.suggestedDuration || '2-4 Days')}</div>
      </div>
    </div>
  </section>

  <!-- Province Overview & Stats -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <h2 class="font-weight-bold mb-3">Overview & Character</h2>
          <p class="lead text-secondary">${escapeHtml(prOverview)}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Geographical & Climate Characteristics</h3>
          <p>${escapeHtml(prTerrain)}. ${escapeHtml(prClimate)}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Cultural & Historical Significance</h3>
          <p>${escapeHtml(pr.culturalSignificance || '')}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Unique Natural Attractions</h3>
          <p>${escapeHtml(prNatural)}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Recommended Activities & Experiences</h3>
          <div class="d-flex flex-wrap gap-2 mb-4">
            ${prActivities.map(act => `<span class="badge badge-light p-2 border font-weight-normal"><i class="fa fa-check text-success mr-1"></i> ${escapeHtml(act)}</span>`).join('')}
          </div>
        </div>

        <div class="col-lg-4">
          <div class="sl-sidebar-box">
            <h4>Province Quick Facts</h4>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Provincial Capital</span>
              <span class="sl-fact-value">${escapeHtml(pr.capital)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Total Land Area</span>
              <span class="sl-fact-value">${escapeHtml(prArea)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Terrain Profile</span>
              <span class="sl-fact-value">${escapeHtml(prTerrain)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Climate Zone</span>
              <span class="sl-fact-value">${escapeHtml(prClimate)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Major River Basins</span>
              <span class="sl-fact-value">${escapeHtml(prRivers)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">GPS Center</span>
              <span class="sl-fact-value">${prLat.toFixed(2)}° N, ${prLng.toFixed(2)}° E</span>
            </div>
          </div>

          <!-- Mini Interactive Map of Province Destinations -->
          <div class="sl-sidebar-box">
            <h4><i class="fa fa-map-marker text-teal mr-1"></i> Interactive Province Map</h4>
            <div id="geo-area-map" class="sl-map-container" data-type="province" data-id="${pr.id}"></div>
            <small class="text-muted mt-2 d-block text-center">Showing all ${provinceDests.length} destinations in ${escapeHtml(pr.name)}.</small>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Districts within this Province -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Districts in ${escapeHtml(pr.name)}</span>
        <h2 class="sl-section-title">Administrative Districts</h2>
        <p class="sl-section-desc">Each district possesses unique landscapes, cultural attractions, and local hospitality.</p>
      </div>

      <div class="row">
        ${provinceDistricts.map(dt => `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="sl-card">
            <div class="sl-card-img-wrap">
              <img src="${resolveAssetPath(dt.heroImage, depth)}" alt="${escapeHtml(dt.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${p}img/Tourist_SriLanka.jpg';">
              <span class="sl-badge-category">District</span>
            </div>
            <div class="sl-card-body">
              <div class="sl-card-location"><i class="fa fa-map-marker"></i> District</div>
              <h3 class="sl-card-title"><a href="${p}districts/${dt.slug}.html">${escapeHtml(formatDistrictName(dt.name))} District</a></h3>
              <p class="sl-card-text">${escapeHtml(dt.overview || '')}</p>
              <div class="sl-card-footer">
                <span class="text-muted small"><i class="fa fa-building-o"></i> ${escapeHtml(dt.capital)}</span>
                <a href="${p}districts/${dt.slug}.html" class="btn btn-sm btn-sl-outline">View District &raquo;</a>
              </div>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Popular Destinations in this Province -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Must-Visit Places</span>
        <h2 class="sl-section-title">Top Destinations in ${escapeHtml(pr.name)}</h2>
        <p class="sl-section-desc">Discover the signature highlights and attractions across this province.</p>
      </div>

      <div class="row">
        ${popularDests.map(d => renderDestinationCard(d, depth)).join('')}
      </div>
    </div>
  </section>

  <!-- Hidden Gems in this Province (if any) -->
  ${hiddenGems.length > 0 ? `
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle"><i class="fa fa-diamond text-warning"></i> Off The Beaten Path</span>
        <h2 class="sl-section-title">Hidden Gems in ${escapeHtml(pr.name)}</h2>
        <p class="sl-section-desc">Serene, uncrowded locations that reveal the true unspoiled essence of the region.</p>
      </div>
      <div class="row">
        ${hiddenGems.map(d => renderDestinationCard(d, depth)).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Related Provinces Navigation -->
  <section class="sl-section sl-section-white border-top">
    <div class="container text-center">
      <h3 class="font-weight-bold mb-3">Explore Other Provinces of Sri Lanka</h3>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        ${provinces.filter(other => other.id !== pr.id).map(other => `
          <a href="${p}provinces/${other.slug}.html" class="btn btn-sl-outline m-1">${other.name}</a>
        `).join('')}
      </div>
    </div>
  </section>

  ${renderFooter(depth)}

</body>
</html>`;
    }

    // Write provinces/[slug].html (depth 1)
    fs.writeFileSync(path.join(ROOT_DIR, 'provinces', `${pr.slug}.html`), createProvinceHtml(1), 'utf8');

    // Write provinces/[slug]/index.html (depth 2)
    const provSlugDir = path.join(ROOT_DIR, 'provinces', pr.slug);
    ensureDir(provSlugDir);
    fs.writeFileSync(path.join(provSlugDir, 'index.html'), createProvinceHtml(2), 'utf8');
  });

  console.log('All 9 province pages generated successfully.');
}

// -------------------------------------------------------------
// 3. GENERATE DISTRICT PAGES (districts/[slug].html and /index.html)
// -------------------------------------------------------------
function generateDistrictPages() {
  console.log(`Generating ${districts.length} district pages...`);

  districts.forEach(dt => {
    const districtDests = destinations.filter(d => d.districtId === dt.id);
    const prov = provinceMap.get(dt.provinceId);
    const provName = prov ? prov.name : dt.provinceId;
    const popularDests = districtDests.filter(d => d.popular);
    const hiddenGems = districtDests.filter(d => d.hiddenGem);

    const dtLat = typeof dt.latitude === 'number' ? dt.latitude : 7.8731;
    const dtLng = typeof dt.longitude === 'number' ? dt.longitude : 80.7718;
    const dtArea = dt.areaKm2 ? `${dt.areaKm2.toLocaleString()} km²` : (dt.area || 'N/A');
    const dtOverview = dt.shortDescription || dt.fullDescription || '';
    const dtItinerary = Array.isArray(dt.recommendedItineraries) ? dt.recommendedItineraries.join(' &bull; ') : (dt.recommendedItineraries || '1 to 2 days exploring the cultural monuments, viewpoints, and scenic attractions of this district.');
    const cleanDistName = formatDistrictName(dt.name);

    function createDistrictHtml(depth) {
      const p = getPrefix(depth);
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>${escapeHtml(cleanDistName)} District Travel & Tourism Guide | Visit Sri Lanka</title>
  <meta name="description" content="Explore ${escapeHtml(cleanDistName)} District in ${escapeHtml(provName)}, Sri Lanka. Discover ${districtDests.length} destinations, attractions, local food, adventure activities, and interactive maps.">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/districts/${dt.slug}.html">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="${p}favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="${p}img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="${p}img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="${p}img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="${p}img/apple-touch-icon.png?v=4">
  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(cleanDistName)} District Travel Guide | Visit Sri Lanka">
  <meta property="og:description" content="${escapeHtml(dtOverview)}">
  <meta property="og:image" content="${resolveAssetPath(dt.heroImage, depth)}">

  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/bootstrap.css">
  <link rel="stylesheet" href="${p}css/font-awesome.min.css">
  <link rel="stylesheet" href="${p}css/magnific-popup.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="${p}css/tourism-platform.css">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "${escapeHtml(cleanDistName)} District",
    "description": "${escapeHtml(dtOverview)}",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${dtLat},
      "longitude": ${dtLng}
    }
  }
  </script>
</head>
<body>

  ${renderHeader(depth, 'districts')}

  <!-- Detail Hero Banner -->
  <section class="sl-detail-hero" style="background-image: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('${resolveAssetPath(dt.heroImage, depth)}');">
    <div class="container">
      <div class="sl-breadcrumbs">
        <a href="${p}index.html">Home</a> <span>/</span>
        <a href="${p}provinces/${prov ? prov.slug : ''}.html">${escapeHtml(provName)}</a> <span>/</span>
        <span class="text-white">${escapeHtml(cleanDistName)} District</span>
      </div>
      <h1 class="sl-detail-title">${escapeHtml(cleanDistName)} District</h1>
      <p class="lead text-light mb-0" style="max-width: 800px;">Capital: ${escapeHtml(dt.capital)} | ${escapeHtml(provName)}</p>
      
      <div class="sl-pills-bar">
        <div class="sl-pill"><i class="fa fa-map-o text-info"></i> Area: ${escapeHtml(dtArea)}</div>
        <div class="sl-pill"><i class="fa fa-compass text-warning"></i> ${districtDests.length} Curated Destinations</div>
        <div class="sl-pill"><i class="fa fa-crosshairs text-success"></i> GPS: ${dtLat.toFixed(2)}°N, ${dtLng.toFixed(2)}°E</div>
      </div>
    </div>
  </section>

  <!-- District Overview & Details -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <h2 class="font-weight-bold mb-3">Geographical Character & Overview</h2>
          <p class="lead text-secondary">${escapeHtml(dtOverview)}</p>
          <p>${escapeHtml(dt.geographicalCharacter || '')}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Local Food & Culinary Specialties</h3>
          <p class="text-muted">${escapeHtml(dt.localFood || '')}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Adventure & Outdoor Activities</h3>
          <p class="text-muted">${escapeHtml(dt.adventureActivities || '')}</p>

          <h3 class="font-weight-bold mt-4 mb-2">Recommended District Itinerary</h3>
          <div class="sl-why-not-miss">
            <h4><i class="fa fa-calendar-check-o"></i> Suggested District Experience</h4>
            <p class="mb-0 text-dark">${escapeHtml(dtItinerary)}</p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="sl-sidebar-box">
            <h4>District Quick Facts</h4>
            <div class="sl-fact-row">
              <span class="sl-fact-label">District Capital</span>
              <span class="sl-fact-value">${escapeHtml(dt.capital)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Province</span>
              <span class="sl-fact-value"><a href="${p}provinces/${prov ? prov.slug : ''}.html">${escapeHtml(provName)}</a></span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Total Land Area</span>
              <span class="sl-fact-value">${escapeHtml(dtArea)}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Destinations Listed</span>
              <span class="sl-fact-value">${districtDests.length} Places</span>
            </div>
          </div>

          <!-- District Mini Map -->
          <div class="sl-sidebar-box">
            <h4><i class="fa fa-map-marker text-teal mr-1"></i> Interactive District Map</h4>
            <div id="geo-area-map" class="sl-map-container" data-type="district" data-id="${dt.id}"></div>
            <small class="text-muted mt-2 d-block text-center">Pinpoints all destinations within ${escapeHtml(cleanDistName)} District.</small>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Destinations in this District -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Attractions & Places</span>
        <h2 class="sl-section-title">Destinations in ${escapeHtml(cleanDistName)} District</h2>
        <p class="sl-section-desc">Click any destination to read in-depth visitor information, opening hours, transport advice, and photography tips.</p>
      </div>

      <div class="row">
        ${districtDests.map(d => renderDestinationCard(d, depth)).join('')}
      </div>
    </div>
  </section>

  <!-- Neighboring Districts Navigation -->
  <section class="sl-section sl-section-white border-top">
    <div class="container text-center">
      <h3 class="font-weight-bold mb-3">Explore Nearby Districts</h3>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        ${districts.filter(other => other.id !== dt.id && other.provinceId === dt.provinceId).map(other => `
          <a href="${p}districts/${other.slug}.html" class="btn btn-sl-outline m-1">${other.name}</a>
        `).join('')}
      </div>
    </div>
  </section>

  ${renderFooter(depth)}

</body>
</html>`;
    }

    // Write districts/[slug].html (depth 1)
    fs.writeFileSync(path.join(ROOT_DIR, 'districts', `${dt.slug}.html`), createDistrictHtml(1), 'utf8');

    // Write districts/[slug]/index.html (depth 2)
    const distSlugDir = path.join(ROOT_DIR, 'districts', dt.slug);
    ensureDir(distSlugDir);
    fs.writeFileSync(path.join(distSlugDir, 'index.html'), createDistrictHtml(2), 'utf8');
  });

  console.log('All 25 district pages generated successfully.');
}

// -------------------------------------------------------------
// 4. GENERATE INDIVIDUAL DESTINATION PAGES (places/[slug].html and /index.html)
// -------------------------------------------------------------
function generateDestinationPages() {
  console.log(`Generating ${destinations.length} destination pages...`);

  destinations.forEach(dest => {
    const dist = districtMap.get(dest.districtId);
    const cleanDistName = formatDistrictName(dest.districtId);
    const districtSlug = dist ? dist.slug : dest.districtId;
    const prov = provinceMap.get(dest.provinceId);
    const provinceName = prov ? prov.name : (dest.provinceId || '');
    const provinceSlug = prov ? prov.slug : dest.provinceId;

    const cat = categoryMap.get(dest.category);
    const catName = cat ? cat.name : (dest.category || 'Attraction');

    // Find nearby attractions (same district or cross-referenced)
    const nearbyDests = destinations.filter(d => d.slug !== dest.slug && d.districtId === dest.districtId).slice(0, 3);

    function createDestinationHtml(depth) {
      const p = getPrefix(depth);
      const fallbackImg = getCategoryFallback(dest.category, depth);
      const rawImg = (dest.images && dest.images[0] && dest.images[0].imageUrl) || fallbackImg;
      const heroImg = resolveAssetPath(rawImg, depth);
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>${escapeHtml(dest.name)} | Sri Lanka Travel Discovery</title>
  <meta name="description" content="${escapeHtml(dest.shortDescription || '')}">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/places/${dest.slug}.html">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="${p}favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="${p}img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="${p}img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="${p}img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="${p}img/apple-touch-icon.png?v=4">
  
  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(dest.name)} | Visit Sri Lanka">
  <meta property="og:description" content="${escapeHtml(dest.shortDescription || '')}">
  <meta property="og:image" content="${heroImg}">
  <meta property="og:type" content="article">

  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/bootstrap.css">
  <link rel="stylesheet" href="${p}css/font-awesome.min.css">
  <link rel="stylesheet" href="${p}css/magnific-popup.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="${p}css/tourism-platform.css">

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "${escapeHtml(dest.name)}",
    "description": "${escapeHtml(dest.shortDescription || '')}",
    "image": "${heroImg}",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${dest.latitude},
      "longitude": ${dest.longitude}
    },
    "isAccessibleForFree": ${dest.entranceInformation && dest.entranceInformation.toLowerCase().includes('free') ? 'true' : 'false'}
  }
  </script>
</head>
<body>

  ${renderHeader(depth, 'destinations')}

  <!-- Hero Banner -->
  <section class="sl-detail-hero" style="background-image: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('${heroImg}'), url('${fallbackImg}');">
    <div class="container">
      <div class="sl-breadcrumbs">
        <a href="${p}index.html">Home</a> <span>/</span>
        <a href="${p}provinces/${provinceSlug}.html">${escapeHtml(provinceName)}</a> <span>/</span>
        <a href="${p}districts/${districtSlug}.html">${escapeHtml(cleanDistName)} District</a> <span>/</span>
        <span class="text-white">${escapeHtml(dest.name)}</span>
      </div>
      <h1 class="sl-detail-title">${escapeHtml(dest.name)}</h1>
      <p class="lead text-light mb-0" style="max-width: 800px;">${escapeHtml(dest.shortDescription || '')}</p>
      
      <div class="sl-pills-bar">
        <div class="sl-pill"><i class="fa fa-tag text-warning"></i> ${escapeHtml(catName)}</div>
        <div class="sl-pill"><i class="fa fa-map-marker text-danger"></i> ${escapeHtml(cleanDistName)} District</div>
        <div class="sl-pill"><i class="fa fa-sun-o text-warning"></i> Best Season: ${escapeHtml(dest.bestTimeToVisit || 'Year-round')}</div>
        <div class="sl-pill"><i class="fa fa-clock-o text-info"></i> Duration: ${escapeHtml(dest.visitingDuration || '2-3 Hours')}</div>
        ${dest.hiddenGem ? '<div class="sl-pill bg-warning text-dark font-weight-bold"><i class="fa fa-diamond"></i> Hidden Gem</div>' : ''}
        ${dest.popular ? '<div class="sl-pill bg-success text-white font-weight-bold"><i class="fa fa-star"></i> Popular Highlight</div>' : ''}
      </div>
    </div>
  </section>

  <!-- Main Content Layout -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="row">
        <!-- Left Column: Narrative, Why Visit, Activities, Gallery -->
        <div class="col-lg-8">
          
          <div class="mb-5">
            <h2 class="font-weight-bold mb-3">About ${escapeHtml(dest.name)}</h2>
            <p class="lead text-secondary" style="line-height: 1.8;">${escapeHtml(dest.fullDescription || '')}</p>
          </div>

          ${dest.historicalBackground ? `
          <div class="mb-5">
            <h3 class="font-weight-bold mb-3"><i class="fa fa-history text-teal mr-2"></i>Historical & Cultural Background</h3>
            <p class="text-muted" style="line-height: 1.8;">${escapeHtml(dest.historicalBackground)}</p>
          </div>
          ` : ''}

          ${dest.naturalCharacteristics ? `
          <div class="mb-5">
            <h3 class="font-weight-bold mb-3"><i class="fa fa-tree text-teal mr-2"></i>Natural & Geographical Characteristics</h3>
            <p class="text-muted" style="line-height: 1.8;">${escapeHtml(dest.naturalCharacteristics)}</p>
          </div>
          ` : ''}

          ${dest.specialFeatures ? `
          <div class="mb-5">
            <h3 class="font-weight-bold mb-3"><i class="fa fa-bookmark text-teal mr-2"></i>What Makes It Special</h3>
            <p class="text-muted" style="line-height: 1.8;">${escapeHtml(dest.specialFeatures)}</p>
          </div>
          ` : ''}

          <!-- MANDATORY: Why You Shouldn't Miss This Place -->
          <div class="sl-why-not-miss">
            <h4><i class="fa fa-star text-warning"></i> Why You Shouldn't Miss This Place</h4>
            <ul>
              ${(dest.reasonsToVisit || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>

          <!-- Things to Do & Experiences -->
          <div class="mb-5">
            <h3 class="font-weight-bold mb-3"><i class="fa fa-compass text-teal mr-2"></i>Things to Do & Available Experiences</h3>
            <div class="row">
              ${(dest.activities || []).map(act => `
              <div class="col-md-6 mb-3">
                <div class="p-3 border rounded bg-light d-flex align-items-center">
                  <i class="fa fa-check-circle text-success mr-3" style="font-size: 18px;"></i>
                  <span class="font-weight-bold text-dark">${escapeHtml(act)}</span>
                </div>
              </div>
              `).join('')}
            </div>
          </div>

          <!-- Practical Travel Tips -->
          ${dest.travelTips ? `
          <div class="mb-5">
            <h3 class="font-weight-bold mb-3"><i class="fa fa-lightbulb-o text-warning mr-2"></i>Insider Travel Tips</h3>
            <div class="card border-0 bg-light p-4 rounded-lg">
              <div class="row">
                ${dest.travelTips.whatToBring ? `
                <div class="col-md-6 mb-3">
                  <strong class="text-dark d-block mb-1"><i class="fa fa-suitcase text-teal mr-1"></i> What to Bring:</strong>
                  <span class="text-muted small">${escapeHtml(dest.travelTips.whatToBring)}</span>
                </div>` : ''}
                ${dest.travelTips.clothing ? `
                <div class="col-md-6 mb-3">
                  <strong class="text-dark d-block mb-1"><i class="fa fa-user text-teal mr-1"></i> Recommended Clothing:</strong>
                  <span class="text-muted small">${escapeHtml(dest.travelTips.clothing)}</span>
                </div>` : ''}
                ${dest.travelTips.photographyTips ? `
                <div class="col-md-6 mb-3">
                  <strong class="text-dark d-block mb-1"><i class="fa fa-camera text-teal mr-1"></i> Photography Advice:</strong>
                  <span class="text-muted small">${escapeHtml(dest.travelTips.photographyTips)}</span>
                </div>` : ''}
                ${dest.travelTips.localCustoms ? `
                <div class="col-md-6 mb-3">
                  <strong class="text-dark d-block mb-1"><i class="fa fa-handshake-o text-teal mr-1"></i> Local Customs:</strong>
                  <span class="text-muted small">${escapeHtml(dest.travelTips.localCustoms)}</span>
                </div>` : ''}
                ${dest.travelTips.environmentalGuidelines ? `
                <div class="col-12 mt-2">
                  <strong class="text-dark d-block mb-1"><i class="fa fa-leaf text-success mr-1"></i> Eco & Conservation Guidelines:</strong>
                  <span class="text-muted small">${escapeHtml(dest.travelTips.environmentalGuidelines)}</span>
                </div>` : ''}
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Photo Gallery with Attribution -->
          <div class="mb-5">
            <h3 class="font-weight-bold mb-2"><i class="fa fa-camera text-teal mr-2"></i>Photo Gallery & Visual Impressions</h3>
            <p class="text-muted small mb-3">High-resolution imagery captured by travel photographers. Click to open full lightbox preview.</p>
            <div class="sl-gallery-grid">
              ${(dest.images || []).map(img => `
              <div>
                <a href="${resolveAssetPath(img.imageUrl, depth)}" class="sl-gallery-item" data-caption="${escapeHtml(img.caption || img.altText || dest.name)}">
                  <img src="${resolveAssetPath(img.imageUrl, depth)}" alt="${escapeHtml(img.altText || dest.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackImg}';">
                  <div class="sl-gallery-caption">${escapeHtml(img.caption || img.altText || '')}</div>
                </a>
                <div class="sl-photo-attribution">
                  Photo by ${escapeHtml(img.photographer || 'Contributor')} &bull; <a href="${img.sourceUrl || '#'}" target="_blank" rel="noopener">Source</a>
                </div>
              </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Right Column: Visitor Information Sidebar, Coordinates, Mini Map, Nearby Places -->
        <div class="col-lg-4">
          <div class="sl-sidebar-box">
            <h4><i class="fa fa-info-circle text-teal mr-2"></i>Visitor Information</h4>
            <div class="sl-fact-row">
              <span class="sl-fact-label">District</span>
              <span class="sl-fact-value"><a href="${p}districts/${districtSlug}.html">${escapeHtml(cleanDistName)} District</a></span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Province</span>
              <span class="sl-fact-value"><a href="${p}provinces/${provinceSlug}.html">${escapeHtml(provinceName)}</a></span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Opening Hours</span>
              <span class="sl-fact-value">${escapeHtml(dest.openingHours || 'Open daily')}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Entrance Fee</span>
              <span class="sl-fact-value">${escapeHtml(dest.entranceInformation || 'Free public access')}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Best Season</span>
              <span class="sl-fact-value">${escapeHtml(dest.bestTimeToVisit || 'Year-round')}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Visiting Duration</span>
              <span class="sl-fact-value">${escapeHtml(dest.visitingDuration || '2-3 Hours')}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Accessibility</span>
              <span class="sl-fact-value">${escapeHtml(dest.accessibilityInformation || 'Standard foot access')}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">Safety Advice</span>
              <span class="sl-fact-value">${escapeHtml(dest.safetyInformation || 'Standard precautions apply')}</span>
            </div>
            <div class="sl-fact-row">
              <span class="sl-fact-label">GPS Coordinates</span>
              <span class="sl-fact-value">${dest.latitude.toFixed(4)}° N, ${dest.longitude.toFixed(4)}° E</span>
            </div>

            <div class="mt-4">
              <a href="https://www.google.com/maps/search/?api=1&query=${dest.latitude},${dest.longitude}" target="_blank" rel="noopener" class="btn btn-sl-outline btn-block text-center">
                <i class="fa fa-external-link mr-1"></i> Open in Google Maps
              </a>
            </div>
          </div>

          <!-- Interactive Leaflet Mini Map -->
          <div class="sl-sidebar-box">
            <h4><i class="fa fa-map-marker text-teal mr-2"></i>Location Map</h4>
            <div id="single-dest-map" class="sl-map-container" data-lat="${dest.latitude}" data-lng="${dest.longitude}" data-name="${escapeHtml(dest.name)}"></div>
            <small class="text-muted mt-2 d-block text-center">Exact verified coordinates: ${dest.latitude.toFixed(4)}, ${dest.longitude.toFixed(4)}</small>
          </div>

          <!-- Nearby Attractions in District -->
          ${nearbyDests.length > 0 ? `
          <div class="sl-sidebar-box">
            <h4><i class="fa fa-compass text-teal mr-2"></i>Nearby in ${escapeHtml(cleanDistName)} District</h4>
            ${nearbyDests.map(nb => {
              const nbFallback = getCategoryFallback(nb.category, depth);
              const rawNbImg = (nb.images && nb.images[0] && nb.images[0].imageUrl) || nbFallback;
              const nbImg = resolveAssetPath(rawNbImg, depth);
              return `
              <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img src="${nbImg}" alt="${escapeHtml(nb.name)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${nbFallback}';" style="width: 65px; height: 65px; object-fit: cover; border-radius: 8px; margin-right: 12px;">
                <div>
                  <h6 class="font-weight-bold mb-1"><a href="${p}places/${nb.slug}.html" class="text-dark">${escapeHtml(nb.name)}</a></h6>
                  <span class="text-muted small"><i class="fa fa-clock-o"></i> ${escapeHtml(nb.visitingDuration || '2 Hours')}</span>
                </div>
              </div>`;
            }).join('')}
          </div>
          ` : ''}

        </div>
      </div>
    </div>
  </section>

  ${renderFooter(depth)}

</body>
</html>`;
    }

    // Write places/[slug].html (depth 1)
    fs.writeFileSync(path.join(ROOT_DIR, 'places', `${dest.slug}.html`), createDestinationHtml(1), 'utf8');

    // Write places/[slug]/index.html (depth 2)
    const destSlugDir = path.join(ROOT_DIR, 'places', dest.slug);
    ensureDir(destSlugDir);
    fs.writeFileSync(path.join(destSlugDir, 'index.html'), createDestinationHtml(2), 'utf8');
  });

  console.log('All destination pages generated successfully.');
}

// -------------------------------------------------------------
// 5. GENERATE MASTER DISCOVERY CATALOG (destinations.html)
// -------------------------------------------------------------
function generateCatalogPage() {
  console.log('Generating destinations.html...');
  const p = '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>All Destinations in Sri Lanka | Filter & Search 150+ Places</title>
  <meta name="description" content="Explore and filter over 150 tourist destinations across all 9 provinces and 25 districts of Sri Lanka. Search by keyword, region, category, or hidden gems.">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/destinations.html">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png?v=4">
  
  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/magnific-popup.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="css/tourism-platform.css">
</head>
<body>

  ${renderHeader(0, 'destinations')}

  <!-- Hero Header -->
  <section class="sl-detail-hero" style="min-height: 35vh; background-image: linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.8)), url('img/Tourist_SriLanka.jpg');">
    <div class="container">
      <div class="sl-breadcrumbs">
        <a href="index.html">Home</a> <span>/</span>
        <span class="text-white">Destinations</span>
      </div>
      <h1 class="sl-detail-title">Explore Sri Lanka's Destinations</h1>
      <p class="lead text-light mb-0">Discover 150+ natural attractions, heritage landmarks, wildlife safaris, and secret coves.</p>
    </div>
  </section>

  <!-- Filter & Discovery Section -->
  <section class="sl-section sl-section-light">
    <div class="container">
      
      <!-- Filter Bar -->
      <div class="card p-4 rounded-lg shadow-sm border-0 mb-4">
        <div class="row align-items-center">
          <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
            <label class="font-weight-bold small text-muted">SEARCH BY KEYWORD</label>
            <input type="text" id="filter-search" class="form-control" placeholder="Name, activity, tag...">
          </div>
          <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
            <label class="font-weight-bold small text-muted">PROVINCE</label>
            <select id="filter-province" class="form-control">
              <option value="">All Provinces (9)</option>
              ${provinces.map(pr => `<option value="${pr.id}">${pr.name}</option>`).join('')}
            </select>
          </div>
          <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
            <label class="font-weight-bold small text-muted">DISTRICT</label>
            <select id="filter-district" class="form-control">
              <option value="">All Districts (25)</option>
              ${districts.map(dt => `<option value="${dt.id}">${dt.name}</option>`).join('')}
            </select>
          </div>
          <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
            <label class="font-weight-bold small text-muted">CATEGORY</label>
            <select id="filter-category" class="form-control">
              <option value="">All Categories (24)</option>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="row mt-3 pt-3 border-top align-items-center">
          <div class="col-md-6 d-flex gap-3 align-items-center">
            <div class="form-check mr-4">
              <input class="form-check-input" type="checkbox" id="filter-popular">
              <label class="form-check-label font-weight-bold text-dark" for="filter-popular">Popular Only</label>
            </div>
            <div class="form-check mr-4">
              <input class="form-check-input" type="checkbox" id="filter-hiddengem">
              <label class="form-check-label font-weight-bold text-dark" for="filter-hiddengem">Hidden Gems Only</label>
            </div>
            <button id="filter-reset-btn" class="btn btn-sm btn-link text-muted"><i class="fa fa-refresh"></i> Reset Filters</button>
          </div>
          <div class="col-md-6 text-md-right mt-2 mt-md-0">
            <span id="catalog-count" class="font-weight-bold text-teal">Showing 151 destinations</span>
          </div>
        </div>
      </div>

      <!-- Catalog Destinations Grid -->
      <div id="catalog-destinations-grid" class="row">
        <!-- Dynamically rendered by tourism-platform.js -->
      </div>

    </div>
  </section>

  ${renderFooter(0)}

</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'destinations.html'), html, 'utf8');
  console.log('destinations.html generated successfully.');
}

// -------------------------------------------------------------
// 6. GENERATE INTERACTIVE MAP PAGE (map.html)
// -------------------------------------------------------------
function generateMapPage() {
  console.log('Generating map.html...');
  const p = '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>Interactive Sri Lanka Travel Map | Discover 150+ Destinations</title>
  <meta name="description" content="Explore an interactive map of Sri Lanka pinpointing 150+ tourist destinations across all 9 provinces and 25 districts with verified GPS coordinates and rich previews.">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/map.html">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png?v=4">
  
  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/magnific-popup.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="css/tourism-platform.css">
</head>
<body>

  ${renderHeader(0, 'map')}

  <!-- Map Header Bar -->
  <div class="bg-dark text-white py-3">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div>
        <h3 class="text-white font-weight-bold mb-1"><i class="fa fa-map text-teal mr-2"></i>Interactive Sri Lanka Map</h3>
        <span class="text-muted small">Explore 150+ destinations pinned with exact GPS coordinates. Click pins to open previews and guides.</span>
      </div>
      <div class="d-flex gap-2 mt-2 mt-md-0">
        <select id="map-filter-province" class="form-control form-control-sm mr-2" style="width: auto;">
          <option value="">All Provinces</option>
          ${provinces.map(pr => `<option value="${pr.id}">${pr.name}</option>`).join('')}
        </select>
        <select id="map-filter-category" class="form-control form-control-sm" style="width: auto;">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
    </div>
  </div>

  <!-- Full-Width Leaflet Map Container -->
  <div class="container-fluid px-0">
    <div id="master-map-container" style="border-radius: 0; height: 80vh;"></div>
  </div>

  <!-- Legend Bar -->
  <div class="bg-light py-3 border-top">
    <div class="container d-flex flex-wrap justify-content-center gap-4 text-dark font-weight-bold small">
      <span><span class="badge p-2 mr-1" style="background: #b45309; color: white;"><i class="fa fa-map-marker"></i></span> Historical & Heritage</span>
      <span><span class="badge p-2 mr-1" style="background: #0284c7; color: white;"><i class="fa fa-map-marker"></i></span> Beaches & Surfing</span>
      <span><span class="badge p-2 mr-1" style="background: #15803d; color: white;"><i class="fa fa-map-marker"></i></span> Wildlife & Nature</span>
      <span><span class="badge p-2 mr-1" style="background: #06b6d4; color: white;"><i class="fa fa-map-marker"></i></span> Waterfalls</span>
      <span><span class="badge p-2 mr-1" style="background: #475569; color: white;"><i class="fa fa-map-marker"></i></span> Mountains & Highlands</span>
    </div>
  </div>

  ${renderFooter(0)}

</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'map.html'), html, 'utf8');
  console.log('map.html generated successfully.');
}

// -------------------------------------------------------------
// 7. GENERATE ITINERARIES PAGE (itineraries.html)
// -------------------------------------------------------------
function generateItinerariesPage() {
  console.log('Generating itineraries.html...');
  const p = '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>Sri Lanka Travel Itineraries & Routes | 3, 5, 7, 10, 14, 21 Days</title>
  <meta name="description" content="Expert-crafted Sri Lanka travel itineraries from 3-day express highlights to 21-day all-nine-province odysseys and 8 themed journeys.">
  <link rel="canonical" href="https://visitsrilanka.gov.lk/itineraries.html">
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png?v=4">
  
  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/magnific-popup.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <link rel="stylesheet" href="css/tourism-platform.css">
</head>
<body>

  ${renderHeader(0, 'itineraries')}

  <section class="sl-detail-hero" style="min-height: 40vh; background-image: linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.8)), url('img/Tourist_SriLanka.jpg');">
    <div class="container">
      <div class="sl-breadcrumbs">
        <a href="index.html">Home</a> <span>/</span>
        <span class="text-white">Travel Itineraries</span>
      </div>
      <h1 class="sl-detail-title">Sri Lanka Travel Itineraries</h1>
      <p class="lead text-light mb-0">Seamless travel routes planned by duration and theme to maximize your discovery.</p>
    </div>
  </section>

  <!-- Duration-Based Itineraries -->
  <section class="sl-section sl-section-white">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Flexible Journeys</span>
        <h2 class="sl-section-title">Itineraries by Trip Duration</h2>
        <p class="sl-section-desc">Select an itinerary matching your available holiday length.</p>
      </div>

      ${itineraries.durationItineraries.map(it => `
      <div id="${it.slug}" class="card border-0 shadow-sm rounded-lg mb-5 overflow-hidden">
        <div class="row no-gutters">
          <div class="col-lg-4">
            <img src="${resolveAssetPath(it.heroImage, 0)}" alt="${escapeHtml(it.title)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='img/Tourist_SriLanka.jpg';" style="width: 100%; height: 100%; min-height: 300px; object-fit: cover;">
          </div>
          <div class="col-lg-8 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center mb-2">
                <span class="badge badge-success p-2 mr-2">${escapeHtml(it.duration)}</span>
                <span class="text-muted small"><i class="fa fa-car mr-1 text-teal"></i> ${escapeHtml(it.transportRecommended)}</span>
              </div>
              <h3 class="font-weight-bold mb-2">${escapeHtml(it.title)}</h3>
              <p class="text-muted mb-3">${escapeHtml(it.overview)}</p>
              <div class="mb-3">
                <strong>Ideal For:</strong> <span class="text-secondary">${escapeHtml(it.idealFor)}</span><br>
                <strong>Route:</strong> <span class="text-secondary">${escapeHtml(it.startingPoint)} &rarr; ${escapeHtml(it.endingPoint)}</span>
              </div>
            </div>

            <!-- Day by Day Timeline Accordion -->
            <div>
              <h5 class="font-weight-bold mt-3 mb-2"><i class="fa fa-list-ol text-teal mr-2"></i>Day-by-Day Schedule</h5>
              <div class="sl-timeline">
                ${it.days.map(d => `
                <div class="sl-timeline-item">
                  <div class="sl-timeline-badge">${d.day}</div>
                  <div class="sl-timeline-card">
                    <h6 class="font-weight-bold mb-1">${escapeHtml(d.title)}</h6>
                    <p class="text-muted small mb-2">${escapeHtml(d.description)}</p>
                    <span class="badge badge-light border text-teal"><i class="fa fa-bed mr-1"></i> Overnight: ${escapeHtml(d.overnight)}</span>
                  </div>
                </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
      `).join('')}

    </div>
  </section>

  <!-- Themed Journeys Section -->
  <section class="sl-section sl-section-light">
    <div class="container">
      <div class="sl-section-header">
        <span class="sl-section-subtitle">Specialized Exploration</span>
        <h2 class="sl-section-title">8 Themed Sri Lanka Journeys</h2>
        <p class="sl-section-desc">Follow specialized thematic trails curated around history, surfing, highlands, and wilderness.</p>
      </div>

      <div class="row">
        ${itineraries.themedItineraries.map(th => `
        <div class="col-lg-6 mb-4">
          <div class="sl-card h-100 p-4">
            <div class="d-flex align-items-center mb-3">
              <span class="badge badge-warning p-2 mr-3 font-weight-bold">${escapeHtml(th.badge)}</span>
              <span class="text-muted small"><i class="fa fa-clock-o mr-1"></i> ${escapeHtml(th.duration)}</span>
            </div>
            <h4 class="font-weight-bold mb-2">${escapeHtml(th.title)}</h4>
            <p class="text-muted mb-3">${escapeHtml(th.overview)}</p>
            <h6 class="font-weight-bold mb-2">Key Highlights:</h6>
            <ul class="pl-3 mb-0 text-secondary small">
              ${(th.keyHighlights || []).map(kh => `<li>${escapeHtml(kh)}</li>`).join('')}
            </ul>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  ${renderFooter(0)}

</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'itineraries.html'), html, 'utf8');
  console.log('itineraries.html generated successfully.');
}

// -------------------------------------------------------------
// 8. GENERATE ADMIN CONTENT MANAGER (admin/index.html)
// -------------------------------------------------------------
function generateAdminPage() {
  console.log('Generating admin/index.html...');
  const p = '../';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <title>Tourism Content Explorer & Admin Dashboard | Visit Sri Lanka</title>
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="${p}favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="${p}img/favicon-32x32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="${p}img/favicon-32x32.png?v=4">
  <link rel="shortcut icon" type="image/png" href="${p}img/favicon.png?v=4">
  <link rel="apple-touch-icon" href="${p}img/apple-touch-icon.png?v=4">
  <!-- Stylesheets -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/bootstrap.css">
  <link rel="stylesheet" href="${p}css/font-awesome.min.css">
  <link rel="stylesheet" href="${p}css/tourism-platform.css">
</head>
<body class="bg-light">

  ${renderHeader(1, 'admin')}

  <div id="admin-manager-container" class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="font-weight-bold mb-1"><i class="fa fa-database text-teal mr-2"></i>Destination Content Manager</h2>
        <p class="text-muted mb-0">Inspect, search, and export platform destinations (${destinations.length} records verified).</p>
      </div>
      <div>
        <button id="admin-export-btn" class="btn btn-sl-primary"><i class="fa fa-download mr-1"></i> Export JSON Dataset</button>
      </div>
    </div>

    <div class="card p-3 mb-4 shadow-sm border-0">
      <div class="row align-items-center">
        <div class="col-md-6">
          <input type="text" id="admin-search" class="form-control" placeholder="Search by destination name, slug, or district...">
        </div>
        <div class="col-md-6 text-md-right text-muted small mt-2 mt-md-0">
          Total: <strong class="text-dark">${destinations.length}</strong> &bull; Provinces: <strong class="text-dark">9</strong> &bull; Districts: <strong class="text-dark">25</strong>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 rounded-lg overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Destination Name / Slug</th>
              <th>District</th>
              <th>Category</th>
              <th>Coordinates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-dest-tbody">
            <!-- Rendered by js/tourism-platform.js -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  ${renderFooter(1)}

</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'admin', 'index.html'), html, 'utf8');
  console.log('admin/index.html generated successfully.');
}

// -------------------------------------------------------------
// 9. GENERATE SITEMAP.XML & ROBOTS.TXT
// -------------------------------------------------------------
function generateSeoFiles() {
  console.log('Generating sitemap.xml and robots.txt...');

  const domain = 'https://visitsrilanka.gov.lk';
  let urls = [
    `${domain}/`,
    `${domain}/destinations.html`,
    `${domain}/map.html`,
    `${domain}/itineraries.html`
  ];

  provinces.forEach(pr => {
    urls.push(`${domain}/provinces/${pr.slug}.html`);
  });

  districts.forEach(dt => {
    urls.push(`${domain}/districts/${dt.slug}.html`);
  });

  destinations.forEach(dest => {
    urls.push(`${domain}/places/${dest.slug}.html`);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-11-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === `${domain}/` ? '1.0' : url.includes('/places/') ? '0.8' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml
`;

  fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log(`sitemap.xml (${urls.length} URLs) and robots.txt generated.`);
}

// Helper: Format province name from ID
function formatProvinceName(id) {
  if (!id) return '';
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// Run Build
function runBuild() {
  console.log('=== STARTING PLATFORM BUILD ===');
  generateHomepage();
  generateProvincePages();
  generateDistrictPages();
  generateDestinationPages();
  generateCatalogPage();
  generateMapPage();
  generateItinerariesPage();
  generateAdminPage();
  generateSeoFiles();
  console.log('=== PLATFORM BUILD COMPLETED SUCCESSFULLY ===');
}

runBuild();
