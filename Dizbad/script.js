// ۱. دیتابیس جامع مقاصد برای فیلتر پیشرفته چندگانه
const destinations = [
    { name: "🏡 اقامتگاه بوم‌گردی مرکزی دیزباد", type: "stay", access: "car", price: 400000, desc: "واقع در بافت اصلی کوچه باغ‌ها با دسترسی آسان ماشین‌رو و ترانسفر صمیمانه." },
    { name: "🏡 بوم‌گردی صخره‌ای ییلاق", type: "stay", access: "walk", price: 550000, desc: "منطقه‌ای مرتفع که برای دسترسی نیاز به ۱۰ دقیقه پیاده‌روی در مسیر مالرو دارد اما دید آن عالیست." },
    { name: "⛺ سایت کمپینگ چشمه ییلاقی", type: "camp", access: "walk", price: 50000, desc: "بالاترین نقطه مجاز کمپ در نزدیکی سرچشمه اصلی کوهستان، کاملاً دنج و بکر." },
    { name: "⛺ عوارضی و سکوی کمپ پایین‌دست", type: "camp", access: "car", price: 70000, desc: "نزدیک به جاده خاکی سبک، دارای سکوهای بتنی برای برپایی راحت چادر خانواده‌ها." },
    { name: "🏡 کلبه چوبی آشیانه افرا", type: "stay", access: "walk", price: 650000, desc: "سازه‌ای تمام چوب در دل شیب کوهستان، احاطه شده با درختان کهنسال و صدای همیشگی رودخانه." },
    { name: "🏡 سوئیت سنتی چشم‌انداز بالا", type: "stay", access: "car", price: 480000, desc: "واقع در بالاترین محله روستا با پارکینگ اختصاصی و بالکنی بزرگ رو به معماری پلکانی دیزباد." },
    { name: "⛺ محوطه کمپ باغ توت", type: "camp", access: "car", price: 90000, desc: "باغی مسطح و محصور با امنیت بالا، دارای سرویس بهداشتی و دسترسی راحت به سوپرمارکت محله." },
    { name: "🏡 خانه مسافر باغ‌نظر", type: "stay", access: "walk", price: 350000, desc: "خانه‌ای قدیمی با معماری سنگی و گِلی، فضایی نوستالژیک در قلب کوچه‌باغ‌های فرعی." },
    { name: "⛺ کلبه‌های درختی و کمپ دشت بالا", type: "camp", access: "walk", price: 120000, desc: "ترکیبی از سکوهای معلق درختی و فضای باز برای چادر زدن، مخصوص علاقه‌مندان به ستاره‌نگری در شب." },
    { name: "🏡 عمارت تاریخی خان‌نشین", type: "stay", access: "car", price: 800000, desc: "بزرگ‌ترین اقامتگاه سنتی روستا با حیاط درندشت، تالار آینه‌کاری شده و تجهیزات کامل رفاهی." },
    { name: "🏡 سوئیت صخره‌ای آفتاب‌گیر", type: "stay", access: "walk", price: 500000, desc: "سوئیتی دنج تراشیده شده در دل سنگ، با پنجره‌ای بزرگ رو به دره و طلوع آفتاب بی‌نظیر منطقه." },
    { name: "⛺ کمپ ساحلی رودخانه دیزباد", type: "camp", access: "walk", price: 60000, desc: "برپایی چادر در مجاورت مستقیم رودخانه، دارای سایه‌سار طبیعی درختان سپیدار و چنار." },
    { name: "🏡 اقامتگاه بوم‌گردی بادگیر سنتی", type: "stay", access: "car", price: 420000, desc: "تجربه‌ای خاص در معماری سازگار با بادهای معروف منطقه، خنک در تابستان بدون نیاز به کولر." },
    { name: "⛺ سایت کمپینگ دشت گردو", type: "camp", access: "walk", price: 85000, desc: "فضایی باز و مسطح در میان درختان گردوی کهنسال، ایده‌آل برای گروه‌های کوهنوردی پرجمعیت." },
    { name: "🏡 کلبه سوئیسی شیب‌خاک", type: "stay", access: "car", price: 750000, desc: "سازه‌ای مدرن و شیک در حاشیه روستا با جاده آسفالت، مناسب برای سفرهای دونفره و لوکس." }
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

// ۳. سیستم مدیریت لایت‌باکس گالری تصاویر
function openLightbox(title, desc) {
    document.getElementById('lightbox-title').textContent = title;
    document.getElementById('lightbox-desc').textContent = desc;
    document.getElementById('lightbox').style.display = 'flex';
}
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// اجرای توابع اولیه در هنگام بالا آمدن صفحه
runAdvancedFilter();
calculateEcoTrip();