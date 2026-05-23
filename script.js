/* ============================================
   Shahab Ahmed Portfolio — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // Particle Background Animation
    // ==============================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x -= (dx / dist) * force * 0.5;
                    this.y -= (dy / dist) * force * 0.5;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        // Optimized particle count to prevent lag
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 50);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationFrame = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        initParticles();
    });

    // ==============================
    // Custom Cursor
    // ==============================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    let isTrackingMouse = false;
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        if (!isTrackingMouse) {
            requestAnimationFrame(() => {
                cursorDot.style.left = cursorX + 'px';
                cursorDot.style.top = cursorY + 'px';

                // Update CSS custom properties for card glow
                document.documentElement.style.setProperty('--mouse-x', mouse.x + 'px');
                document.documentElement.style.setProperty('--mouse-y', mouse.y + 'px');
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

    // Cursor hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });

    // ==============================
    // Navbar
    // ==============================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    let isScrolling = false;
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Active link tracking
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
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

    // ==============================
    // Counter Animation
    // ==============================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
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
                // Add staggered delay based on index for grouped elements
                const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                const delayMs = parseFloat(delay) * 1000;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delayMs);

                // Trigger counter animation when stats are visible
                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // ==============================
    // Skill Bars Animation
    // ==============================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                const delayMs = parseFloat(delay) * 1000;

                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delayMs + 300);

                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll('.skill-card').forEach(card => {
        skillObserver.observe(card);
    });

    // ==============================
    // Smooth Scroll for anchor links
    // ==============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
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

    if (profileContainer && window.innerWidth > 768) {
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
        });

        heroSection.addEventListener('mouseleave', () => {
            profileContainer.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        });
    }

    // ==============================
    // Card Glow Effect on Mouse Move
    // ==============================
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

    // ==============================
    // Scroll progress indicator (hide on scroll down)
    // ==============================
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    // ==============================
    // Page load animation
    // ==============================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
