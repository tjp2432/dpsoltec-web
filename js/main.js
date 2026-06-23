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

    // Lightbox
    document.querySelectorAll('.gallery-image-wrap').forEach(function(w) {
        w.addEventListener('click', function(e) {
            var img = this.querySelector('img');
            if (!img) return;
            var o = document.createElement('div');
            o.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;';
            var bg = document.createElement('div');
            bg.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.85);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);';
            o.appendChild(bg);
            var x = document.createElement('span');
            x.style.cssText = 'position:fixed;top:20px;right:24px;z-index:10000;color:#fff;font-size:2.5rem;cursor:pointer;opacity:0.7;line-height:1;';
            x.textContent = '\u00D7';
            o.appendChild(x);
            var i = document.createElement('img');
            i.src = img.src;
            i.alt = img.alt;
            i.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:92vw;max-height:92vh;width:auto;height:auto;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.6);';
            o.appendChild(i);
            document.body.appendChild(o);
            x.addEventListener('click', function() { o.remove(); });
            bg.addEventListener('click', function() { o.remove(); });
        });
    });
});