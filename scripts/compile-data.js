const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const JS_DIR = path.join(ROOT_DIR, 'js');

console.log('--- Compiling Tourism Platform Data ---');

const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const provinces = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'provinces.json'), 'utf8'));
const districts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'districts.json'), 'utf8'));
const itineraries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'itineraries.json'), 'utf8'));

// Provincial destination files
const provinceFiles = [
  'destinations-western.json',
  'destinations-central.json',
  'destinations-southern.json',
  'destinations-northern.json',
  'destinations-eastern.json',
  'destinations-northwestern.json',
  'destinations-northcentral.json',
  'destinations-uva.json',
  'destinations-sabaragamuwa.json'
];

let allDestinations = [];
const seenSlugs = new Set();
const seenIds = new Set();

provinceFiles.forEach(file => {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Warning: File missing: ${filePath}`);
    return;
  }
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Loaded ${items.length} destinations from ${file}`);
  
  items.forEach(dest => {
    if (seenSlugs.has(dest.slug)) {
      console.error(`Duplicate slug detected: ${dest.slug} in ${file}`);
    }
    seenSlugs.add(dest.slug);

    if (seenIds.has(dest.id)) {
      console.error(`Duplicate id detected: ${dest.id} in ${file}`);
    }
    seenIds.add(dest.id);

    // Normalize coordinates
    const lat = typeof dest.latitude === 'number' ? dest.latitude : (dest.coordinates && dest.coordinates.latitude);
    const lng = typeof dest.longitude === 'number' ? dest.longitude : (dest.coordinates && dest.coordinates.longitude);
    dest.coordinates = { latitude: lat, longitude: lng };
    dest.latitude = lat;
    dest.longitude = lng;

    // Validation checks
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
      console.error(`Invalid coordinates in ${dest.slug}`);
    } else {
      // Sri Lanka bounds roughly: Lat 5.8 to 10.0, Lng 79.4 to 82.1
      if (lat < 5.8 || lat > 10.0 || lng < 79.4 || lng > 82.1) {
        console.warn(`Coordinates for ${dest.name} (${lat}, ${lng}) outside standard Sri Lanka bounding box!`);
      }
    }

    allDestinations.push(dest);
  });
});

console.log(`\nTotal verified destinations compiled: ${allDestinations.length}`);

// Write merged destinations.json
const destOutPath = path.join(DATA_DIR, 'destinations.json');
fs.writeFileSync(destOutPath, JSON.stringify(allDestinations, null, 2), 'utf8');
console.log(`Wrote unified destinations dataset to: ${destOutPath}`);

// Write client-side JS data bundle for browser discovery & maps
const clientJsPath = path.join(JS_DIR, 'destinations-data.js');
const jsContent = `/**
 * Sri Lanka Tourism Platform Data Bundle
 * Auto-compiled by scripts/compile-data.js
 * Contains full dataset for client-side search, filtering, and interactive mapping.
 */
(function() {
  window.SRI_LANKA_CATEGORIES = ${JSON.stringify(categories, null, 2)};
  window.SRI_LANKA_PROVINCES = ${JSON.stringify(provinces, null, 2)};
  window.SRI_LANKA_DISTRICTS = ${JSON.stringify(districts, null, 2)};
  window.SRI_LANKA_ITINERARIES = ${JSON.stringify(itineraries, null, 2)};
  window.SRI_LANKA_DESTINATIONS = ${JSON.stringify(allDestinations, null, 2)};
  console.log("Sri Lanka Tourism Platform data bundle initialized:", window.SRI_LANKA_DESTINATIONS.length, "destinations loaded.");
})();
`;

fs.writeFileSync(clientJsPath, jsContent, 'utf8');
console.log(`Wrote client-side JavaScript bundle to: ${clientJsPath}`);
console.log('Data compilation completed successfully.');
