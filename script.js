document.addEventListener('mousemove', (e) => {
    const card = document.querySelector('.glass-card');
    if (!card) return;

    // محاسبه موقعیت ماوس نسبت به کارت شیشه‌ای
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // اعمال نور پس‌زمینه متحرک بر اساس مختصات ماوس
    card.style.background = `
        radial-gradient(
            800px circle at ${x}px ${y}px,
            rgba(255, 255, 255, 0.06),
            transparent 40%
        ),
        rgba(255, 255, 255, 0.02)
    `;
    
    card.style.borderColor = `rgba(255, 255, 255, 0.08)`;
});

// ایجاد جلوه ورودی نرم برای المان‌ها به محض لود شدن
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-card');
    if(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150);
    }
});