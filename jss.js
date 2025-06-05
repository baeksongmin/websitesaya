// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM elements
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");
    const nav = document.querySelector("nav");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector("nav ul");
    const backToTop = document.createElement("button");

    // Initialize Intersection Observer for section animations
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in");
                    sectionObserver.unobserve(entry.target); // Unobserve after animation
                }
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: "-50px 0px",
        }
    );

    // Observe sections
    sections.forEach((section) => sectionObserver.observe(section));

    // Smooth scrolling for anchor links
    const setupSmoothScroll = () => {
        document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (event) => {
                event.preventDefault();
                const targetId = anchor.getAttribute("href").substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            });
        });
    };

    // Highlight navigation based on scroll position
    const highlightNavOnScroll = () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const navHeight = nav ? nav.offsetHeight : 0;
            if (window.scrollY >= sectionTop - navHeight - 100) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${current}`) {
                link.classList.add("active");
            }
        });
    };

    // Navigation style change on scroll
    const navScrollEffect = () => {
        if (nav) {
            nav.classList.toggle("scrolled", window.scrollY > 50);
        }
    };

    // Toggle mobile menu with accessibility
    const setupMobileMenu = () => {
        if (navToggle && navMenu) {
            navToggle.addEventListener("click", () => {
                navMenu.classList.toggle("show");
                const isExpanded = navMenu.classList.contains("show");
                navToggle.setAttribute("aria-expanded", isExpanded);
            });

            // Close mobile menu on outside click
            document.addEventListener("click", (event) => {
                const isNavToggle = event.target.closest(".nav-toggle");
                const isNavMenu = event.target.closest("nav ul");
                if (!isNavToggle && !isNavMenu && navMenu.classList.contains("show")) {
                    navMenu.classList.remove("show");
                    navToggle.setAttribute("aria-expanded", "false");
                }
            });
        }
    };

    // Debounce function for scroll events
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return (...args) => {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Handle scroll events
    const handleScroll = debounce(() => {
        navScrollEffect();
        highlightNavOnScroll();
        toggleBackToTop();
    });

    // Lazy load images
    const lazyLoadImages = () => {
        if ("loading" in HTMLImageElement.prototype) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach((img) => {
                if (img.dataset.src) img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers without native lazy loading
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) img.src = img.dataset.src;
                        lazyObserver.unobserve(img);
                    }
                });
            });
            document.querySelectorAll('img[data-src]').forEach((img) => lazyObserver.observe(img));
        }
    };

    // Reveal craft items
    const setupCraftItems = () => {
        const craftItems = document.querySelectorAll(".craft-item");
        if (craftItems.length > 0) {
            const craftObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add("visible");
                            }, index * 100);
                            craftObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.2,
                    rootMargin: "0px 0px -50px 0px",
                }
            );
            craftItems.forEach((item) => craftObserver.observe(item));
        }
    };

    // Back to top button
    const setupBackToTop = () => {
        backToTop.textContent = "↑ Back to Top";
        backToTop.classList.add("back-to-top");
        backToTop.setAttribute("aria-label", "Back to top");
        document.body.appendChild(backToTop);

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        backToTop.addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    };

    const toggleBackToTop = () => {
        backToTop.classList.toggle("visible", window.scrollY > 300);
    };

    // CSS for back-to-top button (inline for simplicity)
    const style = document.createElement("style");
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            background: var(--gradient);
            color: white;
            border: none;
            border-radius: 5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity var(--transition-default);
            z-index: 1000;
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(style);

    // Initialize everything
    const init = () => {
        setupSmoothScroll();
        setupMobileMenu();
        setupCraftItems();
        setupBackToTop();
        lazyLoadImages();
        window.addEventListener("scroll", handleScroll);
        navScrollEffect();
        highlightNavOnScroll();

        // Animate header on load
        const hero = document.querySelector("header");
        if (hero) setTimeout(() => hero.classList.add("loaded"), 100);
    };

    init();
});
// Navigation scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('scrolled', window.scrollY > 100);
});

// Section visibility
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll down button
document.querySelector('.scroll-down').addEventListener('click', () => {
    document.getElementById('featured').scrollIntoView({
        behavior: 'smooth'
    });
});

// Keyboard accessibility for cards
document.querySelectorAll('.category-card, .info-card, .testimonial').forEach(card => {
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });
});

// Apply animations when scrolling
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (el.classList.contains('animated')) {
                el.style.visibility = 'visible';
                el.style.animationName = el.dataset.animation || 'fadeInUp';
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animated').forEach(el => {
    el.style.visibility = 'hidden';
    animateOnScroll.observe(el);
});

// Generate sparkles around the title
function createSparkles() {
    const title = document.getElementById('main-title');
    const titleRect = title.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Position randomly around the title
        const randomX = Math.random() * (titleRect.width + 100) - 50;
        const randomY = Math.random() * (titleRect.height + 100) - 50;
        
        sparkle.style.left = `${randomX}px`;
        sparkle.style.top = `${randomY}px`;
        
        // Random animation delay
        sparkle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add to title container
        title.appendChild(sparkle);
    }
}

// Call it after page loads
window.addEventListener('load', createSparkles);

// Create background particles
function createParticles() {
    const bgAnimation = document.querySelector('.bg-animation');
    const colors = [
        'var(--primary-color)', 
        'var(--secondary-color)', 
        'var(--accent-color)',
        'var(--cheerful-green)',
        'var(--bright-accent)',
        'var(--playful-pink)'
    ];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position, size and color
        const size = Math.random() * 15 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.backgroundColor = color;
        particle.style.opacity = Math.random() * 0.5;
        
        // Random animation duration and delay
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        bgAnimation.appendChild(particle);
    }
}

// Call it after page loads
window.addEventListener('load', createParticles);

// Custom cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    
    if (cursor && dot) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
    }
});

// Hover effects for cards
const cards = document.querySelectorAll('.info-card, .testimonial');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 20px 40px rgba(74, 107, 223, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--card-shadow)';
    });
});

// Add 3D tilt effect to cards (mouse follow)
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const cardRect = this.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const angleY = (e.clientX - cardCenterX) / 20;
        const angleX = (cardCenterY - e.clientY) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Add confetti click effect to header
const header = document.querySelector('header');
header.addEventListener('click', createConfetti);

function createConfetti(e) {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.left = `${e.clientX}px`;
    confettiContainer.style.top = `${e.clientY}px`;
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '10';
    
    const colors = [
        'var(--primary-color)', 
        'var(--secondary-color)', 
        'var(--accent-color)',
        'var(--cheerful-green)',
        'var(--bright-accent)',
        'var(--playful-pink)'
    ];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Random starting position
        confetti.style.left = '0';
        confetti.style.top = '0';
        
        // Random transform
        const angle = Math.random() * 360;
        const distance = Math.random() * 100 + 50;
        const translateX = Math.cos(angle * Math.PI / 180) * distance;
        const translateY = Math.sin(angle * Math.PI / 180) * distance;
        
        confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${translateX}px, ${translateY}px) rotate(${angle * 2}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 1000 + 1000,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Remove after animation is complete
    setTimeout(() => {
        confettiContainer.remove();
    }, 2000);
}

// Make section divider more interactive
const divider = document.querySelector('.section-divider');
divider.addEventListener('mouseenter', () => {
    document.querySelectorAll('.divider-icon').forEach(icon => {
        icon.style.animationDuration = '1.5s';
        icon.style.color = 'rgba(255, 255, 255, 0.4)';
    });
});

divider.addEventListener('mouseleave', () => {
    document.querySelectorAll('.divider-icon').forEach(icon => {
        icon.style.animationDuration = '6s';
        icon.style.color = 'rgba(255, 255, 255, 0.2)';
    });
});

// Craft shop flying objects animation
function createFlyingObjects() {
    const craftItems = [
        'fa-paint-brush', 'fa-pencil-alt', 'fa-palette', 'fa-leaf', 
        'fa-feather', 'fa-star', 'fa-heart', 'fa-gem', 'fa-certificate'
    ];
    
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        // Add 2-4 flying objects to each section
        const count = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < count; i++) {
            const flyingEl = document.createElement('div');
            flyingEl.classList.add('flying-element');
            
            // Random position
            flyingEl.style.top = `${Math.random() * 80 + 10}%`;
            flyingEl.style.left = `${Math.random() * 80 + 10}%`;
            
            // Random delay
            flyingEl.style.animationDelay = `${Math.random() * 10}s`;
            
            // Random icon
            const icon = document.createElement('i');
            icon.classList.add('fas');
            icon.classList.add(craftItems[Math.floor(Math.random() * craftItems.length)]);
            
            flyingEl.appendChild(icon);
            section.appendChild(flyingEl);
        }
    });
}

// Call after DOM is loaded
document.addEventListener('DOMContentLoaded', createFlyingObjects);