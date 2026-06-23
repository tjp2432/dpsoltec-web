document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');

    // Mobile menu toggle
    function closeMenu() {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
    }
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('open');
    }

    // Hamburger button toggles menu on tap/click
    let menuTouched = false;
    menuToggle.addEventListener('touchstart', (e) => { e.preventDefault(); menuTouched = true; toggleMenu(); }, { passive: false });
    menuToggle.addEventListener('click', (e) => {
        if (menuTouched) { menuTouched = false; return; }
        toggleMenu();
    });

    // Tap outside header closes menu
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !e.target.closest('.top-header')) {
            closeMenu();
        }
    });

    // Nav links: stay open on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Active nav link on scroll (IntersectionObserver)
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-120px 0px -50% 0px' });
    sections.forEach(section => sectionObserver.observe(section));

    // Animated counters
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 60;
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });
    }

    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // Character counter for textarea
    const mensaje = document.getElementById('mensaje');
    const charCount = document.getElementById('charCount');
    const charCounter = document.querySelector('.char-counter');

    if (mensaje && charCount && charCounter) {
        mensaje.addEventListener('input', () => {
            const len = mensaje.value.length;
            charCount.textContent = len;
            charCounter.classList.toggle('full', len === 170);
        });
    }

    // Contact form
    function validateForm() {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        if (!nombre || !email || !mensaje) {
            showToast('Por favor completá los campos obligatorios.', 'error');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Por favor ingresá un email válido.', 'error');
            return false;
        }
        return true;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            fetch(contactForm.action, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams({
                    nombre: document.getElementById('nombre').value,
                    email: document.getElementById('email').value,
                    empresa: document.getElementById('empresa').value,
                    mensaje: document.getElementById('mensaje').value,
                    asunto: 'CONSULTA WEB DP SOLTEC'
                })
            });

            showToast('Mensaje enviado con éxito. Te contactaremos pronto.', 'success');
            contactForm.reset();
            const msg = document.querySelector('.char-count');
            if (msg) msg.textContent = '0';
        });
    }

    // Toast notification
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (type === 'error') {
            toast.classList.add('error');
        }
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // WhatsApp bubble close
    const waClose = document.querySelector('.wa-close');
    const waBubbleRow = document.querySelector('.wa-bubble-row');
    if (waClose && waBubbleRow) {
        waClose.addEventListener('click', () => {
            waBubbleRow.classList.add('closed');
        });
    }

    // Lightbox with navigation
    function openLightbox(images, index) {
        var o = document.createElement('div');
        o.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;';
        var bg = document.createElement('div');
        bg.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.85);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);';
        o.appendChild(bg);
        var x = document.createElement('span');
        x.style.cssText = 'position:fixed;top:20px;right:24px;z-index:10000;color:#fff;font-size:2.5rem;cursor:pointer;opacity:0.7;line-height:1;font-family:serif;';
        x.textContent = '\u00D7';
        o.appendChild(x);
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:4px;position:relative;z-index:1;';
        var prevBtn = document.createElement('span');
        prevBtn.textContent = '\u2039';
        prevBtn.style.cssText = 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:1.3rem;line-height:1;padding-bottom:1px;flex-shrink:0;background:rgba(255,200,50,0.12);border:1px solid rgba(255,200,50,0.25);color:#f5c542;box-shadow:inset 0 1px 1px rgba(255,255,255,0.2),0 0 10px rgba(255,200,50,0.12);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);transition:opacity 0.2s,transform 0.2s;';
        prevBtn.addEventListener('mouseenter', function(){this.style.opacity='1';this.style.transform='scale(1.05)';});
        prevBtn.addEventListener('mouseleave', function(){this.style.opacity='0.85';this.style.transform='scale(1)';});
        prevBtn.style.opacity = '0.85';
        row.appendChild(prevBtn);
        var img = document.createElement('img');
        img.style.cssText = 'max-width:92vw;max-height:92vh;width:auto;height:auto;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.6);display:block;';
        row.appendChild(img);
        var nextBtn = document.createElement('span');
        nextBtn.textContent = '\u203A';
        nextBtn.style.cssText = 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:1.3rem;line-height:1;padding-bottom:1px;flex-shrink:0;background:rgba(101,207,114,0.10);border:1px solid rgba(101,207,114,0.25);color:#65CF72;box-shadow:inset 0 1px 1px rgba(255,255,255,0.2),0 0 10px rgba(101,207,114,0.15);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);transition:opacity 0.2s,transform 0.2s;';
        nextBtn.addEventListener('mouseenter', function(){this.style.opacity='1';this.style.transform='scale(1.05)';});
        nextBtn.addEventListener('mouseleave', function(){this.style.opacity='0.85';this.style.transform='scale(1)';});
        nextBtn.style.opacity = '0.85';
        row.appendChild(nextBtn);
        o.appendChild(row);
        document.body.appendChild(o);

        function showImage(idx) {
            if (idx < 0) idx = images.length - 1;
            if (idx >= images.length) idx = 0;
            img.src = images[idx].src;
            img.alt = images[idx].alt;
            index = idx;
        }
        showImage(index);

        function close() { o.remove(); }
        x.addEventListener('click', close);
        bg.addEventListener('click', close);
        prevBtn.addEventListener('click', function(e) { e.stopPropagation(); showImage(index - 1); });
        nextBtn.addEventListener('click', function(e) { e.stopPropagation(); showImage(index + 1); });
        document.addEventListener('keydown', function handler(ev) {
            if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
            if (ev.key === 'ArrowLeft') { showImage(index - 1); }
            if (ev.key === 'ArrowRight') { showImage(index + 1); }
        });
    }

    document.querySelectorAll('.gallery-image-wrap').forEach(function(w) {
        w.addEventListener('click', function(e) {
            var all = this.closest('.gallery-grid').querySelectorAll('.gallery-image-wrap img');
            var imgs = Array.prototype.slice.call(all);
            var img = this.querySelector('img');
            var idx = imgs.indexOf(img);
            if (idx === -1) idx = 0;
            openLightbox(imgs, idx);
        });
    });
});