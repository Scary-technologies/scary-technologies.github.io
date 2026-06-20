// پیاده‌سازی افکت بارش ماتریکس در بک‌گراند
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789📡🔒⚡💻🐍';
const alphabet = katakana.split('');

const fontSize = 16;
const columns = canvas.width / fontSize;

const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

const drawMatrix = () => {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff66';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

setInterval(drawMatrix, 30);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// شبیه‌ساز لاگ‌های امنیتی ترمینال در ابتدای ورود
const logs = [
    "INITIALIZING SECURITY PROTOCOLS...",
    "CONNECTING TO SCARY TECHNOLOGIES SECURE NODE...",
    "LOADING EXPERTISE: [NETWORK, SECURITY, PYTHON, WOOCOMMERCE]",
    "BYPASSING FIREWALL... ACCESS GRANTED.",
    "WELCOME COMMANDER ALI MIRSHAHI (PR-M)."
];

let logIndex = 0;
let charIndex = 0;

function typeLog() {
    const terminalText = document.getElementById('terminalText');
    if (!terminalText) return; // لایه‌محافظ برای جلوگیری از خطا در صورت عدم لود المان

    if (logIndex < logs.length) {
        if (charIndex < logs[logIndex].length) {
            terminalText.innerHTML += logs[logIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeLog, 15); // افزایش سرعت تایپ برای تجربه کاربری بهتر
        } else {
            terminalText.innerHTML += "<br>"; // اصلاح ساختار شکست خط در اچ‌تی‌ام‌ایل
            logIndex++;
            charIndex = 0;
            setTimeout(typeLog, 200);
        }
    } else {
        // حذف قطعی لایه ترمینال پس از اتمام شبیه‌سازی بوت
        setTimeout(() => {
            const overlay = document.getElementById('terminalOverlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }
        }, 800);
    }
}

// اجرای حتمی پس از لود کامل کل ساختار صفحه
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(typeLog, 100);
} else {
    document.addEventListener("DOMContentLoaded", typeLog);
}
