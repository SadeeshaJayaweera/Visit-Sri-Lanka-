# Visit Sri Lanka — Travel & Tourism Discovery Platform

<div align="center">
  <img src="docs/screenshots/01-homepage-hero.png" alt="Visit Sri Lanka Platform Preview" width="100%" style="border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">

  <br><br>

  [![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
  [![Provinces](https://img.shields.io/badge/Provinces-9%20Covered-0f766e.svg)](#geographical-coverage)
  [![Districts](https://img.shields.io/badge/Districts-25%20Covered-0284c7.svg)](#geographical-coverage)
  [![Destinations](https://img.shields.io/badge/Destinations-151%20Verified-0d9488.svg)](#destination-database)
  [![Tests](https://img.shields.io/badge/Tests-42%2F42%20Passed-10b981.svg)](#testing--verification)
  [![Developer](https://img.shields.io/badge/Developed%20By-Sadeesha%20Jayaweera-38bdf8.svg)](https://www.sadeeshajayaweera.dev/)
</div>

---

## 🌟 Overview

**Visit Sri Lanka** is a comprehensive, production-quality tourism and travel discovery web platform designed to help both local and international travelers explore the full breadth of the *Pearl of the Indian Ocean*.

Unlike typical travel blogs featuring only a handful of mainstream attractions, this platform delivers complete geographical coverage across **all 9 provinces** and **all 25 districts**, featuring **151 thoroughly curated destinations**, natural wonders, historical landmarks, religious monuments, wildlife reserves, and off-the-beaten-path hidden gems.

Every single destination features **100% unique, place-specific photography**, verified GPS coordinates, travel duration, best season to visit, mandatory "Why You Shouldn't Miss This Place" recommendations, practical visitor tips, and Schema.org `TouristAttraction` JSON-LD structured data.

---

## 📸 Application Preview

### 1. Interactive Homepage & Destination Discovery
*Hero banner, live instant search bar, province explorer, trending destinations, seasonal recommendations, and travel route highlights.*
![Homepage & Hero Discovery](docs/screenshots/01-homepage-hero.png)

---

### 2. Master Searchable & Filterable Catalog (`destinations.html`)
*Filter all 151 destinations dynamically by category, province, district, season, or keyword with real-time card counters.*
![Destinations Master Catalog](docs/screenshots/02-destinations-catalog.png)

---

### 3. Interactive Leaflet GIS Map (`map.html`)
*Interactive full-island map plotting every destination with verified GPS coordinates, custom category markers, and quick detail cards.*
![Interactive Leaflet Map](docs/screenshots/03-interactive-map.png)

---

### 4. Dedicated Province Guides (`/provinces/central-province.html`)
*Dedicated guide for each of the 9 provinces highlighting district breakdown, top attractions, climate, best time to visit, and historical significance.*
![Central Province Guide](docs/screenshots/04-province-central.png)

---

### 5. Dedicated District Portals (`/districts/kandy.html`)
*Dedicated portal for each of the 25 administrative districts detailing key towns, elevation, seasonal highlights, and local attractions.*
![Kandy District Portal](docs/screenshots/05-district-kandy.png)

---

### 6. Curated Destination Guides (`/places/sigiriya-rock-fortress.html`)
*Detailed destination dossier with historical context, "Why You Shouldn't Miss This", top activities, practical visitor details, and Google Maps integration.*
![Sigiriya Rock Fortress Guide](docs/screenshots/06-destination-sigiriya.png)

---

### 7. Multi-Day Itinerary & Journey Planner (`itineraries.html`)
*Carefully curated itineraries ranging from 3-day golden getaways to 21-day grand island circuits, plus themed trails for wildlife, heritage, and surf.*
![Itinerary Planner](docs/screenshots/07-itineraries-planner.png)

---

## 🗺️ Complete Geographical Coverage

The platform implements a strict **Province → District → Destination → Experiences** geographical hierarchy:

| Province | Administrative Capital | Districts Included |
| :--- | :--- | :--- |
| **Western Province** | Colombo | Colombo, Gampaha, Kalutara |
| **Central Province** | Kandy | Kandy, Matale, Nuwara Eliya |
| **Southern Province** | Galle | Galle, Matara, Hambantota |
| **Northern Province** | Jaffna | Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya |
| **Eastern Province** | Trincomalee | Trincomalee, Batticaloa, Ampara |
| **North Western (Wayamba)** | Kurunegala | Kurunegala, Puttalam |
| **North Central Province** | Anuradhapura | Anuradhapura, Polonnaruwa |
| **Uva Province** | Badulla | Badulla, Monaragala |
| **Sabaragamuwa Province** | Ratnapura | Ratnapura, Kegalle |

---

## 🚀 Key Features

- **378 Static HTML Pages Generated**: Every destination, district, and province has both a clean URL (`/places/sigiriya-rock-fortress.html`) and directory index (`/places/sigiriya-rock-fortress/index.html`) for seamless static hosting on any CDN, GitHub Pages, or Netlify.
- **100% Unique Image Assets**: Every single destination, district, and province is represented by an authentic, place-specific photograph with 0 duplicate fallback images across all 185 visual assets.
- **Interactive Leaflet Map**: Renders all 151 destination coordinates using OpenStreetMap tiles, custom SVG category pins, interactive popups, and district pan controls.
- **Instant Client-Side Search & Filter**: Real-time keyword search, province dropdown, category filters, and active badge counts without page reloads.
- **SEO & Schema.org JSON-LD**: Comprehensive metadata, Open Graph preview tags, and `application/ld+json` schema structured data for search engine optimization.
- **Curated Multi-Day Itineraries**: 6 trip duration guides (3, 5, 7, 10, 14, and 21 days) alongside 8 themed journeys (Heritage, Wildlife, Beaches, Waterfalls, Food & Culture, Wellness, Photography, and Adventure).
- **Interactive Admin Content Explorer**: Built-in lightweight dashboard (`admin/index.html`) to inspect and review the entire destination catalog, filters, and coordinates.

---

## 🛠️ Technology Stack

- **Markup & Layout**: Semantic HTML5, Bootstrap 4 responsive grid, FontAwesome 4.7
- **Styling**: Modern custom CSS (`css/tourism-platform.css`) utilizing CSS custom properties, glassmorphism hero cards, responsive flexbox/grid layouts, and card micro-interactions
- **Interactivity**: Vanilla ES6+ JavaScript (`js/tourism-platform.js`), Leaflet.js 1.9.4
- **Data Engine**: JSON-backed datasets in `data/` compiled to a lightweight standalone bundle `js/destinations-data.js`
- **Build System**: Node.js static generator (`scripts/build.js`)
- **Automated Verification**: Node.js test runner (`tests/test-platform.js`) and Python HTML auditor (`scripts/audit_platform_html.py`)

---

## 💻 Local Setup & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- [Python 3](https://python.org/) (for verification scripts)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/SadeeshaJayaweera/Visit-Sri-Lanka-.git
cd Visit-Sri-Lanka-

# 2. Install dependencies
npm install

# 3. Compile datasets and rebuild static pages
npm run compile-data
npm run build

# 4. Start the local development server
npm start
```
The server will start at `http://localhost:3000/`.

---

## 🧪 Testing & Verification

The project includes an automated platform test suite that validates dataset integrity, GPS boundaries, 25-district coverage, required content sections, Schema.org metadata, and asset resilience:

```bash
# Run the platform test suite
npm test
```
```text
==================================================
RUNNING SRI LANKA TOURISM PLATFORM TEST SUITE
==================================================
TEST SUITE 1: Datasets Integrity (Provinces, Districts, Destinations, Itineraries)
TEST SUITE 2: Geographical Bounds & GPS Verification
TEST SUITE 3: Complete 25-District Coverage
TEST SUITE 4: Destination Content Quality & Mandatory Sections
TEST SUITE 5: Static HTML Generation & Route Cleanliness
TEST SUITE 6: Schema.org Structured Data Verification
TEST SUITE 7: Favicon Assets & Image Resilience Verification
==================================================
TEST SUMMARY: 42 PASSED, 0 FAILED (TOTAL: 42)
==================================================
ALL PLATFORM TESTS PASSED WITH 100% SUCCESS!
```

---

## 👨‍💻 Developer & Credits

- **Developer**: [Sadeesha Jayaweera](https://www.sadeeshajayaweera.dev/)
- **Portfolio**: [https://www.sadeeshajayaweera.dev/](https://www.sadeeshajayaweera.dev/)
- **Photography & Media**: Attributed to generous photographers on Unsplash and Wikimedia Commons contributors under educational and Creative Commons licensing.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
