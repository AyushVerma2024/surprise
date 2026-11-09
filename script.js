// ===================================================
// ✨ PARTICLE SYSTEM — soft glowing dots background
// ===================================================
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    const PARTICLE_COUNT = 80;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.r = Math.random() * 2 + 0.5;
            this.dx = (Math.random() - 0.5) * 0.3;
            this.dy = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() * 30 + 340; // pinks/reds
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${this.hue}, 80%, 70%, 0.3)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
})();


// ===================================================
// ✨ SCROLL REVEAL — staggered children animations
// ===================================================
const reveals = document.querySelectorAll('.reveal');

function checkReveal() {
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.82;
        if (top < triggerPoint) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', checkReveal, { passive: true });
window.addEventListener('load', checkReveal);


// ===================================================
// 💌 LOVE BUTTON — envelope open + MEGA celebration
// ===================================================
const loveBtn = document.getElementById('loveBtn');
const secret = document.getElementById('secret');
const envelope = document.getElementById('envelope');

let secretOpened = false;

loveBtn.addEventListener('click', () => {
    if (secretOpened) return;
    secretOpened = true;

    // 1) LIGHTNING FLASH
    triggerLightning();

    // 2) Open envelope flap
    if (envelope) {
        envelope.classList.add('opened');
    }

    // 3) Full-screen cracker fireworks
    setTimeout(() => launchCelebrationFireworks(), 300);

    // 4) Confetti rain
    setTimeout(() => launchConfetti(), 500);

    // 5) Glowing pulse overlay
    triggerGlowPulse();

    // 6) Show the letter with sparkle rain
    setTimeout(() => {
        secret.style.display = 'block';
        secret.animate(
            [
                { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' }
            ],
            { duration: 800, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
        );

        // Stagger reveal each paragraph
        const paragraphs = secret.querySelectorAll('.letter-content p');
        paragraphs.forEach((p, i) => {
            setTimeout(() => {
                p.classList.add('show');
            }, 400 + i * 500);
        });

        // Burst hearts from button
        burstHearts(loveBtn.getBoundingClientRect());

        // Sparkle rain from top
        setTimeout(() => sparkleRain(), 200);

        // Second wave of fireworks
        setTimeout(() => launchCelebrationFireworks(), 1500);

        // Third wave
        setTimeout(() => launchCelebrationFireworks(), 3000);
    }, 600);
});

// ⚡ LIGHTNING FLASH
function triggerLightning() {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position:fixed;inset:0;z-index:99999;pointer-events:none;
        background:rgba(255,200,220,0);
    `;
    document.body.appendChild(flash);

    // Triple flash like real lightning
    const flashes = [
        { delay: 0, opacity: 0.7, dur: 80 },
        { delay: 150, opacity: 0.4, dur: 60 },
        { delay: 300, opacity: 0.9, dur: 120 },
    ];

    flashes.forEach(f => {
        setTimeout(() => {
            flash.animate([
                { background: `rgba(255,180,210,${f.opacity})` },
                { background: 'rgba(255,180,210,0)' }
            ], { duration: f.dur, easing: 'ease-out', fill: 'forwards' });
        }, f.delay);
    });

    setTimeout(() => flash.remove(), 600);
}

// 🎇 FULL-SCREEN CELEBRATION FIREWORKS (crackers)
function launchCelebrationFireworks() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position:fixed;inset:0;z-index:9998;pointer-events:none;
        width:100vw;height:100vh;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let rockets = [];
    const colors = [
        [255, 107, 157], [255, 163, 196], [255, 80, 130],
        [255, 215, 0], [255, 150, 50], [255, 100, 100],
        [200, 100, 255], [100, 200, 255], [255, 255, 150],
    ];

    // Launch 6 rockets from bottom
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
            rockets.push({
                x,
                y: canvas.height,
                targetY: Math.random() * canvas.height * 0.4 + canvas.height * 0.05,
                vx: (Math.random() - 0.5) * 2,
                vy: -(Math.random() * 6 + 10),
                color: colors[Math.floor(Math.random() * colors.length)],
                trail: [],
                exploded: false
            });
        }, i * 200);
    }

    function explode(r) {
        const count = Math.floor(Math.random() * 50) + 60;
        const c = r.color;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
            const speed = Math.random() * 6 + 2;
            sparks.push({
                x: r.x, y: r.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                decay: Math.random() * 0.012 + 0.008,
                r: Math.random() * 2.5 + 1,
                color: c,
                glow: Math.random() > 0.5
            });
        }
        // Crackle sparks (small golden ones)
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            sparks.push({
                x: r.x, y: r.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015,
                r: 1,
                color: [255, 215, 100],
                glow: true
            });
        }
    }

    let startTime = performance.now();
    function animate(now) {
        if (now - startTime > 5000) {
            canvas.remove();
            return;
        }
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        // Update rockets
        rockets.forEach(r => {
            if (r.exploded) return;
            r.x += r.vx;
            r.y += r.vy;
            r.vy += 0.15;
            // Rocket trail
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r.color.join(',')},1)`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `rgba(${r.color.join(',')},0.8)`;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (r.y <= r.targetY || r.vy >= 0) {
                r.exploded = true;
                explode(r);
            }
        });

        // Update sparks
        sparks.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.05;
            s.vx *= 0.985;
            s.alpha -= s.decay;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color.join(',')},${Math.max(0, s.alpha)})`;
            if (s.glow) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${s.color.join(',')},0.5)`;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        sparks = sparks.filter(s => s.alpha > 0);

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// 🎊 CONFETTI RAIN
function launchConfetti() {
    const confettiColors = ['#ff6b9d', '#ffa3c4', '#ff4f81', '#ffdd57', '#ff85aa', '#fff', '#ffd700', '#ff69b4', '#ff1493'];
    const confettiCount = 120;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const isCircle = Math.random() > 0.5;
            const size = Math.random() * 8 + 4;
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.cssText = `
                position:fixed;
                left:${Math.random() * 100}vw;
                top:-10px;
                width:${size}px;
                height:${isCircle ? size : size * 2.5}px;
                background:${color};
                border-radius:${isCircle ? '50%' : '2px'};
                pointer-events:none;
                z-index:9997;
                opacity:1;
            `;
            document.body.appendChild(confetti);

            const drift = (Math.random() - 0.5) * 200;
            const spin = Math.random() * 1080;

            confetti.animate([
                { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 50}px) translateX(${drift}px) rotate(${spin}deg)`, opacity: 0.6 }
            ], {
                duration: Math.random() * 2000 + 2500,
                easing: 'cubic-bezier(.25,.46,.45,.94)',
                fill: 'forwards'
            });

            setTimeout(() => confetti.remove(), 5000);
        }, Math.random() * 1500);
    }
}

// 🌟 GLOW PULSE OVERLAY
function triggerGlowPulse() {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position:fixed;inset:0;z-index:9996;pointer-events:none;
        background:radial-gradient(circle at 50% 50%, rgba(255,107,157,.15) 0%, transparent 70%);
        opacity:0;
    `;
    document.body.appendChild(glow);

    glow.animate([
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'scale(1.2)' },
        { opacity: 0.5, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' }
    ], {
        duration: 2000,
        easing: 'ease-out',
        fill: 'forwards'
    });

    setTimeout(() => glow.remove(), 2200);
}

// ✨ SPARKLE RAIN from top of screen
function sparkleRain() {
    const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '⚡'];
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const sp = document.createElement('div');
            sp.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            sp.style.cssText = `
                position:fixed;
                left:${Math.random() * 100}vw;
                top:-20px;
                font-size:${Math.random() * 14 + 10}px;
                pointer-events:none;
                z-index:9997;
            `;
            document.body.appendChild(sp);

            const drift = (Math.random() - 0.5) * 100;
            sp.animate([
                { transform: 'translateY(0) translateX(0) rotate(0deg) scale(0)', opacity: 1 },
                { transform: `translateY(${window.innerHeight * 0.7}px) translateX(${drift}px) rotate(${Math.random()*360}deg) scale(1)`, opacity: 0 }
            ], {
                duration: Math.random() * 1500 + 1500,
                easing: 'ease-out',
                fill: 'forwards'
            });

            setTimeout(() => sp.remove(), 3500);
        }, Math.random() * 2000);
    }
}

// Mini heart burst effect on button click
function burstHearts(rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const emojis = ['❤️', '💖', '💕', '💗', '💓', '✨'];

    for (let i = 0; i < 15; i++) {
        const el = document.createElement('div');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.cssText = `
            position:fixed;
            left:${centerX}px;
            top:${centerY}px;
            font-size:${Math.random() * 16 + 14}px;
            pointer-events:none;
            z-index:9999;
        `;
        document.body.appendChild(el);

        const angle = (Math.PI * 2 * i) / 15;
        const dist = Math.random() * 120 + 60;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 40;

        el.animate(
            [
                { transform: 'translate(0,0) scale(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${tx}px,${ty}px) scale(1.2) rotate(${Math.random()*360}deg)`, opacity: 0 }
            ],
            { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
        );

        setTimeout(() => el.remove(), 1300);
    }
}


// ===================================================
// 📅 DAY COUNTER — animated count-up
// ===================================================
const relationshipDate = new Date('2025-11-04');
const today = new Date();
const totalDays = Math.floor((today - relationshipDate) / (1000 * 60 * 60 * 24));

const counterEl = document.querySelector('.counter-number');
if (counterEl) {
    counterEl.setAttribute('data-target', totalDays);
    let counted = false;

    function animateCounter() {
        if (counted) return;
        const rect = counterEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            counted = true;
            let current = 0;
            const duration = 2500;
            const startTime = performance.now();

            function step(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                current = Math.floor(eased * totalDays);
                counterEl.textContent = current.toLocaleString() + '+';
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counterEl.textContent = totalDays.toLocaleString() + '+';
                }
            }
            requestAnimationFrame(step);
        }
    }

    window.addEventListener('scroll', animateCounter, { passive: true });
    window.addEventListener('load', animateCounter);
}


// ===================================================
// 💕 FLOATING HEARTS — with variety & sway
// ===================================================
const heartContainer = document.querySelector('.hearts');
const heartEmojis = ['❤️', '💕', '💖', '💗', '🩷', '🤍', '✨'];

setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 18 + 12) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 16000);
}, 600);


// ===================================================
// 🎆 FIREWORKS — canvas in the final section
// ===================================================
(function initFireworks() {
    const canvas = document.getElementById('fireworkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const section = canvas.closest('section');
    let fireworks = [];
    let sparks = [];
    let w, h;
    let isVisible = false;

    function resize() {
        const rect = section.getBoundingClientRect();
        w = canvas.width = section.offsetWidth;
        h = canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Spark {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue + Math.random() * 30 - 15;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.012;
            this.r = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.04; // gravity
            this.vx *= 0.99;
            this.alpha -= this.decay;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, 0.5)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function launchFirework() {
        const x = Math.random() * w * 0.6 + w * 0.2;
        const y = Math.random() * h * 0.4 + h * 0.1;
        const hue = Math.random() * 60 + 330; // pink-red range
        const count = Math.floor(Math.random() * 30) + 40;
        for (let i = 0; i < count; i++) {
            sparks.push(new Spark(x, y, hue));
        }
    }

    function animate() {
        if (!isVisible) {
            requestAnimationFrame(animate);
            return;
        }
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        sparks.forEach(s => {
            s.update();
            s.draw();
        });
        sparks = sparks.filter(s => s.alpha > 0);

        requestAnimationFrame(animate);
    }
    animate();

    // Launch fireworks periodically when visible
    let fireworkInterval = null;

    function checkVisibility() {
        const rect = section.getBoundingClientRect();
        const wasVisible = isVisible;
        isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !wasVisible) {
            // Start launching
            launchFirework();
            fireworkInterval = setInterval(launchFirework, 800);
        } else if (!isVisible && wasVisible) {
            clearInterval(fireworkInterval);
            fireworkInterval = null;
        }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('load', checkVisibility);
})();


// ===================================================
// 🖱️ PARALLAX DEPTH on mouse move (hero only)
// ===================================================
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${x * -15}px, ${y * -10}px)`;
        }
    });
}


// ===================================================
// ✨ SPARKLE ON CLICK — anywhere on page
// ===================================================
document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position:fixed;
            left:${e.clientX}px;
            top:${e.clientY}px;
            pointer-events:none;
            z-index:9999;
            font-size:${Math.random() * 12 + 10}px;
        `;
        document.body.appendChild(sparkle);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 50 + 20;

        sparkle.animate(
            [
                { transform: 'translate(0,0) scale(0)', opacity: 1 },
                { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(1)`, opacity: 0 }
            ],
            { duration: 800, easing: 'ease-out', fill: 'forwards' }
        );

        setTimeout(() => sparkle.remove(), 850);
    }
});


// ===================================================
// 🎨 TILT EFFECT on reason cards (gyroscope feel)
// ===================================================
document.querySelectorAll('.reason-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -12;
        const rotateY = (x - 0.5) * 12;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// ===================================================
// 🌊 SMOOTH SCROLL indicator hide on scroll
// ===================================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity .5s ease';
        } else {
            scrollIndicator.style.opacity = '';
        }
    }, { passive: true });
}