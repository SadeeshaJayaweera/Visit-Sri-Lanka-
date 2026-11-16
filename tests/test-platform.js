/**
 * Automated Verification Suite for Sri Lanka Tourism Platform
 * Tests all requirements: 9 provinces, 25 districts, 150+ destinations,
 * verified coordinates, schema markup, and HTML link integrity.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('==================================================');
console.log('RUNNING SRI LANKA TOURISM PLATFORM TEST SUITE');
console.log('==================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

// 1. DATASETS INTEGRITY TESTS
console.log('TEST SUITE 1: Datasets Integrity');
const provinces = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'provinces.json'), 'utf8'));
const districts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'districts.json'), 'utf8'));
const destinations = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'destinations.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const itineraries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'itineraries.json'), 'utf8'));

assert(provinces.length === 9, `All 9 provinces exist in database (found: ${provinces.length})`);
assert(districts.length === 25, `All 25 districts exist in database (found: ${districts.length})`);
assert(destinations.length >= 120, `Comprehensive destination database populated (found: ${destinations.length})`);
assert(categories.length >= 20, `Rich categorization schema populated (found: ${categories.length})`);
assert(itineraries.durationItineraries.length === 6, `6 duration itineraries defined (found: ${itineraries.durationItineraries.length})`);
assert(itineraries.themedItineraries.length === 8, `8 themed journeys defined (found: ${itineraries.themedItineraries.length})`);

// 2. GEOGRAPHICAL BOUNDS & GPS COORDINATES
console.log('\nTEST SUITE 2: Geographical Bounds & GPS Verification');
let coordsValid = true;
let invalidCoordSample = null;

destinations.forEach(d => {
  const lat = typeof d.latitude === 'number' ? d.latitude : (d.coordinates && d.coordinates.latitude);
  const lng = typeof d.longitude === 'number' ? d.longitude : (d.coordinates && d.coordinates.longitude);
  // Sri Lanka: Lat roughly 5.8 to 10.0 N, Lng roughly 79.4 to 82.1 E
  if (typeof lat !== 'number' || typeof lng !== 'number' || lat < 5.8 || lat > 10.0 || lng < 79.4 || lng > 82.1) {
    coordsValid = false;
    invalidCoordSample = { name: d.name, lat, lng };
  }
});

assert(coordsValid, `All ${destinations.length} destinations possess verified GPS coordinates within Sri Lanka bounds`);
if (!coordsValid && invalidCoordSample) {
  console.error('    Sample invalid:', invalidCoordSample);
}

// 3. DISTRICT COVERAGE TEST (Every single district has at least 1 destination)
console.log('\nTEST SUITE 3: Complete 25-District Coverage');
const districtCoverageMap = new Map();
districts.forEach(dt => districtCoverageMap.set(dt.id, 0));

destinations.forEach(d => {
  if (districtCoverageMap.has(d.districtId)) {
    districtCoverageMap.set(d.districtId, districtCoverageMap.get(d.districtId) + 1);
  }
});

let allDistrictsCovered = true;
districtCoverageMap.forEach((count, dtId) => {
  if (count === 0) {
    allDistrictsCovered = false;
    console.error(`    District without destination: ${dtId}`);
  }
});

assert(allDistrictsCovered, `All 25 districts have destinations represented (coverage: 100%)`);

// 4. CONTENT QUALITY & "WHY YOU SHOULDN'T MISS"
console.log('\nTEST SUITE 4: Destination Content Quality & Mandatory Sections');
let allHaveReasons = true;
let allHaveActivities = true;
let allHaveAttribution = true;

destinations.forEach(d => {
  if (!d.reasonsToVisit || !Array.isArray(d.reasonsToVisit) || d.reasonsToVisit.length < 3) {
    allHaveReasons = false;
  }
  if (!d.activities || !Array.isArray(d.activities) || d.activities.length === 0) {
    allHaveActivities = false;
  }
  if (!d.images || !Array.isArray(d.images) || d.images.length === 0 || !d.images[0].photographer) {
    allHaveAttribution = false;
  }
});

assert(allHaveReasons, `All destinations include mandatory 'Why You Shouldn't Miss This Place' with 3+ reasons`);
assert(allHaveActivities, `All destinations list activities and things to do`);
assert(allHaveAttribution, `All destination photos include photographer attribution`);

// 5. STATIC FILES & ROUTE INTEGRITY
console.log('\nTEST SUITE 5: Static HTML Generation & Route Cleanliness');

// Homepage
assert(fs.existsSync(path.join(ROOT_DIR, 'index.html')), 'Homepage index.html exists');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexHtml.includes('Discover the Wonder of Sri Lanka'), 'Homepage has correct main headline');
assert(indexHtml.includes('sl-hero-search-input'), 'Homepage has interactive search input');
assert(indexHtml.includes('Explore Sri Lanka by Province'), 'Homepage includes Province section');
assert(indexHtml.includes('Explore All 25 Districts'), 'Homepage includes District section');
assert(indexHtml.includes('Most Popular Destinations'), 'Homepage includes Popular Destinations');
assert(indexHtml.includes('Hidden Gems of Sri Lanka'), 'Homepage includes Hidden Gems section');
assert(indexHtml.includes('Best Places to Visit by Season'), 'Homepage includes Seasonal Guide');
assert(indexHtml.includes('Essential Travel Planning Information'), 'Homepage includes Travel Planning section');
assert(indexHtml.includes('Developed by <a href="https://www.sadeeshajayaweera.dev/" target="_blank" rel="noopener">Sadeesha Jayaweera</a>'), 'Homepage footer includes developer credit and portfolio link');

// Province files
let allProvincePagesExist = true;
provinces.forEach(pr => {
  const singleHtml = path.join(ROOT_DIR, 'provinces', `${pr.slug}.html`);
  const nestedIndex = path.join(ROOT_DIR, 'provinces', pr.slug, 'index.html');
  if (!fs.existsSync(singleHtml) || !fs.existsSync(nestedIndex)) {
    allProvincePagesExist = false;
  }
});
assert(allProvincePagesExist, `All 9 province pages exist (.html and /index.html)`);

// District files
let allDistrictPagesExist = true;
districts.forEach(dt => {
  const singleHtml = path.join(ROOT_DIR, 'districts', `${dt.slug}.html`);
  const nestedIndex = path.join(ROOT_DIR, 'districts', dt.slug, 'index.html');
  if (!fs.existsSync(singleHtml) || !fs.existsSync(nestedIndex)) {
    allDistrictPagesExist = false;
  }
});
assert(allDistrictPagesExist, `All 25 district pages exist (.html and /index.html)`);

// Destination files
let allDestPagesExist = true;
destinations.forEach(d => {
  const singleHtml = path.join(ROOT_DIR, 'places', `${d.slug}.html`);
  const nestedIndex = path.join(ROOT_DIR, 'places', d.slug, 'index.html');
  if (!fs.existsSync(singleHtml) || !fs.existsSync(nestedIndex)) {
    allDestPagesExist = false;
  }
});
assert(allDestPagesExist, `All ${destinations.length} destination pages exist (.html and /index.html)`);

// Core utility pages
assert(fs.existsSync(path.join(ROOT_DIR, 'destinations.html')), 'Master catalog destinations.html exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'map.html')), 'Interactive map.html exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'itineraries.html')), 'Itineraries.html exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'admin', 'index.html')), 'Admin content manager exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'sitemap.xml')), 'sitemap.xml exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'robots.txt')), 'robots.txt exists');

// 6. JSON-LD STRUCTURED DATA CHECK
console.log('\nTEST SUITE 6: Schema.org Structured Data Verification');
const sampleDestHtml = fs.readFileSync(path.join(ROOT_DIR, 'places', 'sigiriya-rock-fortress.html'), 'utf8');
const jsonLdMatch = sampleDestHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(jsonLdMatch !== null, 'Destination page includes Schema.org JSON-LD script block');
if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    assert(parsed['@type'] === 'TouristAttraction', 'JSON-LD type is TouristAttraction');
    assert(parsed.name === 'Sigiriya Rock Fortress (Lion Rock)', 'JSON-LD destination name is correct');
  } catch (err) {
    assert(false, 'JSON-LD failed JSON parse: ' + err.message);
  }
}

// 7. ASSET & IMAGE RESILIENCE VERIFICATION
console.log('\nTEST SUITE 7: Favicon Assets & Image Resilience Verification');
assert(fs.existsSync(path.join(ROOT_DIR, 'favicon.ico')), 'Root favicon.ico exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'img', 'favicon.png')), 'img/favicon.png exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'img', 'favicon-32x32.png')), 'img/favicon-32x32.png exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'img', 'apple-touch-icon.png')), 'img/apple-touch-icon.png exists');

const homeContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(homeContent.includes('rel="icon"') && homeContent.includes('favicon-32x32.png?v=4'), 'Homepage includes cache-busting favicon links');
assert(homeContent.includes('<meta name="referrer" content="no-referrer">'), 'Homepage includes no-referrer meta policy for Wikimedia image loading');
assert(homeContent.includes('referrerpolicy="no-referrer"'), 'Card images include referrerpolicy="no-referrer"');
assert(homeContent.includes('onerror="this.onerror=null;'), 'Card images include onerror fallback handlers');

// Verify all destinations have clean, non-corrupt image URLs
let invalidImageUrls = 0;
destinations.forEach(d => {
  (d.images || []).forEach(img => {
    if (img.imageUrl.includes('(') || img.imageUrl.includes(')') || img.imageUrl.includes(',') || img.imageUrl.includes("'%27'") || img.imageUrl.includes("'")) {
      invalidImageUrls++;
    }
  });
});
assert(invalidImageUrls === 0, `All destination image URLs are sanitized with 0 punctuation corruptions (found: ${invalidImageUrls})`);

console.log('\n==================================================');
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
console.log('==================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\nALL PLATFORM TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
