const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const scrollToTop = document.querySelector('.scroll-to-top');
const skillBars = document.querySelectorAll('.skill-progress');
const circularSkills = document.querySelectorAll('.circular-progress');

function isMobileNav() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function setMenuState(isOpen) {
    if (!navMenu || !hamburger) return;

    navMenu.classList.toggle('active', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen && isMobileNav());
}

function closeMenu() {
    setMenuState(false);
}

function toggleMenu() {
    const isOpen = !navMenu.classList.contains('active');
    setMenuState(isOpen);
}

window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const hideDelay = prefersReducedMotion ? 0 : 500;
        setTimeout(() => {
            loadingScreen.classList.add('hide');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, prefersReducedMotion ? 0 : 500);
        }, hideDelay);
    }

    document.body.classList.add('loaded');
    animateSkillBars();
    animateCircularSkills();
});

setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        loadingScreen.style.display = 'none';
    }
}, 3000);

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (!isMobileNav() || !navMenu.classList.contains('active')) return;
        if (navbar && !navbar.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobileNav()) {
            closeMenu();
        }
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        e.preventDefault();
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;
    let currentId = '';

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            currentId = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}

window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    }

    if (scrollToTop) {
        scrollToTop.classList.toggle('show', window.scrollY > 500);
    }

    updateActiveNavLink();
    animateSkillBars();
    animateCircularSkills();
}, { passive: true });

if (scrollToTop) {
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}

function animateSkillBars() {
    skillBars.forEach((bar) => {
        const barTop = bar.getBoundingClientRect().top;
        if (barTop < window.innerHeight - 50) {
            bar.classList.add('animate');
        }
    });
}

function animateCircularSkills() {
    circularSkills.forEach((skill) => {
        const skillTop = skill.getBoundingClientRect().top;
        const percent = Number(skill.getAttribute('data-percent'));

        if (skillTop < window.innerHeight - 50 && !Number.isNaN(percent)) {
            skill.style.setProperty('--progress', `${percent * 3.6}deg`);
            skill.classList.add('animate');
        }
    });
}

if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.service-card, .project-card, .skill-item, .education-item').forEach((card) => {
        observer.observe(card);
    });
}

class TypeWriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index += 1;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

const heroHighlight = document.querySelector('.profession .highlight');
if (heroHighlight) {
    const originalText = heroHighlight.textContent;
    if (prefersReducedMotion) {
        heroHighlight.textContent = originalText;
    } else {
        heroHighlight.textContent = '';
        setTimeout(() => {
            new TypeWriter(heroHighlight, originalText, 150);
        }, 1000);
    }
}

if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.bg-shape').forEach((shape, index) => {
            const speed = (index + 1) * 0.15;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });
}

document.querySelectorAll('.service-card, .project-card, .skill-item').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        showNotification('Sending message...', 'success');

        try {
            const response = await fetch('https://formspree.io/f/xdkjdqwk', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            if (response.ok) {
                showNotification("Message sent successfully! I'll get back to you soon.", 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again later.', 'error');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again later.', 'error');
        }
    });
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'status');
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span></span>
    `;
    notification.querySelector('span').textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
});
