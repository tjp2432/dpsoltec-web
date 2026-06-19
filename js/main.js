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

    // Hamburger button toggles menu on tap (no drag)
    menuToggle.addEventListener('touchstart', (e) => { e.preventDefault(); toggleMenu(); }, { passive: false });

    // Nav links close menu on click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Tap outside header closes menu
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !e.target.closest('.top-header')) {
            closeMenu();
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

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

    mensaje.addEventListener('input', () => {
        const len = mensaje.value.length;
        charCount.textContent = len;
        charCounter.classList.toggle('full', len === 170);
    });

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            empresa: document.getElementById('empresa').value.trim(),
            mensaje: document.getElementById('mensaje').value.trim()
        };

        if (!formData.nombre || !formData.email || !formData.mensaje) {
            showToast('Por favor completá los campos obligatorios.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showToast('Por favor ingresá un email válido.', 'error');
            return;
        }

        showToast('Mensaje enviado con éxito. Te contactaremos pronto.', 'success');
        contactForm.reset();
    });

    // Toast notification
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (type === 'error') {
            toast.style.background = '#ef4444';
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
});
