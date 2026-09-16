/**
 * Happy Birthday Mrigesh! - Interactive Experience
 * Crafted with love by Manan Dewan
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initConfetti();
  initCandles();
  initBlinkitDelivery();
  initFlipCards();
  initCouponGenerator();
  initAudioSystem();
  initTapEffects();
  
  // Launch initial welcome celebration shower after a gentle delay
  setTimeout(() => {
    fireConfettiShower(60);
  }, 600);
});

/* ==========================================================================
   1. Confetti Particle Engine (Canvas 2D, 60fps, Zero Dependencies)
   ========================================================================== */
let confettiCtx = null;
let confettiCanvas = null;
let confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiBtn = document.getElementById('confetti-btn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('pop');
      fireConfettiShower(75);
    });
  }
}

const CONFETTI_COLORS = [
  '#FF6B8B', '#FFD166', '#06D6A0', '#118AB2', '#9D4EDD', 
  '#FF8E53', '#F7CB15', '#0C831F', '#FF3366', '#4EA8DE'
];

class ConfettiParticle {
  constructor(x, y, isBurst = false) {
    this.x = x ?? Math.random() * window.innerWidth;
    this.y = y ?? -10;
    this.size = Math.random() * 8 + 6;
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.shape = Math.random() > 0.3 ? 'rect' : 'circle';
    
    if (isBurst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 6;
    } else {
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = Math.random() * 3 + 2;
    }
    
    this.gravity = 0.22;
    this.friction = 0.96;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.005;
  }

  update() {
    this.vx *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function fireConfettiShower(count = 60) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
  if (!confettiAnimationId) {
    runConfettiLoop();
  }
}

function fireConfettiBurst(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push(new ConfettiParticle(x, y, true));
  }
  if (!confettiAnimationId) {
    runConfettiLoop();
  }
}

function runConfettiLoop() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.update();
    p.draw(confettiCtx);

    if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
      confettiParticles.splice(i, 1);
    }
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(runConfettiLoop);
  } else {
    confettiAnimationId = null;
  }
}

/* ==========================================================================
   2. Interactive Candle Blowing & Wish Ritual
   ========================================================================== */
let unblownCandles = 3;

function initCandles() {
  const candleButtons = document.querySelectorAll('.candle-btn');
  const wishText = document.getElementById('wish-text');
  const relightBtn = document.getElementById('relight-btn');
  const celebrationDialog = document.getElementById('celebration-dialog');
  const closeDialogBtn = document.getElementById('close-dialog-btn');

  candleButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const candleNum = btn.getAttribute('data-candle');
      const flame = document.getElementById(`flame-${candleNum}`);
      const smoke = document.getElementById(`smoke-${candleNum}`);

      if (flame && !flame.classList.contains('extinguished')) {
        flame.classList.add('extinguished');
        playSound('puff');

        if (smoke) {
          smoke.classList.add('puff');
          setTimeout(() => smoke.classList.remove('puff'), 1000);
        }

        unblownCandles--;
        createFloatingEmoji(e.clientX || (window.innerWidth / 2), e.clientY || 300, '💨');

        if (unblownCandles > 0) {
          wishText.textContent = `Puff! ${unblownCandles} candle${unblownCandles === 1 ? '' : 's'} remaining! Keep going! 💨`;
        } else {
          // All candles blown!
          wishText.innerHTML = `🎉 <strong>All candles blown! Make your wish, Mrigesh!</strong> 🌟`;
          if (relightBtn) relightBtn.classList.remove('hidden');

          // Epic celebration effects
          playSound('chime');
          fireConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.4, 90);
          fireConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.4, 90);

          setTimeout(() => {
            if (celebrationDialog && typeof celebrationDialog.showModal === 'function') {
              celebrationDialog.showModal();
            }
          }, 800);
        }
      }
    });
  });

  if (relightBtn) {
    relightBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('pop');
      unblownCandles = 3;
      document.querySelectorAll('.flame').forEach((flame) => {
        flame.classList.remove('extinguished');
      });
      wishText.textContent = 'Candles relit! Tap them to blow them out (3 remaining)! 💨';
      relightBtn.classList.add('hidden');
    });
  }

  if (closeDialogBtn && celebrationDialog) {
    closeDialogBtn.addEventListener('click', () => {
      playSound('pop');
      celebrationDialog.close();
      fireConfettiShower(60);
    });
  }
}

/* ==========================================================================
   3. Blinkit Express Birthday Delivery
   ========================================================================== */
function initBlinkitDelivery() {
  const sendHugsBtn = document.getElementById('send-hugs-btn');
  if (!sendHugsBtn) return;

  const originalContent = sendHugsBtn.innerHTML;

  sendHugsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('chime');
    
    // Confetti burst from button position
    const rect = sendHugsBtn.getBoundingClientRect();
    fireConfettiBurst(rect.left + rect.width / 2, rect.top, 70);

    // Floating love items
    const loveEmojis = ['🛵', '❤️', '🎂', '⚡️', '🤗', '📦', '💛'];
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const randX = rect.left + Math.random() * rect.width;
        createFloatingEmoji(randX, rect.top, loveEmojis[i % loveEmojis.length]);
      }, i * 90);
    }

    sendHugsBtn.innerHTML = `<span>🎉 DELIVERED INSTANTLY TO MRIGESH! ❤️</span>`;
    sendHugsBtn.style.background = 'linear-gradient(135deg, #FF6B8B 0%, #FF8E53 100%)';

    setTimeout(() => {
      sendHugsBtn.innerHTML = originalContent;
      sendHugsBtn.style.background = '';
    }, 2800);
  });
}

/* ==========================================================================
   4. Flip Cards for Mobile and Desktop
   ========================================================================== */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('pop');
      card.classList.toggle('flipped');
    });
    
    // Keyboard accessibility (Enter/Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playSound('pop');
        card.classList.toggle('flipped');
      }
    });
  });
}

/* ==========================================================================
   5. Brotherly Perk Coupon Machine
   ========================================================================== */
const PERKS = [
  {
    icon: '🍕',
    badge: 'DELICIOUS PERK',
    title: 'Free Feast on Manan',
    desc: 'Manan orders and pays for your favourite midnight pizza, sushi, or dessert cravings anytime!'
  },
  {
    icon: '☕️',
    badge: 'ENERGY BOOST',
    title: 'Lifetime Coffee Sponsor',
    desc: 'Whenever we meet, coffee and cold brews are 100% on Manan. No questions asked.'
  },
  {
    icon: '🎟️',
    badge: 'IMMUNITY CARD',
    title: 'The Debate Auto-Win Pass',
    desc: 'Show this card in any debate with Manan to instantly win and declare total victory!'
  },
  {
    icon: '🛋️',
    badge: 'CHILL MODE',
    title: 'The Sibling Chore Shield',
    desc: 'Excuses you from helping with any chore or errand today. Pure relaxation only.'
  },
  {
    icon: '🚀',
    badge: 'BLINKIT HYPE SQUAD',
    title: 'Personal PR Agency',
    desc: 'Manan will enthusiastically hype up every single Blinkit update to at least 50 people!'
  },
  {
    icon: '🤗',
    badge: 'UNLIMITED VALUE',
    title: 'VIP Brother Hug Subscription',
    desc: 'Redeemable anytime, anywhere for immediate brotherly moral support, laughs, and high-fives.'
  },
  {
    icon: '🏎️',
    badge: 'ROADTRIP PASS',
    title: 'Shotgun & Aux Privilege',
    desc: 'Guaranteed shotgun seat and unrestricted control of the music playlist on our next drive!'
  }
];

let lastPerkIndex = -1;

function initCouponGenerator() {
  const drawBtn = document.getElementById('draw-coupon-btn');
  const iconEl = document.getElementById('coupon-icon');
  const badgeEl = document.getElementById('coupon-badge');
  const titleEl = document.getElementById('coupon-title');
  const descEl = document.getElementById('coupon-desc');
  const couponDisplay = document.getElementById('coupon-display');

  if (!drawBtn) return;

  drawBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('pop');

    // Pick a new random perk different from previous
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * PERKS.length);
    } while (newIndex === lastPerkIndex && PERKS.length > 1);
    lastPerkIndex = newIndex;

    const perk = PERKS[newIndex];

    // Card punch-in animation
    couponDisplay.style.transform = 'scale(0.92)';
    couponDisplay.style.opacity = '0.7';

    setTimeout(() => {
      iconEl.textContent = perk.icon;
      badgeEl.textContent = perk.badge;
      titleEl.textContent = perk.title;
      descEl.textContent = perk.desc;

      couponDisplay.style.transform = 'scale(1)';
      couponDisplay.style.opacity = '1';

      const rect = drawBtn.getBoundingClientRect();
      fireConfettiBurst(rect.left + rect.width / 2, rect.top, 50);
      playSound('chime');
    }, 150);
  });
}

/* ==========================================================================
   6. Audio Synthesis via Web Audio API (Zero External MP3 Assets)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound effects generator
function playSound(type) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (type === 'pop') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } else if (type === 'puff') {
    // White noise / breath puff for candle
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } else if (type === 'chime') {
    // Celebratory arpeggio chime (C - E - G - C5)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }, idx * 75);
    });
  }
}

// "Happy Birthday" melody synthesizer in lovely music-box tones
function playBirthdayNote(freq, duration, startTime) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Gentle music-box tone
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Note frequencies (C4 to C5 scale)
const NOTES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25
};

// Happy Birthday melody sequence: [note, duration in seconds]
const BIRTHDAY_SONG = [
  ['C4', 0.35], ['C4', 0.25], ['D4', 0.55], ['C4', 0.55], ['F4', 0.55], ['E4', 0.95],
  ['C4', 0.35], ['C4', 0.25], ['D4', 0.55], ['C4', 0.55], ['G4', 0.55], ['F4', 0.95],
  ['C4', 0.35], ['C4', 0.25], ['C5', 0.55], ['A4', 0.55], ['F4', 0.55], ['E4', 0.55], ['D4', 0.85],
  ['Bb4', 0.35], ['Bb4', 0.25], ['A4', 0.55], ['F4', 0.55], ['G4', 0.55], ['F4', 1.1]
];

function playFullMelody() {
  const ctx = getAudioContext();
  if (!ctx) return;

  let currentMelodyTime = ctx.currentTime + 0.1;
  BIRTHDAY_SONG.forEach(([noteName, duration]) => {
    playBirthdayNote(NOTES[noteName], duration, currentMelodyTime);
    currentMelodyTime += duration + 0.06;
  });

  // Calculate total song duration to repeat loop if enabled
  const totalDurationMs = (currentMelodyTime - ctx.currentTime) * 1000 + 800;
  musicInterval = setTimeout(() => {
    if (isMusicPlaying) {
      playFullMelody();
    }
  }, totalDurationMs);
}

function initAudioSystem() {
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');

  if (!musicBtn) return;

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    getAudioContext();

    if (!isMusicPlaying) {
      isMusicPlaying = true;
      musicBtn.classList.add('playing');
      musicIcon.textContent = '⏸';
      musicText.textContent = 'Pause Melody';
      playFullMelody();
      fireConfettiShower(35);
    } else {
      isMusicPlaying = false;
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicText.textContent = 'Play Melody';
      if (musicInterval) clearTimeout(musicInterval);
      if (audioCtx) {
        audioCtx.close().then(() => {
          audioCtx = null;
        });
      }
    }
  });
}

/* ==========================================================================
   7. Ambient Screen Taps (Floating Hearts & Sparkles)
   ========================================================================== */
function createFloatingEmoji(x, y, emoji) {
  const el = document.createElement('div');
  el.className = 'floating-bubble';
  el.textContent = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);

  setTimeout(() => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 1600);
}

function initTapEffects() {
  const TAP_EMOJIS = ['🎈', '✨', '🎂', '💛', '🦄', '🎉', '🌟', '🥳'];
  
  window.addEventListener('click', (e) => {
    // Only spawn if not clicking an interactive button/link
    if (e.target.closest('button, a, input, dialog, .flip-card')) return;

    const randomEmoji = TAP_EMOJIS[Math.floor(Math.random() * TAP_EMOJIS.length)];
    createFloatingEmoji(e.clientX, e.clientY, randomEmoji);
  });
}
