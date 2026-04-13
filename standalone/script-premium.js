/* ============================================
   VIRAL CAPTION AI - PREMIUM JAVASCRIPT
   Enhanced interactivity & Conversion Features
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize premium features
    initFAQ();
    initScrollAnimations();
    initFormValidation();
    initCTATracking();
    
    console.log('✨ ViralCaption AI Premium loaded');
});

// ============================================
// FAQ ACCORDION
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const elements = document.querySelectorAll('.step-card, .feature-item, .pricing-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const form = document.getElementById('captionForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const topicInput = document.getElementById('topic');
            
            if (!topicInput.value.trim()) {
                e.preventDefault();
                showValidationError(topicInput, 'Vul aub je idee in!');
                return;
            }
            
            // Remove error if valid
            removeValidationError(topicInput);
        });
        
        // Real-time validation
        document.getElementById('topic').addEventListener('input', function() {
            if (this.value.trim()) {
                removeValidationError(this);
            }
        });
    }
}

function showValidationError(input, message) {
    input.style.borderColor = '#f44336';
    input.style.boxShadow = '0 0 0 4px rgba(244, 67, 54, 0.1)';
    
    const error = document.createElement('div');
    error.className = 'input-error';
    error.textContent = message;
    error.style.color = '#f44336';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '5px';
    error.style.fontWeight = '600';
    
    input.parentNode.appendChild(error);
}

function removeValidationError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    const error = input.parentNode.querySelector('.input-error');
    if (error) error.remove();
}

// ============================================
// CTA TRACKING (for analytics)
// ============================================

function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.cta-btn, .btn-primary-large, .btn-plan, .btn-large');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            const href = this.href || this.getAttribute('onclick');
            
            // Track GA event or send to your analytics
            console.log('CTA Click:', {
                text: buttonText,
                href: href,
                timestamp: new Date().toISOString()
            });
            
            // You can send this to Google Analytics, Mixpanel, etc.
            // gtag('event', 'cta_click', { button_text: buttonText });
        });
    });
}

// ============================================
// SCROLL TO SECTION SMOOTH
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if it's an internal link
        if (this.getAttribute('href') !== '#' && !this.getAttribute('href').includes('http')) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// CURRENCY TOGGLE (optional future feature)
// ============================================

let currentCurrency = '€';

function toggleCurrency() {
    currentCurrency = currentCurrency === '€' ? '$' : '€';
    const priceElements = document.querySelectorAll('.price');
    
    priceElements.forEach(el => {
        const text = el.textContent;
        // Replace currency symbol
        el.textContent = currentCurrency + text.substring(1);
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth < 768) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.style.background = 'none';
        menuToggle.style.border = 'none';
        menuToggle.style.fontSize = '1.5rem';
        menuToggle.style.cursor = 'pointer';
        menuToggle.style.color = 'var(--primary)';
        
        document.querySelector('.nav-wrapper').insertBefore(menuToggle, navLinks);
        
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '60px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.background = 'white';
            navLinks.style.padding = '20px';
            navLinks.style.gap = '15px';
            navLinks.style.borderBottom = '1px solid var(--border)';
            navLinks.style.zIndex = '999';
        });
    }
}

// ============================================
// PERFORMANCE & UX ENHANCEMENTS
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('loading');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// DYNAMIC STATS COUNTER
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.metric strong');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = formatNumber(Math.floor(current)) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = formatNumber(target) + '+';
            }
        };
        
        updateCounter();
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Start counter animation when metrics are visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

const trustMetrics = document.querySelector('.trust-metrics');
if (trustMetrics) {
    observer.observe(trustMetrics);
}

// ============================================
// FORM AUTOFILL PREVENTION FOR SECURITY
// ============================================

function protectFormFields() {
    const inputs = document.querySelectorAll('.caption-form-premium input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.setAttribute('autocomplete', 'new-password');
        });
    });
}

// ============================================
// SESSION STORAGE FOR UX
// ============================================

function saveUserPreferences() {
    const platform = document.getElementById('platform');
    const tone = document.getElementById('tone');
    
    if (platform && tone) {
        platform.addEventListener('change', () => {
            sessionStorage.setItem('selectedPlatform', platform.value);
        });
        
        tone.addEventListener('change', () => {
            sessionStorage.setItem('selectedTone', tone.value);
        });
        
        // Restore on load
        if (sessionStorage.getItem('selectedPlatform')) {
            platform.value = sessionStorage.getItem('selectedPlatform');
        }
        if (sessionStorage.getItem('selectedTone')) {
            tone.value = sessionStorage.getItem('selectedTone');
        }
    }
}

saveUserPreferences();

// ============================================
// PREMIUM LOGGER FOR DEBUGGING
// ============================================

const logger = {
    log: (message, data) => console.log(`[VC AI] ${message}`, data || ''),
    warn: (message, data) => console.warn(`[VC AI] ⚠️ ${message}`, data || ''),
    error: (message, data) => console.error(`[VC AI] ❌ ${message}`, data || ''),
    success: (message, data) => console.log(`[VC AI] ✅ ${message}`, data || '')
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        logger.success(`Page load time: ${pageLoadTime}ms`);
    });
}

// ============================================
// USER ENGAGEMENT TRACKING
// ============================================

let userEngagement = {
    scrollDepth: 0,
    timeOnPage: 0,
    ctaClicks: 0,
    formInteractions: 0
};

// Track scroll depth
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    userEngagement.scrollDepth = Math.max(userEngagement.scrollDepth, scrollPercent);
});

// Track time on page
setInterval(() => {
    userEngagement.timeOnPage += 1;
}, 1000);

// Track form interactions
document.querySelectorAll('.caption-form-premium input, .caption-form-premium select').forEach(field => {
    field.addEventListener('focus', () => {
        userEngagement.formInteractions++;
    });
});

// Log engagement onbeforeunload
window.addEventListener('beforeunload', () => {
    logger.log('User engagement data:', {
        scrollDepth: userEngagement.scrollDepth.toFixed(2) + '%',
        timeOnPage: Math.floor(userEngagement.timeOnPage / 60) + ' min',
        formInteractions: userEngagement.formInteractions
    });
});

// ============================================
// EXPORT FOR TESTING
// ============================================

window.VCai = {
    logger,
    userEngagement,
    toggleCurrency,
    animateCounters
};

console.log('🚀 ViralCaption AI Pro loaded - Use window.VCai for debugging');
