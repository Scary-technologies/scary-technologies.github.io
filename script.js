/**
 * TACTICAL CYBER INFRASTRUCTURE OS // SYSTEM ENGINE
 */

// Live Digital System Clock
function updateSystemClock() {
    const clockElement = document.getElementById('liveClock');
    if (!clockElement) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateSystemClock, 1000);

// Audio Synthesis Engine (Tactical Interface Feedback)
function triggerUIBeep(frequency = 550, duration = 0.03) {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        
        const audioCtx = new AudioContextClass();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Low volume setting (0.008) to remain elegant and unobtrusive
        gainNode.gain.setValueAtTime(0.008, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (err) {
        // Suppress browser audio-autostart restriction warnings safely
    }
}

// Attach Interactive Sounds to Telemetry Node Grid
document.addEventListener('DOMContentLoaded', () => {
    updateSystemClock(); // Initialize clock instantly
    
    const interactiveElements = document.querySelectorAll('.dock-node, .cyber-link-btn, .cluster-box');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            triggerUIBeep(750, 0.015); // Short tactical chirp on hover
        });
        
        element.addEventListener('click', () => {
            triggerUIBeep(400, 0.06); // Deeper confirmation tone on click
        });
    });
});

console.log("TACTICAL CORE DASHBOARD ENGINE ONLINE.");