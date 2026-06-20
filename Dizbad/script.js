// ۱. دیتابیس جامع مقاصد برای فیلتر پیشرفته چندگانه
const destinations = [
    { name: "🏡 اقامتگاه بوم‌گردی مرکزی دیزباد", type: "stay", access: "car", price: 400000, desc: "واقع در بافت اصلی کوچه باغ‌ها با دسترسی آسان ماشین‌رو و ترانسفر صمیمانه." },
    {name: "🏡 اقامتگاه بوم‌گردی شب های دیزباد", type: "stay", access: "car", price: 400000, desc: "واقع در ورودی اصلی روستا جنب عوارضی دسترسی آسان ماشین‌رو و ترانسفر صمیمانه." },
    { name: "🏡 بوم‌گردی صخره‌ای ییلاق", type: "stay", access: "walk", price: 0, desc: "منطقه‌ای مرتفع که برای دسترسی نیاز به ۱۰ دقیقه پیاده‌روی در مسیر مالرو دارد اما دید آن عالیست." },
    { name: "⛺ سایت کمپینگ چشمه ییلاقی", type: "camp", access: "walk", price: 0, desc: "بالاترین نقطه مجاز کمپ در نزدیکی سرچشمه اصلی کوهستان، کاملاً دنج و بکر." },
    { name: "⛺ سایت کمپینگ چشمه ییلاقی", type: "camp", access: "walk", price: 0, desc: "بالاترین نقطه مجاز کمپ در نزدیکی سرچشمه اصلی کوهستان، کاملاً دنج و بکر." },
    
    { name: "⛺ عوارضی ورودی روستا دیزباد علیا", type: "camp", access: "car", price: 50000, desc: "نزدیک به جاده خاکی سبک، دارای سکوهای بتنی برای برپایی راحت چادر خانواده‌ها." }
];

// سیستم لود و فیلتر داینامیک خروجی‌ها
function runAdvancedFilter() {
    const selectedType = document.getElementById('filter-type').value;
    const selectedAccess = document.getElementById('filter-access').value;
    const resultsContainer = document.getElementById('filter-results');
    
    resultsContainer.innerHTML = ''; // پاکسازی قبلی‌ها

    destinations.forEach(item => {
        const matchType = (selectedType === 'all' || item.type === selectedType);
        const matchAccess = (selectedAccess === 'all' || item.access === selectedAccess);

        if (matchType && matchAccess) {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <span class="card-meta">${item.type === 'stay' ? '🏡 بوم‌گردی' : '⛺ کمپینگ'} | ${item.access === 'car' ? '🚗 ماشین‌رو' : '🥾 پیاده‌روی'}</span>
                <h3>${item.name}</h3>
                <p style="color:#555; font-size:0.95rem; line-height:1.6; margin-bottom:15px;">${item.desc}</p>
                <strong style="color:#1b4332;">هزینه پایه: ${item.price.toLocaleString()} تومان</strong>
            `;
            resultsContainer.appendChild(card);
        }
    });
}

// ۲. شبیه‌ساز هزینه و پسماند زیست‌محیطی (Eco-Calculator)
function calculateEcoTrip() {
    const people = parseInt(document.getElementById('eco-people').value) || 1;
    const days = parseInt(document.getElementById('eco-days').value) || 1;
    const type = document.getElementById('filter-type').value;

    // تخمین هزینه حدودی بر اساس میانگین دیتابیس
    let basePrice = (type === 'camp') ? 60000 : 800000;
    let totalCost = basePrice * days * people;

    // میانگین تولید پسماند روزانه هر فرد در سفر (حدود ۰.۶ کیلوگرم)
    let totalWaste = (people * days * 0.6).toFixed(1);

    document.getElementById('eco-cost').textContent = totalCost.toLocaleString();
    document.getElementById('eco-waste').textContent = totalWaste;

    // توصیه‌های زیست‌محیطی شخصی‌سازی شده تعاملی
    const tipElement = document.getElementById('eco-tip');
    if (totalWaste > 3) {
        tipElement.textContent = `⚠️ توجه: گروه شما حجم قابل‌توجهی زباله تولید خواهد کرد. لطفاً حتماً ظروف یکبار مصرف را حذف کنید و کیسه تفکیک پسماند خشک به همراه داشته باشید تا سنت صددرصد بازیافت دیزباد حفظ شود.`;
    } else {
        tipElement.textContent = `🌿 عالی است! حجم پسماند گروه شما ناچیز است. از خرید مستقیم محصولات باغی از اهالی برای حمایت از اقتصاد روستا لذت ببرید.`;
    }
}

// ۳. سیستم مدیریت لایت‌باکس گالری تصاویر
function openLightbox(title, desc) {
    document.getElementById('lightbox-title').textContent = title;
    document.getElementById('lightbox-desc').textContent = desc;
    document.getElementById('lightbox').style.display = 'flex';
}
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// ۴. راه اندازی نقشه هوایی ماهواره‌ای
const map = L.map('map').setView([36.1032, 59.2785], 15);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri Satellite'
}).addTo(map);

// افزودن مارکر نقاط روی نقشه
destinations.forEach(d => {
    L.marker(d.type === 'stay' ? [36.1025, 59.2770] : [36.09704505285554, 59.28700998528118]).addTo(map)
     .bindPopup(`<b style="font-family:'Vazirmatn';">${d.name}</b>`);
});

// اجرای توابع اولیه در هنگام بالا آمدن صفحه
runAdvancedFilter();
calculateEcoTrip();