/* =========================================================
   script.js — Vansh Garg Portfolio
   Handles: Loader · Navbar · Typing · 3D Interactive Orbit ·
            Scroll Reveal · Ripple · Canvas Particles ·
            Active Nav · Hamburger
   ========================================================= */

/* =========================================================
   1. PAGE LOADER
   ========================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the loader at least 800ms so the animation is visible
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 900);
});

/* =========================================================
   2. NAVBAR — scroll shadow + hamburger
   ========================================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');
const mobLinks  = document.querySelectorAll('.mob-link');

// Add shadow on scroll
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 40
    ? '0 4px 30px rgba(0,0,0,0.4)'
    : 'none';
});

// Toggle mobile drawer
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close drawer when a link is clicked
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* =========================================================
   3. TYPING ANIMATION
   ========================================================= */
const typedEl = document.getElementById('typed-text');
const words   = [
  'Frontend Developer',
  'Graphic Designer',
  'Prompt Engineer',
  'JavaScript Developer',
  'Creative Coder',
  'DSA Learner & Problem Solver',
];

let wordIdx   = 0;
let charIdx   = 0;
let isDeleting = false;
let typingSpeed = 90;

function type() {
  const current = words[wordIdx];

  if (isDeleting) {
    // Remove a character
    typedEl.textContent = current.slice(0, --charIdx);
    typingSpeed = 50;
  } else {
    // Add a character
    typedEl.textContent = current.slice(0, ++charIdx);
    typingSpeed = 90;
  }

  if (!isDeleting && charIdx === current.length) {
    // Full word shown — pause then delete
    typingSpeed = 1600;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    // Word deleted — next word
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typingSpeed = 400;
  }

  setTimeout(type, typingSpeed);
}
type();

/* =========================================================
   4. HERO CANVAS — floating particles
   ========================================================= */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create particles
  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      // Alternating neon colours
      color: Math.random() > 0.5 ? '56,189,248' : '167,139,250',
    };
  }

  for (let i = 0; i < 120; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* =========================================================
   5. 3D INTERACTIVE PLANETARY SKILLS ORBIT SYSTEM
   ========================================================= */
(function init3DOrbit() {
  // -------------------------------------------------------
  // PROFILE IMAGE PATH (Easy to customize or replace)
  // -------------------------------------------------------
  const PROFILE_IMAGE = "PROFILE IMAGE.png";

  // Skill definitions preserving all 11 skills with custom 3D planetary themes & height offsets
  const skills = [
    { name: 'C++',               icon: '⚙️', class: 'sphere-cpp',       yOffset:  12 },
    { name: 'Prompt Eng.',       icon: '🤖', class: 'sphere-prompt',    yOffset: -10 },
    { name: 'Java',              icon: '☕', class: 'sphere-java',      yOffset:  16 },
    { name: 'JavaScript',        icon: '🟨', class: 'sphere-js',        yOffset:  -8 },
    { name: 'HTML',              icon: '🌐', class: 'sphere-html',      yOffset:  14 },
    { name: 'CSS',               icon: '🎨', class: 'sphere-css',       yOffset: -15 },
    { name: 'Tailwind',          icon: '💨', class: 'sphere-tailwind',  yOffset:  10 },
    { name: 'Bootstrap',         icon: '🅱️', class: 'sphere-bootstrap', yOffset: -12 },
    { name: 'Angular',           icon: '🔺', class: 'sphere-angular',   yOffset:  15 },
    { name: 'React',             icon: '⚛️', class: 'sphere-react',     yOffset:  -6 },
    { name: 'Node.js',           icon: '🟢', class: 'sphere-node',      yOffset:  11 },
  ];

  const system        = document.getElementById('orbitSystem');
  const svgPath       = document.getElementById('orbitPathLine');
  const profileImg    = document.getElementById('profileImage');

  // Set profile photo src with graceful fallback handling
  if (profileImg) {
    profileImg.src = PROFILE_IMAGE;
    profileImg.onerror = function () {
      const parent = profileImg.parentElement;
      profileImg.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.className = 'profile-fallback-text';
      fallback.textContent = 'VG';
      parent.appendChild(fallback);
    };
  }

  // 3D Orbital Physics State
  let rotY = 0;              // Current horizontal orbital rotation angle (yaw)
  let rotX = 1.15;           // Perspective pitch tilt angle (~66 degrees in radians)
  let tiltZ = -0.22;         // Fixed orbital roll tilt (~ -12.5 degrees in radians)
  
  let autoSpeed = 0.0035;    // Continuous auto-rotation speed (radians/frame)
  
  // Dragging & inertia state
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let velX = 0;
  let velY = 0;

  // Hover state tracking
  let hoveredSkillIndex = -1;

  // Create Skill Globe Elements once inside DOM
  const globeEls = skills.map((skill, index) => {
    const globe = document.createElement('div');
    globe.className = 'skill-globe-3d';
    globe.setAttribute('data-skill', skill.name);

    globe.innerHTML = `
      <div class="skill-label-floating">
        <span class="skill-name">${skill.name}</span>
      </div>
      <div class="sphere-body ${skill.class}">
        <div class="sphere-shine"></div>
        <span class="sphere-icon">${skill.icon}</span>
        <div class="sphere-shadow"></div>
      </div>
    `;

    globe.addEventListener('mouseenter', () => { hoveredSkillIndex = index; });
    globe.addEventListener('mouseleave', () => { hoveredSkillIndex = -1; });

    system.appendChild(globe);
    return globe;
  });

  // Projection math: Converts 3D orbit angle & radius into projected screen coordinates
  function project3D(theta, R, waveY, centerW, centerH) {
    const x0 = R * Math.cos(theta);
    const z0 = R * Math.sin(theta);
    const y0 = waveY;

    // Pitch rotation (around X axis)
    const x1 = x0;
    const y1 = y0 * Math.cos(rotX) - z0 * Math.sin(rotX);
    const z1 = y0 * Math.sin(rotX) + z0 * Math.cos(rotX);

    // Roll tilt (around Z axis)
    const X3D = x1 * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
    const Y3D = x1 * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);
    const Z3D = z1;

    // Perspective transformation formula
    const FOV = 650;
    const scale = FOV / (FOV - Z3D);
    const screenX = centerW + X3D * scale;
    const screenY = centerH + Y3D * scale;

    return { screenX, screenY, scale, Z3D };
  }

  // Draw continuous 3D projected orbital SVG path
  function updateOrbitalPath(R, centerW, centerH) {
    if (!svgPath) return;
    const steps = 96;
    let pathData = '';

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const svgCenter = 400;
      const svgR = (R / (system.offsetWidth / 2)) * 320;

      const x0 = svgR * Math.cos(theta + rotY);
      const z0 = svgR * Math.sin(theta + rotY);
      const y0 = 0;

      const x1 = x0;
      const y1 = y0 * Math.cos(rotX) - z0 * Math.sin(rotX);
      const z1 = y0 * Math.sin(rotX) + z0 * Math.cos(rotX);

      const X3D = x1 * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
      const Y3D = x1 * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);
      const Z3D = z1;

      const FOV = 650;
      const scale = FOV / (FOV - Z3D);
      const px = svgCenter + X3D * scale;
      const py = svgCenter + Y3D * scale;

      pathData += (i === 0 ? `M ${px.toFixed(2)},${py.toFixed(2)}` : ` L ${px.toFixed(2)},${py.toFixed(2)}`);
    }

    pathData += ' Z';
    svgPath.setAttribute('d', pathData);
  }

  // Main 3D Animation Loop
  function update3DPositions() {
    const W = system.offsetWidth;
    const H = system.offsetHeight;
    const centerW = W / 2;
    const centerH = H / 2;

    // Responsive orbital radius scaling
    const R = Math.min(W, H) * 0.40;

    // Apply rotation & drag momentum inertia
    if (!isDragging) {
      rotY += autoSpeed + velX;
      rotX += velY;

      // Friction decay
      velX *= 0.94;
      velY *= 0.94;
    }

    // Clamp pitch tilt rotX to preserve readable 3D perspective
    rotX = Math.max(0.7, Math.min(1.45, rotX));

    // Update continuous orbital ring SVG line
    updateOrbitalPath(R, centerW, centerH);

    // Update position and depth styling for every skill globe
    skills.forEach((skill, i) => {
      const globe = globeEls[i];
      const baseAngle = ((2 * Math.PI) / skills.length) * i;
      const theta = baseAngle + rotY;

      // Organic height wave offset along continuous trajectory
      const waveY = (skill.yOffset || 0) + 12 * Math.sin(2 * theta);

      const proj = project3D(theta, R, waveY, centerW, centerH);

      // Hover scale multiplier
      const isHovered = (hoveredSkillIndex === i);
      const hoverBoost = isHovered ? 1.3 : 1.0;
      const finalScale = proj.scale * hoverBoost;

      // Depth z-index sorting relative to profile picture (profile is at z-index 50)
      const zIndex = Math.round(100 + proj.Z3D);
      const opacity = proj.Z3D > -120 ? 1 : Math.max(0.45, 1 + proj.Z3D / 400);

      // Hardware-accelerated 3D transform update
      globe.style.transform = `translate3d(${proj.screenX}px, ${proj.screenY}px, 0px) translate(-50%, -50%) scale(${finalScale.toFixed(3)})`;
      globe.style.zIndex = zIndex;
      globe.style.opacity = opacity.toFixed(2);

      // Depth of field blur for far-away globes
      if (proj.Z3D < -100 && !isHovered) {
        globe.style.filter = `blur(${Math.min(2.5, (-proj.Z3D - 100) / 40).toFixed(1)}px)`;
      } else {
        globe.style.filter = 'none';
      }
    });

    requestAnimationFrame(update3DPositions);
  }

  requestAnimationFrame(update3DPositions);

  /* ── Interactive Pointer / Touch Drag Controls ── */
  function onPointerDown(clientX, clientY) {
    isDragging = true;
    lastMouseX = clientX;
    lastMouseY = clientY;
    velX = 0;
    velY = 0;
  }

  function onPointerMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - lastMouseX;
    const dy = clientY - lastMouseY;

    velX = dx * 0.005;
    velY = -dy * 0.003;

    rotY += velX;
    rotX += velY;

    lastMouseX = clientX;
    lastMouseY = clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  // Mouse Listeners
  system.addEventListener('mousedown', e => onPointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => onPointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onPointerUp);

  // Touch Listeners (Mobile & Tablet)
  system.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (isDragging && e.touches.length === 1) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchend', onPointerUp);

  /* ── Mouse Wheel Interaction ── */
  system.addEventListener('wheel', e => {
    e.preventDefault();
    velX += e.deltaY * 0.0008;
  }, { passive: false });

})();

/* =========================================================
   6. SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger siblings slightly for a cascade effect
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, i) => {
          el.style.transitionDelay = i * 80 + 'ms';
        });
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => observer.observe(el));

/* =========================================================
   7. RIPPLE EFFECT
   ========================================================= */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const ripple = document.createElement('span');
    ripple.classList.add('ripple-wave');
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x - size / 2}px; top: ${y - size / 2}px;
    `;
    this.appendChild(ripple);

    // Remove the element after animation completes
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* =========================================================
   8. SMOOTH ACTIVE NAV HIGHLIGHT on scroll
   ========================================================= */
const sections  = document.querySelectorAll('section[id]');
const navAnchors= document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => sectionObserver.observe(sec));

/* =========================================================
   9. FLOATING DECORATIVE ELEMENTS in hero (subtle)
   ========================================================= */
(function addFloaters() {
  const hero = document.getElementById('hero');
  const svgs = [
    `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
    `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
  ];

  const positions = [
    { top: '15%', left: '5%',  delay: '0s'   },
    { top: '70%', left: '3%',  delay: '1.5s' },
    { top: '20%', right: '5%', delay: '0.8s' },
  ];

  svgs.forEach((svg, i) => {
    const div = document.createElement('div');
    div.classList.add('float-icon');
    div.innerHTML = svg;
    Object.assign(div.style, positions[i]);
    div.style.animationDelay = positions[i].delay;
    hero.appendChild(div);
  });
})();
