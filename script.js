// ایجاد سیستم تعاملی صوتی کمکی (صداهای بیپ دیجیتال بسیار ضعیف در هنگام کلیک روی ماژول‌ها)
// این قابلیت حس سخت‌افزاری بودن کامپیوتر را به کاربر القا می‌کند.

function playSystemBeep(frequency = 600, duration = 0.04) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime); // صدا فوق‌العاده آرام تنظیم شده تا آزاردهنده نباشد
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // ممانعت مروگرها از پخش صدا پیش از تعامل اول برطرف شد
    }
}

// گوش دادن به کلیک روی تمام گره‌های مخازن
document.addEventListener('DOMContentLoaded', () => {
    const nodes = document.querySelectorAll('.dock-node, .cyber-link-btn, .cluster-box');
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            playSystemBeep(800, 0.02); // صدای کلیک ملایم زمان هاور
        });
        
        node.addEventListener('click', () => {
            playSystemBeep(450, 0.08); // بیپ تایید زمان کلیک
        });
    });
});

console.log("CORE SYSTEM DASHBOARD V3.0 DEPLOYED SUCCESSFULLY.");