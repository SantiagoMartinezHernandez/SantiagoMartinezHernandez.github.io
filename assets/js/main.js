/**
 * ANDRÉS SANTIAGO MARTÍNEZ HERNÁNDEZ - 2026 MULTI-PAGE PORTFOLIO
 * Main Interactive Application Script: Theme Switcher, Neural Canvas, Terminal, Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNeuralCanvas();
  initNavbar();
  initTerminal();
  initCommandPalette();
  initProjectModals();
});

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeSwitcher() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeToggleIcons(currentTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeToggleIcons(newTheme);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
  });
}

function updateThemeToggleIcons(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    btn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  });
}

/* ==========================================================================
   2. LIVING GENERATIVE NEURAL / BIO CANVAS (THEME AWARE)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuro-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 160 };

  function getThemePalette() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      colors: isLight 
        ? ['#0284c7', '#059669', '#7c3aed'] 
        : ['#06b6d4', '#10b981', '#8b5cf6'],
      lineRgb: isLight ? '2, 132, 199' : '6, 182, 212',
      lineAlpha: isLight ? 0.22 : 0.25
    };
  }

  let palette = getThemePalette();

  window.addEventListener('themeChanged', () => {
    palette = getThemePalette();
    particles.forEach(p => {
      p.color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    });
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 6;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * this.density;
          const directionY = (dy / distance) * force * this.density;
          this.x -= directionX * 0.45;
          this.y -= directionY * 0.45;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 115) {
          let opacity = (1 - distance / 115) * palette.lineAlpha;
          ctx.strokeStyle = `rgba(${palette.lineRgb}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   3. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  mobileToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('show');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('show');
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE "ASK SANTIAGO" AI TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const presetChips = document.querySelectorAll('.term-chip');

  if (!terminalInput || !terminalOutput) return;

  const COMMAND_RESPONSES = {
    'help': `Available commands:
• <span style="color: var(--accent-cyan);">artwear</span>: Deep-dive into ART/Wear ($100K+ raised, patents, VivaTech)
• <span style="color: var(--accent-cyan);">hq</span> / <span style="color: var(--accent-cyan);">switzerland</span>: Current base in Fribourg, Switzerland 🇨🇭
• <span style="color: var(--accent-cyan);">robotics</span>: 3D modeling, robotic arm SFM/RL, Robocol
• <span style="color: var(--accent-cyan);">health</span>: Biomedical wearables, IMU signal analysis, osteosarcoma ViT
• <span style="color: var(--accent-cyan);">neuro</span>: Digital Neuroscience at Fribourg & Barrow Neurological
• <span style="color: var(--accent-cyan);">awards</span>: Global honors (WTW 2026, Startup Chile, GSEA, MPIIB)
• <span style="color: var(--accent-cyan);">cv</span>: Academic record, GPA, skills & PDF download link
• <span style="color: var(--accent-cyan);">contact</span>: Swiss email, LinkedIn, WhatsApp & Discord
• <span style="color: var(--accent-cyan);">clear</span>: Clear terminal window`,

    'artwear': `<span style="color: var(--accent-violet-light); font-weight: bold;">[ART/Wear — CEO & Co-founder]</span>
Closed-loop smart garment counteracting hand tremors in Parkinson's and Essential Tremor.
• Raised $100K+ in competitive grants.
• Pitched at VivaTech Paris to leading European angel syndicates.
• Granted patents & industrial designs for afferent nerve stimulation.
<a href="artwear.html" style="color: var(--accent-cyan); text-decoration: underline;">👉 Open Dedicated Flagship Page</a>`,

    'hq': `<span style="color: var(--accent-emerald-light); font-weight: bold;">[Current Base & HQ — Fribourg, Switzerland 🇨🇭]</span>
Currently enrolled in the Specialized Master's in Digital Neuroscience at the University of Fribourg.
Timezone: CET (UTC+1 / UTC+2).
Academic email: <a href="mailto:andres.martinezhernandez@unifr.ch" style="color: var(--accent-cyan);">andres.martinezhernandez@unifr.ch</a>`,

    'switzerland': `<span style="color: var(--accent-emerald-light); font-weight: bold;">[University of Fribourg, Switzerland]</span>
Pursuing Specialized Master's in Digital Neuroscience (2026–Present).
Upcoming Seminar: "The Unfair Advantage: Practical AI Automation" at Fribourg Teach & Learn Days.`,

    'robotics': `[Robotics & 3D Modeling Wing]
• Structure from Motion (SfM) + Reinforcement Learning for 6-DOF Robotic Arms.
• Autonomous navigation CV for Robocol (Drone, Rover, Submarine).
• Mechatronic prototyping, SDM manufacturing, Fusion 360, ROS-2.
<a href="robotics.html" style="color: var(--accent-cyan); text-decoration: underline;">👉 View Robotics Wing Page</a>`,

    'health': `[Health & Biomedical Wing]
• ART/Wear: Closed-loop orthotic tremor suppression smart garment.
• "On the Way to School": Epidemiological GPS/IMU signal analysis (UniAndes Faculty of Medicine).
• RXAI: Osteosarcoma detection from radiographs using Vision Transformers & CNNs.
<a href="health.html" style="color: var(--accent-cyan); text-decoration: underline;">👉 View Health & Biomedical Wing Page</a>`,

    'neuro': `[Neuroscience & AI Wing]
• Digital Neuroscience research at Univ. of Fribourg & Barrow Neurological Institute.
• Neuromatch Impact Scholars: 16-channel sEMG 3D hand-pose estimation.
• Solar Radiance forecasting with GNNs & LSTMs.
• Automated Thematic Clustering (ATC) for Dengue outbreaks at BIOMAC UniAndes.
<a href="neuroscience.html" style="color: var(--accent-cyan); text-decoration: underline;">👉 View Neuroscience & AI Wing Page</a>`,

    'awards': `[Selected Honors & International Grants]
• Innovation Grant — Innovation Club Fribourg 🇨🇭 (2026)
• New Talents Research Award — WTW Insurance (2026 • 6K award)
• Startup Chile Innovation Grant — CORFO & Chilean Government 🇨🇱 (2025)
• GSEA Entrepreneur of the Year (Colombia) — Global Student Entrepreneurship Awards 🏆 (2024)
• First Place in Innovation — French Prix Bogotá 🇫🇷 (2024)
• MPIIB International Fellow & Scholarship — Max Planck Berlin 🇩🇪 (2024)`,

    'cv': `[Academic Credentials & PDF Download]
• Master's in Digital Neuroscience (Univ. of Fribourg, Switzerland, 2026–Present)
• B.S. Computational & Software Engineering (Univ. de los Andes, GPA 4.05/5.0)
• B.S. Biomedical Engineering, Minor in Neuroscience (Univ. de los Andes, GPA 4.1/5.0)
• Languages: Spanish (Native), English (C2 Certified), Italian (Basic).
<a href="assets/pdf/CV_2026.pdf" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">👉 Click to download CV_2026.pdf</a>`,

    'contact': `[Direct Contact — Fribourg, Switzerland]
• Academic Email: <a href="mailto:andres.martinezhernandez@unifr.ch" style="color: var(--accent-cyan);">andres.martinezhernandez@unifr.ch</a>
• Personal Email: <a href="mailto:santiago21.01.2001@gmail.com" style="color: var(--accent-cyan);">santiago21.01.2001@gmail.com</a>
• LinkedIn: <a href="https://linkedin.com/in/andrés-santiago-martínez-hernández-96a48a222" target="_blank" style="color: var(--accent-cyan);">linkedin.com/in/andrés-santiago-martínez-hernández-96a48a222</a>
• WhatsApp: +57 319 646 4066
• Discord: SantiagoM #6840`,

    'clear': '__CLEAR__'
  };

  function processCommand(cmd) {
    const raw = cmd.trim().toLowerCase();
    if (!raw) return;

    const userLine = document.createElement('div');
    userLine.innerHTML = `<span style="color: var(--accent-cyan); font-weight: 700;">santiago@neuro-ai:~$</span> ${cmd}`;
    terminalOutput.appendChild(userLine);

    if (raw === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    const response = document.createElement('div');
    response.style.color = 'var(--text-secondary)';
    response.style.margin = '0.35rem 0 0.85rem 0';

    if (COMMAND_RESPONSES[raw]) {
      response.innerHTML = COMMAND_RESPONSES[raw];
    } else {
      if (raw.includes('switzerland') || raw.includes('fribourg') || raw.includes('location') || raw.includes('live')) {
        response.innerHTML = COMMAND_RESPONSES['hq'];
      } else if (raw.includes('tremor') || raw.includes('parkinson') || raw.includes('garment') || raw.includes('startup')) {
        response.innerHTML = COMMAND_RESPONSES['artwear'];
      } else if (raw.includes('grant') || raw.includes('prize') || raw.includes('award') || raw.includes('win')) {
        response.innerHTML = COMMAND_RESPONSES['awards'];
      } else if (raw.includes('email') || raw.includes('phone') || raw.includes('reach') || raw.includes('message')) {
        response.innerHTML = COMMAND_RESPONSES['contact'];
      } else {
        response.innerHTML = `Command not recognized: "${cmd}". Type <span style="color: var(--accent-cyan);">help</span> to view all query commands.`;
      }
    }

    terminalOutput.appendChild(response);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      processCommand(terminalInput.value);
      terminalInput.value = '';
    }
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) processCommand(cmd);
    });
  });
}

/* ==========================================================================
   5. COMMAND PALETTE (CMD+K / CTRL+K)
   ========================================================================== */
function initCommandPalette() {
  const palette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');
  const triggerBtns = document.querySelectorAll('.btn-cmd');

  const ACTIONS = [
    { title: '⭐ ART/Wear Flagship Deep-Dive', category: 'Flagship', action: () => window.location.href = 'artwear.html' },
    { title: '🤖 Robotics & 3D Modeling Wing', category: 'Wing Portal', action: () => window.location.href = 'robotics.html' },
    { title: '🩺 Health & Biomedical Wing', category: 'Wing Portal', action: () => window.location.href = 'health.html' },
    { title: '🧠 Neuroscience & AI Wing', category: 'Wing Portal', action: () => window.location.href = 'neuroscience.html' },
    { title: '🎮 Fun, Games & 3D Lab', category: 'Interactive', action: () => window.location.href = 'labs.html' },
    { title: '🏛️ Career Journey & Academic Timeline', category: 'About', action: () => window.location.href = 'journey.html' },
    { title: '📄 Download CV 2026 (PDF)', category: 'Documents', action: () => window.open('assets/pdf/CV_2026.pdf', '_blank') },
    { title: 'Connect on LinkedIn', category: 'Social', action: () => window.open('https://linkedin.com/in/andrés-santiago-martínez-hernández-96a48a222', '_blank') },
    { title: 'View GitHub Profile', category: 'Social', action: () => window.open('https://github.com/SantiagoMartinezHernandez', '_blank') },
    { title: 'Send Email to Fribourg HQ', category: 'Contact', action: () => window.location.href = 'mailto:andres.martinezhernandez@unifr.ch' }
  ];

  function openPalette() {
    palette?.classList.add('active');
    cmdInput?.focus();
    renderResults(ACTIONS);
  }

  function closePalette() {
    palette?.classList.remove('active');
    if (cmdInput) cmdInput.value = '';
  }

  function renderResults(items) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';
    if (items.length === 0) {
      resultsContainer.innerHTML = `<li style="padding: 1rem; color: var(--text-muted); text-align: center;">No matching actions found</li>`;
      return;
    }

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = `cmd-item ${index === 0 ? 'selected' : ''}`;
      li.innerHTML = `
        <span>${item.title}</span>
        <span class="tech-tag" style="font-size: 0.72rem;">${item.category}</span>
      `;
      li.addEventListener('click', () => {
        closePalette();
        item.action();
      });
      resultsContainer.appendChild(li);
    });
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', openPalette));

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette?.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && palette?.classList.contains('active')) {
      closePalette();
    }
  });

  cmdInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = ACTIONS.filter(a => a.title.toLowerCase().includes(query) || a.category.toLowerCase().includes(query));
    renderResults(filtered);
  });

  palette?.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });
}

/* ==========================================================================
   6. MODALS
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal?.querySelector('.modal-close-btn');
  closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}
