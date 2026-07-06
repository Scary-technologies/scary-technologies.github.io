// ─── Map Setup ───────────────────────────────────────────────────────────────
const bounds = [[0, 0], [MAP_CONFIG.imageHeight, MAP_CONFIG.imageWidth]];

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 3,
  zoomDelta: 1,
  zoomSnap: 0.5,
  preferCanvas: true,
  zoomControl: false,
  attributionControl: false,
  tap: true,
});

L.imageOverlay(MAP_CONFIG.imageUrl, bounds).addTo(map);
map.setMaxBounds(bounds);
map.fitBounds(bounds);

L.control.zoom({ position: 'bottomleft' }).addTo(map);

// ─── Layers ───────────────────────────────────────────────────────────────────
const layers = {
  camp:       L.layerGroup().addTo(map),
  housing:    L.layerGroup().addTo(map),
  restaurant: L.layerGroup().addTo(map),
  market:     L.layerGroup().addTo(map),
};

L.control.layers(null, {
  '⛺ محل‌های کمپ':       layers.camp,
  '🏢 مجتمع‌های اسکان':  layers.housing,
  '🍔 رستوران‌ها':        layers.restaurant,
  '🛒 سوپرمارکت‌ها':     layers.market,
}, { collapsed: true, position: 'topright' }).addTo(map);

// ─── Markers ─────────────────────────────────────────────────────────────────
function createCustomIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div class="custom-marker" style="background:${color}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

TOURIST_PLACES.forEach(place => {
  if (!layers[place.type]) return;
  const marker = L.marker(place.coords, { icon: createCustomIcon(place.color) });
  marker.on('click', () => showBottomSheet(place));
  marker.addTo(layers[place.type]);
  place.markerInstance = marker;
});

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
let currentImageIndex = 0;
let totalImages = 0;

const bottomSheet = document.getElementById('bottomSheet');
const galleryWrapper = document.getElementById('galleryWrapper');
const galleryDots = document.getElementById('galleryDots');
const galleryContainer = document.getElementById('galleryContainer');

function showBottomSheet(place) {
  document.getElementById('sheetTitle').textContent = place.name;
  document.getElementById('sheetBadge').textContent = place.status;
  document.getElementById('sheetDesc').textContent = place.desc || '';
  document.getElementById('sheetTime').textContent = place.time || '—';

  const phoneEl = document.getElementById('sheetPhone');
  phoneEl.textContent = place.phone;
  phoneEl.href = `tel:${place.phone}`;

  // Gallery
  galleryWrapper.innerHTML = '';
  galleryDots.innerHTML = '';
  currentImageIndex = 0;

  if (place.images && place.images.length > 0) {
    totalImages = place.images.length;
    place.images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${place.name} - تصویر ${i + 1}`;
      img.onerror = () => {
        img.style.display = 'none';
        // show fallback placeholder
        const fb = document.createElement('div');
        fb.className = 'img-fallback';
        fb.textContent = '📷';
        img.parentNode && img.parentNode.replaceChild(fb, img);
      };
      galleryWrapper.appendChild(img);

      const dot = document.createElement('span');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToImage(i);
      galleryDots.appendChild(dot);
    });
    galleryContainer.style.display = 'block';
  } else {
    totalImages = 0;
    galleryContainer.style.display = 'none';
  }

  updateGalleryPosition();
  bottomSheet.classList.add('active');
  map.setView(place.coords, 2, { animate: true });
}

function closeSheet() {
  bottomSheet.classList.remove('active');
}

function moveGallery(dir) {
  if (totalImages === 0) return;
  currentImageIndex = (currentImageIndex + dir + totalImages) % totalImages;
  updateGalleryPosition();
}

function goToImage(index) {
  currentImageIndex = index;
  updateGalleryPosition();
}

function updateGalleryPosition() {
  galleryWrapper.style.transform = `translateX(${currentImageIndex * -100}%)`;
  document.querySelectorAll('.gallery-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentImageIndex);
  });
}

// Swipe support
let touchStartX = 0;
galleryContainer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
galleryContainer.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) moveGallery(diff > 0 ? 1 : -1);
});

// ─── Search ───────────────────────────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchClear = document.getElementById('searchClear');

function searchLocation() {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  searchClear.style.display = q ? 'flex' : 'none';

  if (!q) { searchResults.hidden = true; return; }

  const matches = TOURIST_PLACES.filter(p => p.name.toLowerCase().includes(q));

  if (matches.length > 0) {
    searchResults.hidden = false;
    matches.forEach(place => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.setAttribute('role', 'option');
      item.textContent = place.name;
      item.onclick = () => {
        showBottomSheet(place);
        searchResults.hidden = true;
        searchInput.value = place.name;
        searchClear.style.display = 'flex';
      };
      searchResults.appendChild(item);
    });
  } else {
    searchResults.hidden = true;
  }
}

function clearSearch() {
  searchInput.value = '';
  searchResults.hidden = true;
  searchClear.style.display = 'none';
  searchInput.focus();
}

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') clearSearch();
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-box') && !e.target.closest('.search-results')) {
    searchResults.hidden = true;
  }
});

// ─── Fullscreen ───────────────────────────────────────────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ─── Coordinates ─────────────────────────────────────────────────────────────
const coordsBox = document.getElementById('coords-box');

map.on('mousemove', e => {
  const x = Math.round(e.latlng.lng);
  const y = Math.round(e.latlng.lat);
  if (x >= 0 && x <= MAP_CONFIG.imageWidth && y >= 0 && y <= MAP_CONFIG.imageHeight) {
    coordsBox.textContent = `X: ${x}  Y: ${y}`;
    coordsBox.style.display = 'block';
  } else {
    coordsBox.style.display = 'none';
  }
});
