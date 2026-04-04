// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 500);
  });

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        trigger.parentElement.classList.toggle('open');
      }
    });
  });

  // ===== BACK TO TOP =====
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SCROLL ANIMATIONS =====
  const animateElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(el => observer.observe(el));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = new Set();

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== FORM HANDLING =====
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#059669';
        btn.style.borderColor = '#059669';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ===== SERVICES WHEEL =====
  (function initServicesWheel() {
    const svg   = document.getElementById('servicesSVG');
    const stage = document.getElementById('wheelStage');
    if (!svg || !stage) return;

    const NS = 'http://www.w3.org/2000/svg';
    const cx = 300, cy = 300, outerR = 275, innerR = 148, gap = 2.8;
    const n = 7, segAngle = 360 / n;

    const services = [
      { num: '01', title: 'Eligibility &\nBenefits\nVerification',   desc: 'Real-time verification & prior authorization management',   color: '#0f172a' },
      { num: '02', title: 'Medical Coding\n& Documentation',         desc: 'Certified ICD-10 & CPT coding with compliance audits',     color: '#1e1b4b' },
      { num: '03', title: 'Clean Claim\nSubmission',                 desc: 'Electronic filing via top-tier clearinghouses',            color: '#312e81' },
      { num: '04', title: 'Electronic\nPayment Posting',             desc: 'Tracking ERAs, EOBs & manual checks with reconciliation',  color: '#6d28d9' },
      { num: '05', title: 'AR & Denial\nManagement',                 desc: 'Root-cause analysis & follow-up on all aging claims',      color: '#5b21b6' },
      { num: '06', title: 'Provider\nCredentialing',                 desc: 'CAQH updates & payer enrollments fully managed',           color: '#3b0764' },
      { num: '07', title: 'Patient Billing\n& Support',              desc: 'Clear statements & dedicated helpdesk support',            color: '#2d1b69' },
    ];

    function toRad(d) { return d * Math.PI / 180; }

    function arcPath(startDeg, endDeg) {
      const s = toRad(startDeg), e = toRad(endDeg);
      const x1 = cx + outerR * Math.cos(s), y1 = cy + outerR * Math.sin(s);
      const x2 = cx + outerR * Math.cos(e), y2 = cy + outerR * Math.sin(e);
      const x3 = cx + innerR * Math.cos(e), y3 = cy + innerR * Math.sin(e);
      const x4 = cx + innerR * Math.cos(s), y4 = cy + innerR * Math.sin(s);
      const la = (endDeg - startDeg) > 180 ? 1 : 0;
      return `M${x1},${y1} A${outerR},${outerR},0,${la},1,${x2},${y2} L${x3},${y3} A${innerR},${innerR},0,${la},0,${x4},${y4} Z`;
    }

    // Defs: shine radial gradient overlay
    const defs = document.createElementNS(NS, 'defs');
    const grad = document.createElementNS(NS, 'radialGradient');
    grad.setAttribute('id', 'wheelShine');
    grad.setAttribute('cx', '50%'); grad.setAttribute('cy', '28%'); grad.setAttribute('r', '58%');
    [['0%', '0.14'], ['100%', '0']].forEach(([offset, opacity]) => {
      const stop = document.createElementNS(NS, 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', 'white');
      stop.setAttribute('stop-opacity', opacity);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Draw segments + labels
    services.forEach((svc, i) => {
      const start   = -90 + i * segAngle + gap / 2;
      const end     = -90 + (i + 1) * segAngle - gap / 2;
      const midAngle = (start + end) / 2;

      // Arc segment
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', arcPath(start, end));
      path.setAttribute('fill', svc.color);
      path.setAttribute('class', 'seg-path');
      svg.appendChild(path);

      // Label position at midpoint radius
      const midR   = (outerR + innerR) / 2;
      const midRad = toRad(midAngle);
      const lx = cx + midR * Math.cos(midRad);
      const ly = cy + midR * Math.sin(midRad);

      const label = document.createElement('div');
      label.className = 'seg-label';
      label.style.left = (lx / 600 * 100) + '%';
      label.style.top  = (ly / 600 * 100) + '%';
      label.innerHTML  =
        `<span class="seg-num">${svc.num}</span>` +
        `<span class="seg-title">${svc.title.split('\n').join('<br>')}</span>` +
        `<span class="seg-desc">${svc.desc}</span>`;
      stage.appendChild(label);
    });

    // Shine overlay circle
    const shine = document.createElementNS(NS, 'circle');
    shine.setAttribute('cx', cx); shine.setAttribute('cy', cy);
    shine.setAttribute('r', outerR);
    shine.setAttribute('fill', 'url(#wheelShine)');
    shine.setAttribute('pointer-events', 'none');
    svg.appendChild(shine);

    // Inner white hub circle (SVG layer — hidden behind HTML overlay)
    const hub = document.createElementNS(NS, 'circle');
    hub.setAttribute('cx', cx); hub.setAttribute('cy', cy);
    hub.setAttribute('r', innerR - 5);
    hub.setAttribute('fill', 'white');
    hub.setAttribute('pointer-events', 'none');
    svg.appendChild(hub);
  })();

  // ===== NAVBAR ACTIVE LINK =====
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--primary)';
        } else {
          link.style.color = '';
        }
      }
    });
  });

});
