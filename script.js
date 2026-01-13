// Optimized Portfolio JavaScript
// Performance: Use IIFE to avoid global scope pollution
(function() {
    'use strict';

    // Cache DOM elements for performance
    const DOM = {
        body: document.body,
        navToggle: null,
        navLinks: null,
        customCursor: null,
        sections: null
    };

    // Initialize DOM cache when ready
    function cacheDOMElements() {
        try {
            DOM.navToggle = document.getElementById('navToggle');
            DOM.navLinks = document.getElementById('navLinks');
            DOM.customCursor = document.querySelector('.custom-cursor');
            DOM.sections = document.querySelectorAll('section.full-viewport-section');
            console.log('DOM elements cached successfully');
        } catch (error) {
            console.error('Error caching DOM elements:', error);
        }
    }

    // Optimized hex to RGB converter with error handling
    function hexToRgb(hex) {
        if (!hex || typeof hex !== 'string' || !hex.includes('#')) {
            console.warn('Invalid hex color:', hex);
            return "0,0,0";
        }
        
        try {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result 
                ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
                : "0,0,0";
        } catch (error) {
            console.error('Error parsing hex color:', error);
            return "0,0,0";
        }
    }

    // Update CSS RGB variables for shadows
    function updateRgbaVars() {
        try {
            const rootStyles = getComputedStyle(document.documentElement);
            const colors = {
                accent: rootStyles.getPropertyValue('--current-accent').trim(),
                primary: rootStyles.getPropertyValue('--current-primary').trim(),
                secondary: rootStyles.getPropertyValue('--current-secondary').trim(),
                background: rootStyles.getPropertyValue('--current-background').trim()
            };

            document.documentElement.style.setProperty('--current-accent-rgb', hexToRgb(colors.accent));
            document.documentElement.style.setProperty('--current-primary-rgb', hexToRgb(colors.primary));
            document.documentElement.style.setProperty('--current-secondary-rgb', hexToRgb(colors.secondary));
            document.documentElement.style.setProperty('--current-background-rgb', hexToRgb(colors.background));
            console.log('RGBA variables updated');
        } catch (error) {
            console.error('Error updating RGBA variables:', error);
        }
    }

    // Smooth scroll handler with event delegation
    function setupSmoothScroll() {
        document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if open
            closeMobileMenu();
        });
        console.log('Smooth scroll setup complete');
    }

    // Mobile menu controls
    function closeMobileMenu() {
        if (DOM.navLinks && DOM.navToggle && DOM.navLinks.classList.contains('open')) {
            DOM.navLinks.classList.remove('open');
            DOM.navToggle.classList.remove('open');
            DOM.navToggle.setAttribute('aria-expanded', 'false');
            DOM.body.classList.remove('no-scroll');
            console.log('Mobile menu closed');
        }
    }

    function setupMobileMenu() {
        if (!DOM.navToggle || !DOM.navLinks) {
            console.warn('Mobile menu elements not found');
            return;
        }

        DOM.navToggle.addEventListener('click', function() {
            try {
                const isOpen = DOM.navLinks.classList.toggle('open');
                DOM.navToggle.classList.toggle('open');
                DOM.navToggle.setAttribute('aria-expanded', isOpen);
                DOM.body.classList.toggle('no-scroll');
                console.log('Mobile menu toggled, isOpen:', isOpen);
            } catch (error) {
                console.error('Error toggling mobile menu:', error);
            }
        });
        console.log('Mobile menu setup complete');
    }

    // Custom cursor - optimized with transform
    function setupCustomCursor() {
        if (!DOM.customCursor) return;

        let cursorX = 0, cursorY = 0;
        let rafId = null;

        function updateCursor() {
            DOM.customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            rafId = null;
        }

        document.addEventListener('mousemove', function(e) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            
            if (!rafId) {
                rafId = requestAnimationFrame(updateCursor);
            }
        });

        document.addEventListener('mouseenter', function(e) {
            const target = e.target.closest('a, .btn, .project-card, .skills-column li, .nav-toggle, .icon-btn');
            if (target) {
                DOM.customCursor.classList.add('grow');
            }
        }, true);

        document.addEventListener('mouseleave', function(e) {
            const target = e.target.closest('a, .btn, .project-card, .skills-column li, .nav-toggle, .icon-btn');
            if (target) {
                DOM.customCursor.classList.remove('grow');
            }
        }, true);
        console.log('Custom cursor setup complete');
    }

    // Intersection Observer for scroll animations
    function setupScrollAnimations() {
        if (!DOM.sections || DOM.sections.length === 0) return;

        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;

                const elements = entry.target.querySelectorAll(
                    '.section-content > *, h2, .section-description, .project-card, ' +
                    '.timeline-item, .contact-form > *, .social-links > *, .profile-card > *'
                );

                elements.forEach(function(el, index) {
                    const animationType = el.dataset.animation || 'animate-fade-in-up';
                    el.style.animationDelay = `${index * 0.5}s`;
                    el.classList.add(animationType);
                });

                observer.unobserve(entry.target);
            });
        }, observerOptions);

        DOM.sections.forEach(function(section) {
            const animatableElements = section.querySelectorAll(
                '.section-content > *, h2, .section-description, .project-card, ' +
                '.timeline-item, .contact-form > *, .social-links > *, .profile-card > *'
            );
            
            animatableElements.forEach(function(el) {
                el.classList.add('animate-initially-hidden');
            });
            
            observer.observe(section);
        });
        console.log('Scroll animations setup complete');
    }

    // Theme toggle functionality
    function setupThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch-checkbox');
        if (!themeSwitch) {
            console.warn('Theme switch checkbox not found');
            return;
        }

        // Set initial state from localStorage
        const savedTheme = localStorage.getItem('theme');
        const isLightMode = savedTheme === 'light-mode';

        DOM.body.classList.toggle('light-mode', isLightMode);
        themeSwitch.checked = isLightMode;

        updateRgbaVars(); // in case we start in light mode

        // Add change listener
        themeSwitch.addEventListener('change', function(event) {
            const isNowLightMode = event.target.checked;
            DOM.body.classList.toggle('light-mode', isNowLightMode);
            
            try {
                localStorage.setItem('theme', isNowLightMode ? 'light-mode' : 'dark-mode');
            } catch (error) {
                console.warn('Could not save theme preference:', error);
            }
            
            updateRgbaVars();
        });
        console.log('Theme toggle setup complete');
    }

    // Observe theme changes for RGBA updates
    function setupThemeObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    updateRgbaVars();
                }
            });
        });

        observer.observe(DOM.body, { 
            attributes: true,
            attributeFilter: ['class']
        });

        console.log('Theme observer setup complete');
        return observer;
    }

    // Form validation (bonus feature)
    function setupFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all fields');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            console.log('Form submitted:', data);
            alert('Thank you for your message! (This is a demo - no email was actually sent)');
            contactForm.reset();
        });
        console.log('Form validation setup complete');
    }

    function setupTechStackSlider() {
        const techStackContainer = document.querySelector('.tech-stack-icons');
        if (techStackContainer) {
            const icons = Array.from(techStackContainer.children);
            icons.forEach(icon => {
                const clone = icon.cloneNode(true);
                techStackContainer.appendChild(clone);
            });
        }
    }

    async function fetchGitHubRepos() {
        const repoListContainer = document.getElementById('repo-list');
        if (!repoListContainer) return;

        try {
            const response = await fetch('https://api.github.com/users/Rocky-1018/repos?sort=stars&per_page=5');
            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }
            const repos = await response.json();

            repoListContainer.innerHTML = ''; // Clear "Fetching..." message

            repos.forEach(repo => {
                const repoEl = document.createElement('div');
                repoEl.className = 'repo-item';

                repoEl.innerHTML = `
                    <h6><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h6>
                    <div class="repo-stats">
                        ${repo.language ? `<p><small>${repo.language}</small></p>` : ''}
                    </div>
                `;
                repoListContainer.appendChild(repoEl);
            });

        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            repoListContainer.innerHTML = '<p>Could not fetch GitHub activity.</p>';
        }
    }

    // Initialize everything when DOM is ready
    function init() {
        cacheDOMElements();
        updateRgbaVars();
        setupSmoothScroll();
        setupMobileMenu();
        setupCustomCursor();
        setupScrollAnimations();
        setupThemeToggle();
        setupThemeObserver();
        setupFormValidation();
        setupTechStackSlider();
        fetchGitHubRepos();
        
        console.log('Portfolio initialized successfully');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();