/* ============================================
   Shahab Ahmed Portfolio — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const isMobile = window.innerWidth <= 768 || isCoarsePointer;

    // ==============================
    // Particle Background Animation
    // ==============================
    const canvas = document.getElementById('particles-canvas');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationFrame;
    let particlesRunning = true;

    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d', { alpha: true });

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resizeCanvas();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 150);
        }, { passive: true });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (!isCoarsePointer && mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120 && dist > 0) {
                        const force = (120 - dist) / 120;
                        this.x -= (dx / dist) * force * 0.5;
                        this.y -= (dy / dist) * force * 0.5;
                    }
                }

                const w = window.innerWidth;
                const h = window.innerHeight;
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        function getParticleCount() {
            const area = window.innerWidth * window.innerHeight;
            const base = isMobile ? 12000 : 20000;
            const max = isMobile ? 28 : 50;
            return Math.min(Math.floor(area / base), max);
        }

        function initParticles() {
            const count = getParticleCount();
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            if (isMobile) return;
            const maxDist = 150;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < maxDist * maxDist) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / maxDist) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            if (!particlesRunning) return;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationFrame = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                particlesRunning = false;
                cancelAnimationFrame(animationFrame);
            } else {
                particlesRunning = true;
                animateParticles();
            }
        });

        if (!isCoarsePointer) {
            document.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                document.documentElement.style.setProperty('--mouse-x', mouse.x + 'px');
                document.documentElement.style.setProperty('--mouse-y', mouse.y + 'px');
            }, { passive: true });
        }
    } else if (canvas) {
        canvas.style.display = 'none';
    }

    // ==============================
    // Custom Cursor (desktop only)
    // ==============================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && !isCoarsePointer && !prefersReducedMotion) {
        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;
        let isTrackingMouse = false;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            if (!isTrackingMouse) {
                requestAnimationFrame(() => {
                    cursorDot.style.left = cursorX + 'px';
                    cursorDot.style.top = cursorY + 'px';
                    isTrackingMouse = false;
                });
                isTrackingMouse = true;
            }
        }, { passive: true });

        function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
        });
    }

    // ==============================
    // Navbar & Mobile Menu
    // ==============================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function setNavOpen(open) {
        navToggle.classList.toggle('active', open);
        navLinks.classList.toggle('open', open);
        navOverlay?.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', open);
        navOverlay?.setAttribute('aria-hidden', !open);
        document.body.classList.toggle('nav-open', open);
    }

    function closeNav() {
        setNavOpen(false);
    }

    navToggle?.addEventListener('click', () => {
        const willOpen = !navLinks.classList.contains('open');
        setNavOpen(willOpen);
    });

    navOverlay?.addEventListener('click', closeNav);

    allNavLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
            closeNav();
            navToggle?.focus();
        }
    });

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                navbar?.classList.toggle('scrolled', window.scrollY > 50);

                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                allNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
                });
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // ==============================
    // Scroll Progress & Back to Top
    // ==============================
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    function updateScrollUI() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }

        backToTop?.classList.toggle('visible', scrollTop > 400);

        const scrollIndicator = document.getElementById('scroll-indicator');
        if (scrollIndicator) {
            const hidden = scrollTop > 200;
            scrollIndicator.style.opacity = hidden ? '0' : '1';
            scrollIndicator.style.pointerEvents = hidden ? 'none' : 'auto';
        }
    }

    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    // ==============================
    // Typing Animation
    // ==============================
    const typingElement = document.getElementById('typing-text');
    const roles = [
        'CS Student @ UMT',
        'Aspiring Software Engineer',
        'C++ Developer',
        'Frontend Enthusiast',
        'Python Learner',
        'Problem Solver'
    ];

    if (typingElement && !prefersReducedMotion) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeText() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }

            setTimeout(typeText, typingSpeed);
        }

        typeText();
    } else if (typingElement) {
        typingElement.textContent = roles[0];
    }

    // ==============================
    // Counter Animation
    // ==============================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = prefersReducedMotion ? 0 : 2000;
            if (duration === 0) {
                stat.textContent = target;
                return;
            }
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            }
            updateCounter();
        });
    }

    // ==============================
    // Intersection Observer for Reveals
    // ==============================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                const delayMs = prefersReducedMotion ? 0 : parseFloat(delay) * 1000;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delayMs);

                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        if (prefersReducedMotion) {
            el.classList.add('revealed');
        } else {
            revealObserver.observe(el);
        }
    });

    if (prefersReducedMotion) {
        animateCounters();
    }

    // ==============================
    // Skill Bars Animation
    // ==============================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                const delayMs = prefersReducedMotion ? 0 : parseFloat(delay) * 1000 + 300;

                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delayMs);

                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-card').forEach(card => {
        if (prefersReducedMotion) {
            card.classList.add('animated');
        } else {
            skillObserver.observe(card);
        }
    });

    // ==============================
    // Smooth Scroll for anchor links
    // ==============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==============================
    // Parallax on mouse move for profile
    // ==============================
    const profileContainer = document.querySelector('.profile-container');
    const heroSection = document.getElementById('hero');

    if (profileContainer && heroSection && !isCoarsePointer && !prefersReducedMotion && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            profileContainer.style.transform = `
                perspective(1000px)
                rotateY(${x * 10}deg)
                rotateX(${-y * 10}deg)
                translateZ(20px)
            `;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            profileContainer.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        });
    }

    // ==============================
    // Card Glow Effect on Mouse Move
    // ==============================
    if (!isCoarsePointer) {
        document.querySelectorAll('.glass-card').forEach(card => {
            let isCardTracking = false;
            card.addEventListener('mousemove', (e) => {
                if (!isCardTracking) {
                    requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        card.style.setProperty('--mouse-x', x + '%');
                        card.style.setProperty('--mouse-y', y + '%');
                        isCardTracking = false;
                    });
                    isCardTracking = true;
                }
            }, { passive: true });
        });
    }

    // ==============================
    // Page load fade-in
    // ==============================
    if (!prefersReducedMotion) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
        requestAnimationFrame(() => {
            if (document.readyState === 'complete') {
                document.body.style.opacity = '1';
            }
        });
    }
});
