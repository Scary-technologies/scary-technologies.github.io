document.addEventListener('DOMContentLoaded', () => {

    // ۱. موتور ذرات اختصاصی پس‌زمینه (Interactive Ambient Particle Engine)
    const canvas = document.getElementById('ambient-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 60;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10;
            this.color = Math.random() > 0.5 ? '#9e7b66' : '#66635f'; // رنگ چرم و دودی
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            // فیزیک فرار ذرات از ماوس (Fluid Repulsion)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = (dx / distance) * force * this.density;
                let directionY = (dy / distance) * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // بازگشت نرم به موقعیت اولیه در صورت نبودن ماوس
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
        }
    }

    // مقداردهی اولیه به بوم زنده
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ۲. نشانگر ماوس نرم اینورتر (Fluid Inverting Cursor)
    const cursor = document.querySelector('.magnetic-cursor');
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function renderCursor() {
        // ایجاد تاخیر اینرسی بی‌پایان برای کرسر (LERP)
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();


    // ۳. مکانیزم پیشرفته اسکرول و پارالاکس کارت‌ها (Performant Custom Parallax)
    const progressBar = document.querySelector('.scroll-progress');
    const cards = document.querySelectorAll('.editorial-card');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // به‌روزرسانی خط پیشرفت بالا
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrolled + '%';

        // پارالاکس نرم کارت‌ها بر اساس موقعیت در ویوپورت
        cards.forEach(card => {
            const speed = parseFloat(card.getAttribute('data-parallax'));
            const rect = card.getBoundingClientRect();
            const elementInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (elementInView) {
                const yOffset = rect.top * speed;
                card.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            }
        });
    });
});