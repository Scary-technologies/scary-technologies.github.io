// ۱. راه‌اندازی بوم پیکسلی نقشه بدون کنترل زوم پیش‌فرض
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 3,
    zoomDelta: 1,
    zoomSnap: 0.5,
    preferCanvas: true,
    tap: true,
    zoomControl: false, // غیرفعال‌سازی برای جلوگیری از روی هم افتادن با هدر
    attributionControl: false 
});

const bounds = [[0, 0], [MAP_CONFIG.imageHeight, MAP_CONFIG.imageWidth]];
L.imageOverlay(MAP_CONFIG.imageUrl, bounds).addTo(map);
map.setMaxBounds(bounds);
map.fitBounds(bounds);

// قرار دادن دکمه‌های کنترل زوم در موقعیت امن پایین سمت چپ پروژه
L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

// دسته‌بندی لایه‌ها
const layers = {
    camp: L.layerGroup().addTo(map),
    housing: L.layerGroup().addTo(map),
    restaurant: L.layerGroup().addTo(map),
    market: L.layerGroup().addTo(map)
};

function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// رندر مارکرها
TOURIST_PLACES.forEach(place => {
    if (layers[place.type]) {
        const marker = L.marker(place.coords, { icon: createCustomIcon(place.color) })
            .addTo(layers[place.type]);
            
        marker.on('click', () => showBottomSheet(place));
        place.markerInstance = marker;
    }
});

// کنترل منوی لایه‌ها در گوشه بالا سمت راست (دارای حاشیه از هدر)
L.control.layers(null, {
    "⛺ محل‌های کمپ": layers.camp,
    "🏢 مجتمع‌های اسکان": layers.housing,
    "🍔 رستوران‌ها": layers.restaurant,
    "🛒 سوپرمارکت‌ها": layers.market
}, { collapsed: true, position: 'topright' }).addTo(map);


// ==========================================
// منطق مدیریت Bottom Sheet و گالری اسلایدی
// ==========================================
let currentImageIndex = 0;
let totalImages = 0;

function showBottomSheet(place) {
    document.getElementById('sheetTitle').innerText = place.name;
    document.getElementById('sheetBadge').innerText = place.status;
    document.getElementById('sheetDesc').innerText = place.desc;
    document.getElementById('sheetTime').innerText = place.time;
    
    const phoneEl = document.getElementById('sheetPhone');
    phoneEl.innerText = place.phone;
    phoneEl.href = `tel:${place.phone}`;

    const wrapper = document.getElementById('galleryWrapper');
    wrapper.innerHTML = '';
    currentImageIndex = 0;
    
    if (place.images && place.images.length > 0) {
        totalImages = place.images.length;
        place.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.onerror = () => { img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666">تصویر یافت نشد</text></svg>'; };
            wrapper.appendChild(img);
        });
        document.querySelector('.gallery-container').style.display = 'block';
    } else {
        totalImages = 0;
        document.querySelector('.gallery-container').style.display = 'none';
    }
    
    updateGalleryPosition();
    document.getElementById('bottomSheet').classList.add('active');
    
    // پدینگ داینامیک برای اینکه نقطه مارکر برود بالای کارت کشویی قرار گیرد و پنهان نشود
    map.setView(place.coords, 2, { padding: [0, 100] });
}

function closeSheet() {
    document.getElementById('bottomSheet').classList.remove('active');
}

function moveGallery(direction) {
    if (totalImages === 0) return;
    currentImageIndex += direction;
    if (currentImageIndex >= totalImages) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = totalImages - 1;
    updateGalleryPosition();
}

function updateGalleryPosition() {
    const wrapper = document.getElementById('galleryWrapper');
    wrapper.style.transform = `translateX(${currentImageIndex * 100}%)`;
}


// 🔢 سیستم زنده نمایش مختصات پیکسلی
const coordsBox = document.getElementById('coords-box');
map.on('mousemove', function(e) {
    const x = Math.round(e.latlng.lng);
    const y = Math.round(e.latlng.lat);
    if(x >= 0 && x <= MAP_CONFIG.imageWidth && y >= 0 && y <= MAP_CONFIG.imageHeight) {
        coordsBox.innerHTML = `X: ${x} , Y: ${y}`;
    }
});

// 🔍 سیستم سرچ هوشمند
function searchLocation() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (query === '') { resultsContainer.style.display = 'none'; return; }
    const filtered = TOURIST_PLACES.filter(p => p.name.toLowerCase().includes(query));

    if (filtered.length > 0) {
        resultsContainer.style.display = 'block';
        filtered.forEach(place => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.innerText = place.name;
            div.onclick = () => {
                showBottomSheet(place);
                resultsContainer.style.display = 'none';
                document.getElementById('searchInput').value = place.name;
            };
            resultsContainer.appendChild(div);
        });
    } else { resultsContainer.style.display = 'none'; }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); } 
    else { document.exitFullscreen(); }
}