/**
 * Sri Lanka Tourism Platform Interactive Client Script
 * Powers hero search autocomplete, filterable destination catalogs,
 * Leaflet maps, lightboxes, and admin explorer.
 */

(function() {
  'use strict';

  function getBasePath() {
    // If in a subfolder like /provinces/, /districts/, /places/, return '../'
    var pathname = window.location.pathname;
    if (pathname.includes('/provinces/') || pathname.includes('/districts/') || pathname.includes('/places/') || pathname.includes('/admin/')) {
      return '../';
    }
    return '';
  }

  function getDefaultFallback() {
    return getBasePath() + 'img/Tourist_SriLanka.jpg';
  }

  function resolveAsset(url) {
    if (!url) return getDefaultFallback();
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:')) {
      return url;
    }
    var clean = url.replace(/^\/+/, '');
    return getBasePath() + clean;
  }

  // Global image error listener in capture phase for resilient local fallbacks
  window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
      var img = e.target;
      if (!img.getAttribute('data-fallback-applied')) {
        img.setAttribute('data-fallback-applied', 'true');
        img.src = getDefaultFallback();
      }
    }
  }, true);

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    initHeroSearch();
    initCatalogFilter();
    initLeafletMaps();
    initLightboxes();
    initAdminManager();
  });

  /**
   * 1. Hero Search Autocomplete
   */
  function initHeroSearch() {
    const searchInput = document.getElementById('sl-hero-search-input');
    const dropdown = document.getElementById('sl-search-dropdown');
    if (!searchInput || !dropdown) return;

    const destinations = window.SRI_LANKA_DESTINATIONS || [];

    searchInput.addEventListener('input', function(e) {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }

      const matches = destinations.filter(function(d) {
        const nameMatch = d.name.toLowerCase().includes(q);
        const districtMatch = d.districtId && d.districtId.toLowerCase().includes(q);
        const catMatch = (d.categories || []).some(function(c) { return c.toLowerCase().includes(q); });
        const actMatch = (d.activities || []).some(function(a) { return a.toLowerCase().includes(q); });
        return nameMatch || districtMatch || catMatch || actMatch;
      }).slice(0, 8);

      if (matches.length === 0) {
        dropdown.innerHTML = '<div style="padding: 16px; color: #64748b; text-align: center;">No destinations found matching "' + escapeHtml(q) + '". Try searching for "Ella", "Beaches", "Fortress", or "Safari".</div>';
        dropdown.style.display = 'block';
        return;
      }

      let html = '';
      const fallback = getDefaultFallback();
      matches.forEach(function(d) {
        const rawImg = (d.images && d.images[0] && d.images[0].imageUrl) || '';
        const heroImg = resolveAsset(rawImg);
        const districtName = formatDistrictName(d.districtId);
        html += '<a href="' + getBasePath() + 'places/' + d.slug + '.html" class="sl-search-dropdown-item">' +
                '<img src="' + heroImg + '" alt="' + escapeHtml(d.name) + '" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=\'' + fallback + '\';">' +
                '<div>' +
                  '<div style="font-weight: 700; font-size: 14px;">' + escapeHtml(d.name) + '</div>' +
                  '<div style="font-size: 12px; color: #0f766e; text-transform: uppercase;">' + escapeHtml(districtName) + ' District</div>' +
                '</div>' +
              '</a>';
      });

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    // Preset Chip clicks
    const chips = document.querySelectorAll('.sl-search-chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        const term = chip.getAttribute('data-search') || chip.innerText.trim();
        searchInput.value = term;
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });
    });
  }

  /**
   * 2. Master Catalog Filtering (destinations.html)
   */
  function initCatalogFilter() {
    const catalogGrid = document.getElementById('catalog-destinations-grid');
    if (!catalogGrid) return;

    const destinations = window.SRI_LANKA_DESTINATIONS || [];
    const searchInput = document.getElementById('filter-search');
    const provinceSelect = document.getElementById('filter-province');
    const districtSelect = document.getElementById('filter-district');
    const categorySelect = document.getElementById('filter-category');
    const popularCheck = document.getElementById('filter-popular');
    const hiddenGemCheck = document.getElementById('filter-hiddengem');
    const countBadge = document.getElementById('catalog-count');

    // District cascading based on province selection
    if (provinceSelect && districtSelect) {
      provinceSelect.addEventListener('change', function() {
        const selProv = provinceSelect.value;
        const districts = window.SRI_LANKA_DISTRICTS || [];
        
        districtSelect.innerHTML = '<option value="">All Districts (25)</option>';
        districts.forEach(function(dist) {
          if (!selProv || dist.provinceId === selProv) {
            districtSelect.innerHTML += '<option value="' + dist.id + '">' + dist.name + '</option>';
          }
        });
        applyFilter();
      });
    }

    function applyFilter() {
      const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const prov = provinceSelect ? provinceSelect.value : '';
      const dist = districtSelect ? districtSelect.value : '';
      const cat = categorySelect ? categorySelect.value : '';
      const onlyPopular = popularCheck ? popularCheck.checked : false;
      const onlyHidden = hiddenGemCheck ? hiddenGemCheck.checked : false;

      const filtered = destinations.filter(function(d) {
        if (q) {
          const match = d.name.toLowerCase().includes(q) ||
                        (d.shortDescription && d.shortDescription.toLowerCase().includes(q)) ||
                        (d.districtId && d.districtId.toLowerCase().includes(q));
          if (!match) return false;
        }
        if (prov && d.provinceId !== prov) return false;
        if (dist && d.districtId !== dist) return false;
        if (cat) {
          const catMatch = d.category === cat || (d.categories && d.categories.includes(cat));
          if (!catMatch) return false;
        }
        if (onlyPopular && !d.popular) return false;
        if (onlyHidden && !d.hiddenGem) return false;
        return true;
      });

      renderDestinations(filtered, catalogGrid);

      if (countBadge) {
        countBadge.innerText = 'Showing ' + filtered.length + ' of ' + destinations.length + ' destinations';
      }
    }

    // Attach listeners
    [searchInput, districtSelect, categorySelect, popularCheck, hiddenGemCheck].forEach(function(el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });

    // Reset button
    const resetBtn = document.getElementById('filter-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (searchInput) searchInput.value = '';
        if (provinceSelect) provinceSelect.value = '';
        if (districtSelect) districtSelect.value = '';
        if (categorySelect) categorySelect.value = '';
        if (popularCheck) popularCheck.checked = false;
        if (hiddenGemCheck) hiddenGemCheck.checked = false;
        applyFilter();
      });
    }

    // Initial render
    applyFilter();
  }

  function renderDestinations(items, container) {
    if (items.length === 0) {
      container.innerHTML = '<div class="col-12 text-center py-5">' +
        '<div style="font-size: 48px; color: #cbd5e1; margin-bottom: 12px;"><i class="fa fa-map-marker"></i></div>' +
        '<h4 style="color: #475569;">No Destinations Matched Your Criteria</h4>' +
        '<p style="color: #64748b;">Try adjusting your search filters or clearing checkboxes to explore Sri Lanka.</p>' +
      '</div>';
      return;
    }

    let html = '';
    const basePath = getBasePath();
    const fallback = getDefaultFallback();

    items.forEach(function(d) {
      const rawImg = (d.images && d.images[0] && d.images[0].imageUrl) || '';
      const heroImg = resolveAsset(rawImg);
      const catLabel = formatCategoryName(d.category);
      const districtName = formatDistrictName(d.districtId);
      const gemBadge = d.hiddenGem ? '<div class="sl-badge-gem"><i class="fa fa-diamond"></i> Hidden Gem</div>' : '';

      html += '<div class="col-lg-4 col-md-6 mb-4">' +
        '<div class="sl-card">' +
          '<div class="sl-card-img-wrap">' +
            '<img src="' + heroImg + '" alt="' + escapeHtml(d.name) + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=\'' + fallback + '\';">' +
            '<span class="sl-badge-category">' + escapeHtml(catLabel) + '</span>' +
            gemBadge +
          '</div>' +
          '<div class="sl-card-body">' +
            '<div class="sl-card-location"><i class="fa fa-map-pin"></i> ' + escapeHtml(districtName) + ' District</div>' +
            '<h3 class="sl-card-title"><a href="' + basePath + 'places/' + d.slug + '.html">' + escapeHtml(d.name) + '</a></h3>' +
            '<p class="sl-card-text">' + escapeHtml(d.shortDescription || '') + '</p>' +
            '<div class="sl-card-footer">' +
              '<div class="sl-card-meta"><i class="fa fa-clock-o"></i> ' + escapeHtml(d.visitingDuration || '2-3 Hours') + '</div>' +
              '<a href="' + basePath + 'places/' + d.slug + '.html" class="btn btn-sm btn-sl-primary">Explore Guide <i class="fa fa-arrow-right"></i></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  /**
   * 3. Leaflet Interactive Maps
   */
  function initLeafletMaps() {
    if (typeof L === 'undefined') return;

    const basePath = getBasePath();

    // A. Master Sri Lanka Map (map.html)
    const masterMapEl = document.getElementById('master-map-container');
    if (masterMapEl) {
      // Center of Sri Lanka approx 7.8731, 80.7718
      const map = L.map('master-map-container', {
        center: [7.8731, 80.7718],
        zoom: 8,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const destinations = window.SRI_LANKA_DESTINATIONS || [];
      const markersLayer = L.layerGroup().addTo(map);

      function renderMarkers(items) {
        markersLayer.clearLayers();
        items.forEach(function(d) {
          if (!d.latitude || !d.longitude) return;

          let markerClass = 'marker-historical';
          if (d.category === 'beaches-coastal') markerClass = 'marker-beach';
          else if (d.category === 'wildlife-safaris' || d.category === 'national-parks') markerClass = 'marker-wildlife';
          else if (d.category === 'waterfalls') markerClass = 'marker-waterfall';
          else if (d.category === 'mountains-highlands') markerClass = 'marker-mountain';

          const icon = L.divIcon({
            className: 'custom-leaflet-marker ' + markerClass,
            html: '<i class="fa fa-map-marker"></i>',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28]
          });

          const rawImg = (d.images && d.images[0] && d.images[0].imageUrl) || '';
          const heroImg = resolveAsset(rawImg);
          const fallback = getDefaultFallback();
          const popupHtml = '<div class="sl-popup-card">' +
            '<img src="' + heroImg + '" alt="' + escapeHtml(d.name) + '" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=\'' + fallback + '\';">' +
            '<div class="sl-popup-card-content">' +
              '<div class="sl-popup-district">' + escapeHtml(formatDistrictName(d.districtId)) + ' District</div>' +
              '<div class="sl-popup-title">' + escapeHtml(d.name) + '</div>' +
              '<a href="' + basePath + 'places/' + d.slug + '.html" class="btn btn-xs btn-sl-primary btn-block text-center mt-2" style="font-size: 11px; padding: 4px 8px;">View Destination &raquo;</a>' +
            '</div>' +
          '</div>';

          const marker = L.marker([d.latitude, d.longitude], { icon: icon });
          marker.bindPopup(popupHtml);
          markersLayer.addLayer(marker);
        });
      }

      renderMarkers(destinations);

      // Filter controls on map page if present
      const mapFilterCat = document.getElementById('map-filter-category');
      const mapFilterProv = document.getElementById('map-filter-province');
      if (mapFilterCat || mapFilterProv) {
        function filterMapMarkers() {
          const c = mapFilterCat ? mapFilterCat.value : '';
          const p = mapFilterProv ? mapFilterProv.value : '';
          const filtered = destinations.filter(function(d) {
            if (c && d.category !== c && (!d.categories || !d.categories.includes(c))) return false;
            if (p && d.provinceId !== p) return false;
            return true;
          });
          renderMarkers(filtered);
        }
        if (mapFilterCat) mapFilterCat.addEventListener('change', filterMapMarkers);
        if (mapFilterProv) mapFilterProv.addEventListener('change', filterMapMarkers);
      }
    }

    // B. Single Destination Mini Map (places/[slug].html)
    const singleMapEl = document.getElementById('single-dest-map');
    if (singleMapEl) {
      const lat = parseFloat(singleMapEl.getAttribute('data-lat'));
      const lng = parseFloat(singleMapEl.getAttribute('data-lng'));
      const name = singleMapEl.getAttribute('data-name') || 'Destination';

      if (!isNaN(lat) && !isNaN(lng)) {
        const singleMap = L.map('single-dest-map', {
          center: [lat, lng],
          zoom: 13,
          scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(singleMap);

        const icon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: '<i class="fa fa-map-marker"></i>',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        L.marker([lat, lng], { icon: icon })
          .addTo(singleMap)
          .bindPopup('<b>' + escapeHtml(name) + '</b><br><small>GPS: ' + lat.toFixed(4) + ', ' + lng.toFixed(4) + '</small>')
          .openPopup();
      }
    }

    // C. District / Province Multi-Marker Map
    const geoMapEl = document.getElementById('geo-area-map');
    if (geoMapEl) {
      const targetType = geoMapEl.getAttribute('data-type'); // 'district' or 'province'
      const targetId = geoMapEl.getAttribute('data-id');

      const destinations = window.SRI_LANKA_DESTINATIONS || [];
      const areaDestinations = destinations.filter(function(d) {
        if (targetType === 'district') return d.districtId === targetId;
        if (targetType === 'province') return d.provinceId === targetId;
        return false;
      });

      if (areaDestinations.length > 0) {
        const geoMap = L.map('geo-area-map', { scrollWheelZoom: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(geoMap);

        const bounds = [];
        areaDestinations.forEach(function(d) {
          if (!d.latitude || !d.longitude) return;
          bounds.push([d.latitude, d.longitude]);

          const icon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: '<i class="fa fa-map-marker"></i>',
            iconSize: [26, 26],
            iconAnchor: [13, 26]
          });

          const rawImg = (d.images && d.images[0] && d.images[0].imageUrl) || '';
          const heroImg = resolveAsset(rawImg);
          const fallback = getDefaultFallback();
          const popup = '<div style="min-width: 180px;">' +
            '<img src="' + heroImg + '" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=\'' + fallback + '\';" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;">' +
            '<b>' + escapeHtml(d.name) + '</b><br>' +
            '<a href="' + basePath + 'places/' + d.slug + '.html" style="font-size: 11px; color: #0f766e; font-weight: 600;">View Details &raquo;</a>' +
          '</div>';

          L.marker([d.latitude, d.longitude], { icon: icon }).addTo(geoMap).bindPopup(popup);
        });

        if (bounds.length > 0) {
          geoMap.fitBounds(bounds, { padding: [30, 30] });
        }
      }
    }
  }

  /**
   * 4. Lightbox Galleries
   */
  function initLightboxes() {
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.magnificPopup !== 'undefined') {
      jQuery('.sl-gallery-item').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {
          titleSrc: function(item) {
            return item.el.attr('data-caption') || item.el.find('img').attr('alt');
          }
        }
      });
    }
  }

  /**
   * 5. Admin Manager
   */
  function initAdminManager() {
    const adminContainer = document.getElementById('admin-manager-container');
    if (!adminContainer) return;

    const destinations = window.SRI_LANKA_DESTINATIONS || [];
    const tableBody = document.getElementById('admin-dest-tbody');
    const adminSearch = document.getElementById('admin-search');
    const adminExportBtn = document.getElementById('admin-export-btn');

    function renderAdminTable(items) {
      if (!tableBody) return;
      let html = '';
      items.forEach(function(d, idx) {
        html += '<tr>' +
          '<td>' + (idx + 1) + '</td>' +
          '<td><strong>' + escapeHtml(d.name) + '</strong><br><small class="text-muted">' + escapeHtml(d.slug) + '</small></td>' +
          '<td><span class="badge badge-info">' + escapeHtml(formatDistrictName(d.districtId)) + '</span></td>' +
          '<td>' + escapeHtml(formatCategoryName(d.category)) + '</td>' +
          '<td><small>' + d.latitude.toFixed(4) + ', ' + d.longitude.toFixed(4) + '</small></td>' +
          '<td>' + (d.popular ? '<span class="badge badge-success">Popular</span>' : '') + ' ' + (d.hiddenGem ? '<span class="badge badge-warning">Gem</span>' : '') + '</td>' +
          '<td><a href="' + getBasePath() + 'places/' + d.slug + '.html" target="_blank" class="btn btn-xs btn-outline-primary"><i class="fa fa-eye"></i> View</a></td>' +
        '</tr>';
      });
      tableBody.innerHTML = html;
    }

    renderAdminTable(destinations);

    if (adminSearch) {
      adminSearch.addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        const filtered = destinations.filter(function(d) {
          return d.name.toLowerCase().includes(q) ||
                 d.slug.toLowerCase().includes(q) ||
                 (d.districtId && d.districtId.toLowerCase().includes(q));
        });
        renderAdminTable(filtered);
      });
    }

    if (adminExportBtn) {
      adminExportBtn.addEventListener('click', function() {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(destinations, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'sri-lanka-destinations-export.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    }
  }

  // Helper utilities
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDistrictName(id) {
    if (!id) return '';
    var name = id.split('-').map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }).join(' ');
    return name.replace(/\s+District$/i, '');
  }

  function formatCategoryName(cat) {
    if (!cat) return 'Attraction';
    return cat.split('-').map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }).join(' ');
  }

  function getBasePath() {
    // If in a subfolder like /provinces/, /districts/, /places/, return '../'
    const pathname = window.location.pathname;
    if (pathname.includes('/provinces/') || pathname.includes('/districts/') || pathname.includes('/places/') || pathname.includes('/admin/')) {
      return '../';
    }
    return '';
  }

})();
