document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Navigation & Scroll Progress Indicator
  // ==========================================
  const header = document.querySelector('.header');
  const scrollBar = document.getElementById('scroll-bar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  let lastScrollY = window.scrollY;

  // Track page scroll percentage & section activation
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrollPct = (window.scrollY / totalHeight) * 100;
      document.documentElement.style.setProperty('--scroll-pct', `${scrollPct}%`);
    }

    // Sticky Navbar Hide/Show on Scroll
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;

    // Active Link Highlighting
    let currentActive = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.clientHeight;
      if (window.scrollY >= secTop - 120) {
        currentActive = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });


  // ==========================================
  // 2. Custom Cursor & Spotlights
  // ==========================================
  const cursor = document.getElementById('custom-cursor');
  const glassCards = document.querySelectorAll('.glass-card');

  // Track global cursor for background halo
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Card-specific Spotlight Glow
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // ==========================================
  // 3. High Performance Canvas Particle Network
  // ==========================================
  const canvas = document.getElementById('canvas-particles');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let mouse = { x: null, y: null, radius: 150 };

  // Track mouse position on canvas
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Responsive Canvas Sizing
  function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    initParticles();
  }

  // Particle Constructor
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off boundaries
      if (this.x > window.innerWidth || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > window.innerHeight || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;

      // Mouse interactive collision / attraction (subtle)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          // Push away slightly
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 1.5;
          this.y -= forceDirectionY * force * 1.5;
        }
      }

      this.draw();
    }
  }

  // Populate particles array
  function initParticles() {
    particlesArray = [];
    // Adjust density based on screen width
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 70);
    const colors = ['rgba(59, 130, 246, 0.25)', 'rgba(6, 182, 212, 0.25)', 'rgba(255, 255, 255, 0.08)'];

    for (let i = 0; i < particleCount; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (window.innerWidth - size * 2) + size;
      let y = Math.random() * (window.innerHeight - size * 2) + size;
      let directionX = (Math.random() - 0.5) * 0.4;
      let directionY = (Math.random() - 0.5) * 0.4;
      let color = colors[Math.floor(Math.random() * colors.length)];
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Connect particles with lines
  function connect() {
    let opacityVal = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          opacityVal = 1 - (distance / 110);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacityVal * 0.07})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Render Loop
  let animationFrameId;
  function animateParticles() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateParticles();


  // ==========================================
  // 4. Subtle Code Typing Animation
  // ==========================================
  const textVal = "Building software that solves real problems.";
  const typingBlock = document.getElementById('typing-block');
  let charIndex = 0;

  function typeText() {
    if (charIndex < textVal.length) {
      typingBlock.textContent += textVal.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 60);
    }
  }
  
  // Start typing after a short delay
  setTimeout(typeText, 1000);


  // ==========================================
  // 5. Intersection Observer Scroll Reveal
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });


  // ==========================================
  // 6. Command Palette (Ctrl+K)
  // ==========================================
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdTrigger = document.getElementById('cmd-trigger');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  let selectedIndex = 0;

  // Available commands database
  const commands = [
    { title: 'Navigate: Home', type: 'nav', path: '#home', shortcut: 'G H' },
    { title: 'Navigate: About', type: 'nav', path: '#about', shortcut: 'G A' },
    { title: 'Navigate: Skills', type: 'nav', path: '#skills', shortcut: 'G S' },
    { title: 'Navigate: Projects', type: 'nav', path: '#projects', shortcut: 'G P' },
    { title: 'Navigate: Experience', type: 'nav', path: '#experience', shortcut: 'G E' },
    { title: 'Navigate: Certifications', type: 'nav', path: '#certifications', shortcut: 'G C' },
    { title: 'Navigate: Contact', type: 'nav', path: '#contact', shortcut: 'G L' },
    { title: 'Action: Download Resume', type: 'action', action: 'download-resume', shortcut: '⌘ D' },
    { title: 'Action: Email Harsh', type: 'action', action: 'send-email', shortcut: '⌘ M' },
    { title: 'Open: GitHub Profile', type: 'link', path: 'https://github.com/h-rathore', shortcut: '↗ G' },
    { title: 'Open: LinkedIn Profile', type: 'link', path: 'https://www.linkedin.com/in/harshrathore-', shortcut: '↗ L' }
  ];

  function toggleCommandPalette(forceOpen = null) {
    const isOpen = forceOpen !== null ? forceOpen : !cmdOverlay.classList.contains('active');
    
    if (isOpen) {
      cmdOverlay.classList.add('active');
      cmdInput.value = '';
      renderCommands(commands);
      setTimeout(() => cmdInput.focus(), 50);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      cmdOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Release scroll
    }
  }

  // Filter & Display Commands
  function renderCommands(filtered) {
    cmdResults.innerHTML = '';
    selectedIndex = 0;

    if (filtered.length === 0) {
      cmdResults.innerHTML = `<li class="cmd-item" style="pointer-events: none; justify-content: center; color: var(--text-dark);">No matching commands found.</li>`;
      return;
    }

    filtered.forEach((cmd, idx) => {
      const li = document.createElement('li');
      li.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
      li.dataset.index = idx;
      
      let iconSvg = '';
      if (cmd.type === 'nav') {
        iconSvg = `<svg class="cmd-item-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>`;
      } else if (cmd.type === 'action') {
        iconSvg = `<svg class="cmd-item-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
      } else {
        iconSvg = `<svg class="cmd-item-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>`;
      }

      li.innerHTML = `
        <div class="cmd-item-left">
          ${iconSvg}
          <span class="cmd-item-title">${cmd.title}</span>
        </div>
        <span class="cmd-shortcut">${cmd.shortcut}</span>
      `;

      li.addEventListener('click', () => {
        executeCommand(cmd);
      });

      cmdResults.appendChild(li);
    });
  }

  function executeCommand(cmd) {
    toggleCommandPalette(false);
    
    if (cmd.type === 'nav') {
      const element = document.querySelector(cmd.path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cmd.type === 'link') {
      window.open(cmd.path, '_blank', 'noopener,noreferrer');
    } else if (cmd.type === 'action') {
      if (cmd.action === 'download-resume') {
        const dBtn = document.getElementById('resume-download-btn');
        if (dBtn) dBtn.click();
      } else if (cmd.action === 'send-email') {
        window.location.href = 'mailto:h.rathore2122@gmail.com';
      }
    }
  }

  // Key Event Hooks for Command Palette
  cmdInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = commands.filter(c => c.title.toLowerCase().includes(query));
    renderCommands(filtered);
  });

  cmdInput.addEventListener('keydown', (e) => {
    const items = cmdResults.querySelectorAll('.cmd-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[selectedIndex].classList.remove('selected');
      selectedIndex = (selectedIndex + 1) % items.length;
      items[selectedIndex].classList.add('selected');
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[selectedIndex].classList.remove('selected');
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      items[selectedIndex].classList.add('selected');
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const query = cmdInput.value.toLowerCase().trim();
      const filtered = commands.filter(c => c.title.toLowerCase().includes(query));
      if (filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
    }
  });

  // Hotkey Triggers: Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleCommandPalette();
    }
    
    if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
      toggleCommandPalette(false);
    }
  });

  // Modal backdrop clicks
  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) {
      toggleCommandPalette(false);
    }
  });

  cmdTrigger.addEventListener('click', () => {
    toggleCommandPalette(true);
  });


  // ==========================================
  // 7. Contact Form Simulation & Response UI
  // ==========================================
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animate button state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying payload...';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.textContent = 'Transmitting email...';
      
      setTimeout(() => {
        // Success feedback
        submitBtn.textContent = 'Message Transmitted Successfully ✓';
        submitBtn.style.background = '#10b981';
        submitBtn.style.borderColor = '#10b981';
        submitBtn.style.color = '#ffffff';
        submitBtn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';

        formStatus.textContent = '> Connection established. Message successfully pushed to h.rathore2122@gmail.com.';
        formStatus.className = 'form-status success';
        
        // Reset fields
        form.reset();

        // Cool restoration cycle
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
          submitBtn.style.boxShadow = '';
          formStatus.style.display = 'none';
        }, 6000);

      }, 1200);
    }, 1000);
  });

  // ==========================================
  // 8. Interactive Terminal Console simulation
  // ==========================================
  const termInput = document.getElementById('term-input');
  const termHistory = document.getElementById('term-history');

  if (termInput && termHistory) {
    const codeBox = document.querySelector('.code-box');
    if (codeBox) {
      codeBox.addEventListener('click', () => {
        termInput.focus();
      });
    }

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = termInput.value.trim();
        const cmd = query.toLowerCase();
        
        // Append user prompt input to history
        const inputLine = document.createElement('div');
        inputLine.className = 'code-line';
        inputLine.innerHTML = `<span class="terminal-input-prompt">guest@harsh:~$</span> ${query}`;
        termHistory.appendChild(inputLine);
        
        // Output holder
        const outputLine = document.createElement('div');
        outputLine.className = 'code-line';
        
        switch (cmd) {
          case 'help':
            outputLine.innerHTML = `Available commands: <span class="code-keyword">about</span>, <span class="code-keyword">skills</span>, <span class="code-keyword">projects</span>, <span class="code-keyword">contact</span>, <span class="code-keyword">resume</span>, <span class="code-keyword">clear</span>`;
            break;
          case 'about':
            outputLine.innerHTML = `I build full-stack web applications and explore AI/ML to solve practical problems through scalable and user-focused solutions. Passionate about software development, problem solving, and creating impactful digital experiences.`;
            break;
          case 'skills':
            outputLine.innerHTML = `
              <strong>Programming:</strong> Python, Java, JavaScript<br>
              <strong>Web Dev:</strong> HTML, CSS, React.js, Node.js, Express.js<br>
              <strong>Databases:</strong> MongoDB, MySQL<br>
              <strong>AI/ML:</strong> Machine Learning, TensorFlow, Data Preprocessing, Data Analysis, Model Training, Data Visualization<br>
              <strong>Tools:</strong> Git, GitHub, Visual Studio Code
            `;
            break;
          case 'projects':
            outputLine.innerHTML = `
              1. <strong>HostelHub</strong> – Hostel Management Platform (React.js, Node.js, Express.js, MongoDB)<br>
              2. <strong>Pandemic Resource Allocation System</strong> – Healthcare dashboard (React.js, Node.js, Express.js, MongoDB) - Role: Team Leader
            `;
            break;
          case 'contact':
            outputLine.innerHTML = `
              Direct Call: <a href="tel:+919310305399" class="accent-text">+91 9310305399</a><br>
              Direct Email: <a href="mailto:h.rathore2122@gmail.com" class="accent-text">h.rathore2122@gmail.com</a><br>
              GitHub: <a href="https://github.com/h-rathore" target="_blank" rel="noopener noreferrer" class="accent-text">github.com/h-rathore</a><br>
              LinkedIn: <a href="https://www.linkedin.com/in/harshrathore-" target="_blank" rel="noopener noreferrer" class="accent-text">linkedin.com/in/harshrathore-</a>
            `;
            break;
          case 'resume':
            outputLine.innerHTML = `Downloading resume...`;
            const dBtn = document.getElementById('resume-download-btn');
            if (dBtn) dBtn.click();
            break;
          case 'clear':
            termHistory.innerHTML = '';
            outputLine.innerHTML = `Console cleared. Type 'help' to fetch core variables.`;
            break;
          case '':
            // Do nothing on empty enter
            outputLine.innerHTML = '';
            break;
          default:
            outputLine.innerHTML = `Command not found: <span style="color:#ef4444;">${query}</span>. Type <span class="code-class">'help'</span> for a list of commands.`;
        }
        
        if (outputLine.innerHTML !== '') {
          termHistory.appendChild(outputLine);
        }
        
        termInput.value = '';
        termHistory.scrollTop = termHistory.scrollHeight;
      }
    });
  }

});

