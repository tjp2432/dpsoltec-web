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

    // Video preview on hover for Iluminación exterior gallery image
    var galleryItems = document.querySelectorAll('.gallery-item');
    for (var gi = 0; gi < galleryItems.length; gi++) {
        var label = galleryItems[gi].querySelector('.gallery-label');
        if (label && label.textContent.indexOf('Iluminación exterior') !== -1) {
            (function(item) {
                var preview = null;
                var wrap = item.querySelector('.gallery-image-wrap');
                if (!wrap) return;
                var grid = item.closest('.gallery-grid');
                var container = item.closest('.container');
                if (!grid || !container) return;
                function removePreview() {
                    if (preview) {
                        preview.style.animation = 'slideToRight 0.3s ease-out forwards';
                        var el = preview;
                        preview = null;
                        setTimeout(function() { el.remove(); container.style.position = ''; }, 300);
                    }
                }
                var styleSheet = document.getElementById('vid-anim');
                if (!styleSheet) {
                    styleSheet = document.createElement('style');
                    styleSheet.id = 'vid-anim';
                    styleSheet.textContent = '@keyframes slideFromRight {from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}@keyframes slideToRight {from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(60px)}}';
                    document.head.appendChild(styleSheet);
                }
                wrap.addEventListener('mouseenter', function() {
                    if (preview) return;
                    var rect = item.getBoundingClientRect();
                    var cRect = container.getBoundingClientRect();
                    preview = document.createElement('div');
                    var w = rect.width * 0.75;
                    var vh = w * 0.75;
                    container.style.position = 'relative';
                    preview.style.cssText = 'position:absolute;top:' + (rect.top - cRect.top + (rect.height - vh) / 2) + 'px;left:' + (rect.left - cRect.left - w - 24) + 'px;width:' + w + 'px;height:' + vh + 'px;border-radius:var(--radius-lg);overflow:hidden;box-shadow:inset 0 1px 1px rgba(255,255,255,0.2);border:1px solid var(--glass-border);background:#0d1117;z-index:10;animation:slideFromRight 0.3s ease-out;';
                    var x = document.createElement('span');
                    x.textContent = '\u00D7';
                    x.style.cssText = 'position:absolute;top:6px;right:10px;z-index:2;color:#fff;font-size:1.3rem;cursor:pointer;opacity:0.8;line-height:1;font-family:serif;text-shadow:0 1px 3px rgba(0,0,0,0.5);';
                    x.addEventListener('click', function(e) { e.stopPropagation(); removePreview(); });
                    preview.appendChild(x);
                    var vid = document.createElement('video');
                    vid.src = (window.location.pathname.indexOf('/servicios/') !== -1 ? '../' : '') + 'assets/IluExtProgresiva.mp4';
                    vid.muted = true;
                    vid.loop = true;
                    vid.playsInline = true;
                    vid.autoplay = true;
                    vid.preload = 'auto';
                    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                    preview.appendChild(vid);
                    container.appendChild(preview);
                    setTimeout(function() { vid.play().catch(function(){}); }, 100);
                });
            })(galleryItems[gi]);
            break;
        }
    }

    // Floating description tooltip for card list items
    var descs = {
        'Instalaciones domiciliarias': 'Todo tipo de trabajos eléctricos enfocados en el hogar, asegurando un suministro eléctrico seguro, eficiente y normativo para el día a día.',
        'Obras y reformas eléctricas': 'Proyectos de mayor envergadura que abarcan desde el cableado completo en construcciones nuevas hasta la renovación y modernización de tableros o redes obsoletas.',
        'Iluminación exterior': 'Diseño y colocación de luminarias pensadas para soportar la intemperie, ideales para fachadas, jardines, accesos o áreas comunes que requieran realce estético o mayor seguridad nocturna.',
        'Alarmas y telefonía': 'Montaje de sistemas de alerta contra intrusos combinados con centrales telefónicas o intercomunicadores para mantener una comunicación fluida y un control de accesos eficiente.',
        'CCTV y videovigilancia': 'Instalación de circuitos cerrados de televisión y cámaras de seguridad avanzadas que permiten el monitoreo en tiempo real y el registro en video de todo lo que sucede en el perímetro.',
        'Audio y video': 'Configuración e integración de sistemas multimedia de sonido y pantallas, orientados tanto al confort residencial como a la automatización de espacios comerciales.',
        'PC / Mac / Notebook': 'Soporte técnico especializado e integral para todo tipo de computadoras de escritorio y portátiles, sin importar la marca o el sistema operativo.',
        'Diagnóstico y reparación': 'Detección precisa de fallas de hardware o conflictos de software para solucionar cualquier tipo de avería y devolver el equipo a su óptimo estado de funcionamiento.',
        'Actualización de hard/soft': 'Optimización general del rendimiento mediante la instalación de componentes físicos más potentes (como memorias SSD) y la puesta a punto de los sistemas operativos y programas más recientes.',
        'Cableado estructurado': 'Despliegue de tendidos de cables de red organizados y normalizados, diseñados para soportar de manera eficiente el tráfico de datos en oficinas, comercios o empresas.',
        'Instalación de antenas wifi': 'Montaje y calibración de puntos de acceso y antenas inalámbricas para maximizar el alcance de la señal y eliminar por completo las zonas muertas de conectividad.',
        'Redes y conectividad': 'Configuración completa de routers, switches y topologías de red que garantizan un flujo de datos rápido, seguro y sin interrupciones entre todos los dispositivos conectados.'
    };
    var allListItems = document.querySelectorAll('.card-list li');
    for (var li = 0; li < allListItems.length; li++) {
        (function(el) {
            var text = el.textContent.trim();
            var desc = descs[text];
            if (!desc) return;
            var tooltip = null;
            el.addEventListener('mouseenter', function() {
                if (tooltip) return;
                tooltip = document.createElement('div');
                tooltip.textContent = desc;
                tooltip.style.cssText = 'position:fixed;z-index:100;max-width:320px;padding:14px 18px;border-radius:12px;font-size:0.85rem;line-height:1.55;color:#e0e2e8;background:rgba(13,17,23,0.75);border:1px solid rgba(255,255,255,0.08);box-shadow:inset 0 1px 1px rgba(255,255,255,0.15),0 8px 32px rgba(0,0,0,0.5);-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px);pointer-events:none;';
                document.body.appendChild(tooltip);
                positionTooltip(el, tooltip);
            });
            el.addEventListener('mouseleave', function() {
                if (tooltip) { tooltip.remove(); tooltip = null; }
            });
            function positionTooltip(anchor, tip) {
                var ar = anchor.getBoundingClientRect();
                var tr = tip.getBoundingClientRect();
                var left = ar.right + 16;
                var top = ar.top + ar.height / 2 - tr.height / 2;
                if (left + tr.width > window.innerWidth - 16) left = ar.left - tr.width - 16;
                if (top < 8) top = 8;
                if (top + tr.height > window.innerHeight - 8) top = window.innerHeight - tr.height - 8;
                tip.style.left = left + 'px';
                tip.style.top = top + 'px';
            }
            window.addEventListener('scroll', function() {
                if (tooltip) positionTooltip(el, tooltip);
            }, { passive: true });
            window.addEventListener('resize', function() {
                if (tooltip) positionTooltip(el, tooltip);
            }, { passive: true });
        })(allListItems[li]);
    }

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
        row.style.cssText = 'display:flex;align-items:center;justify-content:center;position:relative;z-index:1;';
        var img = document.createElement('img');
        img.style.cssText = 'max-width:92vw;max-height:92vh;width:auto;height:auto;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.6);display:block;';
        row.appendChild(img);
        var prevBtn = document.createElement('span');
        prevBtn.textContent = '\u2039';
        prevBtn.style.cssText = 'position:fixed;top:50%;left:28px;transform:translateY(-50%);z-index:10000;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:1.7rem;line-height:1;padding-bottom:2px;-webkit-user-select:none;user-select:none;background:rgba(255,200,50,0.12);border:1px solid rgba(255,200,50,0.25);color:#f5c542;box-shadow:inset 0 1px 1px rgba(255,255,255,0.2),0 0 10px rgba(255,200,50,0.12);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);transition:opacity 0.2s,transform 0.2s;';
        prevBtn.addEventListener('mouseenter', function(){this.style.opacity='1';this.style.transform='translateY(-50%) scale(1.05)';});
        prevBtn.addEventListener('mouseleave', function(){this.style.opacity='0.85';this.style.transform='translateY(-50%) scale(1)';});
        prevBtn.style.opacity = '0.85';
        row.appendChild(prevBtn);
        var nextBtn = document.createElement('span');
        nextBtn.textContent = '\u203A';
        nextBtn.style.cssText = 'position:fixed;top:50%;right:28px;transform:translateY(-50%);z-index:10000;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:1.7rem;line-height:1;padding-bottom:2px;-webkit-user-select:none;user-select:none;background:rgba(101,207,114,0.10);border:1px solid rgba(101,207,114,0.25);color:#65CF72;box-shadow:inset 0 1px 1px rgba(255,255,255,0.2),0 0 10px rgba(101,207,114,0.15);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);transition:opacity 0.2s,transform 0.2s;';
        nextBtn.addEventListener('mouseenter', function(){this.style.opacity='1';this.style.transform='translateY(-50%) scale(1.05)';});
        nextBtn.addEventListener('mouseleave', function(){this.style.opacity='0.85';this.style.transform='translateY(-50%) scale(1)';});
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