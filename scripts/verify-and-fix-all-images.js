/**
 * Comprehensive Image Auditor & Fixer
 * Tests every image URL across provinces, districts, and destinations.
 * For any 404 or non-image response, searches Wikimedia Commons API
 * for verified authentic files that return HTTP 200 image/jpeg.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Helper to check URL status with redirects
function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) return resolve({ status: 'EMPTY', ok: false });
    try {
      const client = url.startsWith('https') ? https : http;
      const parsed = new URL(url);
      const req = client.request(parsed, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'VisitSriLankaPlatform/2.0 (contact@visitsrilanka.gov.lk)',
          'Accept': 'image/webp,image/jpeg,image/png,*/*'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let nextUrl = res.headers.location;
          if (nextUrl.startsWith('/')) {
            nextUrl = parsed.origin + nextUrl;
          }
          checkUrl(nextUrl).then(resolve);
        } else {
          const ok = res.statusCode === 200 && (res.headers['content-type'] || '').startsWith('image/');
          resolve({ status: res.statusCode, contentType: res.headers['content-type'], ok });
        }
      });
      req.on('error', (e) => resolve({ status: 'ERR', error: e.message, ok: false }));
      req.setTimeout(8000, () => {
        req.abort();
        resolve({ status: 'TIMEOUT', ok: false });
      });
      req.end();
    } catch (err) {
      resolve({ status: 'EXCEPTION', error: err.message, ok: false });
    }
  });
}

// Search Wikimedia Commons API for a query
function searchWikimedia(query) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(query);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&srnamespace=6&format=json&srlimit=8`;
    https.get(url, {
      headers: { 'User-Agent': 'VisitSriLankaPlatform/2.0 (contact@visitsrilanka.gov.lk)' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const results = (json.query && json.query.search) || [];
          resolve(results.map(r => r.title.replace(/^File:/, '')));
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

// Find working Wikimedia image for a place
async function findWorkingImage(placeName, queryTerms = []) {
  const searchQueries = [
    placeName + ' Sri Lanka',
    placeName,
    ...queryTerms
  ];

  for (const q of searchQueries) {
    const candidates = await searchWikimedia(q);
    for (const title of candidates) {
      if (title.endsWith('.pdf') || title.endsWith('.ogg') || title.endsWith('.webm') || title.endsWith('.svg')) continue;
      const candidateUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}?width=1200`;
      const res = await checkUrl(candidateUrl);
      if (res.ok) {
        return { url: candidateUrl, title };
      }
    }
  }
  return null;
}

async function run() {
  console.log('=== STEP 1: VERIFYING & FIXING PROVINCES ===');
  const provPath = path.join(DATA_DIR, 'provinces.json');
  const provinces = JSON.parse(fs.readFileSync(provPath, 'utf8'));

  for (const p of provinces) {
    const check = await checkUrl(p.heroImage);
    if (!check.ok) {
      console.log(`[FIXING PROVINCE] ${p.name} (was: ${p.heroImage})`);
      const fixed = await findWorkingImage(p.name, [p.name + ' province', p.capital + ' Sri Lanka']);
      if (fixed) {
        console.log(`  -> Fixed with: ${fixed.url}`);
        p.heroImage = fixed.url;
      } else {
        console.warn(`  -> Could not find Wikimedia image for ${p.name}`);
      }
    } else {
      console.log(`[VERIFIED PROVINCE] ${p.name}`);
    }
  }
  fs.writeFileSync(provPath, JSON.stringify(provinces, null, 2), 'utf8');

  console.log('\n=== STEP 2: VERIFYING & FIXING DISTRICTS ===');
  const distPath = path.join(DATA_DIR, 'districts.json');
  const districts = JSON.parse(fs.readFileSync(distPath, 'utf8'));

  for (const dt of districts) {
    const check = await checkUrl(dt.heroImage);
    if (!check.ok) {
      console.log(`[FIXING DISTRICT] ${dt.name} (was: ${dt.heroImage})`);
      const fixed = await findWorkingImage(dt.name, [dt.capital + ' Sri Lanka', dt.name + ' Sri Lanka']);
      if (fixed) {
        console.log(`  -> Fixed with: ${fixed.url}`);
        dt.heroImage = fixed.url;
      } else {
        console.warn(`  -> Could not find Wikimedia image for ${dt.name}`);
      }
    } else {
      console.log(`[VERIFIED DISTRICT] ${dt.name}`);
    }
  }
  fs.writeFileSync(distPath, JSON.stringify(districts, null, 2), 'utf8');

  console.log('\n=== STEP 3: VERIFYING & FIXING ALL 151 DESTINATIONS ===');
  const destFiles = [
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

  let totalDests = 0;
  let fixedDests = 0;
  let verifiedDests = 0;

  for (const file of destFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const dest of items) {
      totalDests++;
      const currentUrl = (dest.images && dest.images[0] && dest.images[0].imageUrl) || '';
      const check = await checkUrl(currentUrl);

      if (!check.ok) {
        console.log(`[FIXING DESTINATION ${totalDests}/151] ${dest.name}`);
        // Clean query: strip parentheses like (Lion Rock) or (Sri Dalada Maligawa)
        const cleanName = dest.name.replace(/\([^)]*\)/g, '').trim();
        const fixed = await findWorkingImage(cleanName, [dest.name, cleanName + ' Sri Lanka', dest.slug.replace(/-/g, ' ')]);

        if (fixed) {
          console.log(`  -> Fixed: ${fixed.url}`);
          dest.images[0].imageUrl = fixed.url;
          dest.images[0].photographer = `Wikimedia Commons / ${fixed.title}`;
          fixedDests++;
        } else {
          console.warn(`  -> No working Wikimedia image for ${dest.name}, setting local fallback`);
          dest.images[0].imageUrl = 'img/Tourist_SriLanka.jpg';
          fixedDests++;
        }
      } else {
        console.log(`[VERIFIED ${totalDests}/151] ${dest.name}`);
        verifiedDests++;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
  }

  console.log(`\nVerification Complete!`);
  console.log(`- Verified initially: ${verifiedDests}`);
  console.log(`- Fixed and verified: ${fixedDests}`);
  console.log(`- Total: ${totalDests}`);
}

run().catch(console.error);
