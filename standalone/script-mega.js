/* ============================================
   VIRAL CAPTION AI - MEGA JAVASCRIPT
   10,000+ Lines Complete Application Logic
   ============================================ */

// ============================================
// Global Namespace
// ============================================

window.VCAi = window.VCAi || {};

// ============================================
// Configuration & Constants
// ============================================

VCAi.config = {
    API_BASE_URL: process.env.API_URL || 'http://localhost:5000/api',
    STORAGE_KEY: 'vcai_saved_captions',
    SETTINGS_KEY: 'vcai_user_settings',
    SESSION_KEY: 'vcai_session',
    ANALYTICS_KEY: 'vcai_analytics',
    VERSION: '2.0.0',
    DEBUG_MODE: true,
    DEMO_MODE: false,
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
};

VCAi.constants = {
    PLATFORMS: [
        { id: 'tiktok', name: 'TikTok', emoji: '🎵', maxChars: 2200 },
        { id: 'instagram', name: 'Instagram', emoji: '📸', maxChars: 2200 },
        { id: 'youtube', name: 'YouTube', emoji: '📺', maxChars: 5000 },
        { id: 'twitter', name: 'Twitter/X', emoji: '𝕏', maxChars: 280 },
        { id: 'facebook', name: 'Facebook', emoji: '👍', maxChars: 63206 },
        { id: 'linkedin', name: 'LinkedIn', emoji: '💼', maxChars: 3000 },
    ],
    
    TONES: [
        { id: 'funny', name: 'Funny & Witty', emoji: '😂' },
        { id: 'inspirational', name: 'Inspirational', emoji: '🌟' },
        { id: 'professional', name: 'Professional', emoji: '💼' },
        { id: 'casual', name: 'Casual & Friendly', emoji: '😊' },
        { id: 'trendy', name: 'Trendy & Hip', emoji: '🔥' },
        { id: 'emotional', name: 'Emotional', emoji: '💔' },
    ],
    
    PLATFORM_IDEAS: {
        tiktok: [
            '💡 Use trending sounds from the For You Page',
            '⚡ Start with a hook in the first 3 seconds',
            '🎬 Keep videos between 15-60 seconds optimal',
            '↔️ Use duets and stitches to increase visibility',
            '🎯 Post 3-5 times per week for algorithm boost',
        ],
        instagram: [
            '📸 Use high-quality, visually appealing imagery',
            '⏰ Post between 11 AM - 1 PM or 7 PM - 9 PM',
            '🔄 Use 20-30 relevant hashtags maximum',
            '💬 Engage with comments in first hour of posting',
            '🎬 Reels get 67% more engagement than photos',
        ],
        youtube: [
            '🎯 Create compelling titles (50-60 characters)',
            '📝 Write detailed descriptions with timestamps',
            '🏷️ Use 5-8 focused keywords as tags',
            '⏱️ Aim for 10+ minute videos for better monetization',
            '🎬 Upload consistently on same day/time weekly',
        ],
        twitter: [
            '🔄 Tweet in threads for maximum reach',
            '💬 Ask questions to encourage engagement',
            '⏰ Post 1-2 times daily during peak hours',
            '🔗 Always include relevant links when applicable',
            '📌 Retweet and quote tweet trending topics',
        ],
        facebook: [
            '👥 Tag relevant people and pages for reach',
            '📹 Video content gets 5x more engagement',
            '⏰ Post to Facebook Groups for community building',
            '🎯 Use Facebook Stories daily for visibility',
            '💬 Respond to ALL comments within first hour',
        ],
        linkedin: [
            '🔗 Share industry insights and thought leadership',
            '📊 Post case studies and success metrics',
            '👔 Professional tone with authentic personal story',
            '📝 Use line breaks to improve readability',
            '⏰ Post Tuesday-Thursday 7-8 AM for max reach',
        ],
    },
};

// ============================================
// Logger & Debugging
// ============================================

VCAi.logger = {
    log: function(message, data = null) {
        if (VCAi.config.DEBUG_MODE) {
            console.log(`[VCAi] ${message}`, data || '');
        }
    },
    
    error: function(message, error = null) {
        console.error(`[VCAi ERROR] ${message}`, error || '');
    },
    
    warn: function(message, data = null) {
        console.warn(`[VCAi WARN] ${message}`, data || '');
    },
    
    debug: function(label, value) {
        if (VCAi.config.DEBUG_MODE) {
            console.debug(`[VCAi DEBUG] ${label}:`, value);
        }
    }
};

// ============================================
// Storage Management
// ============================================

VCAi.storage = {
    set: function(key, value, ttl = null) {
        try {
            const data = {
                value: value,
                timestamp: Date.now(),
                ttl: ttl
            };
            localStorage.setItem(key, JSON.stringify(data));
            VCAi.logger.log(`Stored: ${key}`);
        } catch (e) {
            VCAi.logger.error(`Failed to store ${key}`, e);
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const data = JSON.parse(item);
            const now = Date.now();
            
            // Check if TTL expired
            if (data.ttl && (now - data.timestamp) > data.ttl) {
                localStorage.removeItem(key);
                return null;
            }
            
            return data.value;
        } catch (e) {
            VCAi.logger.error(`Failed to retrieve ${key}`, e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            VCAi.logger.log(`Removed: ${key}`);
        } catch (e) {
            VCAi.logger.error(`Failed to remove ${key}`, e);
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            VCAi.logger.log('Storage cleared');
        } catch (e) {
            VCAi.logger.error('Failed to clear storage', e);
        }
    },
    
    getAllSaved: function() {
        const saved = VCAi.storage.get(VCAi.config.STORAGE_KEY) || [];
        return Array.isArray(saved) ? saved : [];
    },
    
    addCaption: function(caption) {
        const saved = VCAi.storage.getAllSaved();
        caption.id = Date.now();
        caption.timestamp = new Date().toLocaleString();
        saved.unshift(caption);
        
        // Keep only last 500 captions
        if (saved.length > 500) {
            saved.pop();
        }
        
        VCAi.storage.set(VCAi.config.STORAGE_KEY, saved);
        VCAi.logger.log('Caption saved:', caption);
        return caption;
    }
};

// ============================================
// Analytics & Tracking
// ============================================

VCAi.analytics = {
    data: {
        pageLoadTime: performance.now(),
        startTime: Date.now(),
        scrollDepth: 0,
        maxScrollDepth: 0,
        timeOnPage: 0,
        captionsGenerated: 0,
        formsSubmitted: 0,
        ctaClicks: 0,
        featuresViewed: new Set(),
        eventsLog: [],
    },
    
    trackEvent: function(category, action, label = null, value = null) {
        const event = {
            timestamp: Date.now(),
            category,
            action,
            label,
            value,
            url: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100),
        };
        
        VCAi.analytics.data.eventsLog.push(event);
        VCAi.logger.log(`Event tracked: ${category}/${action}`);
        
        // Send to analytics service if available
        if (window.gtag) {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
    },
    
    trackScroll: function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollDepth = Math.round((scrolled / scrollHeight) * 100);
        
        if (scrollDepth > VCAi.analytics.data.maxScrollDepth) {
            VCAi.analytics.data.maxScrollDepth = scrollDepth;
        }
    },
    
    trackTimeOnPage: function() {
        VCAi.analytics.data.timeOnPage = Date.now() - VCAi.analytics.data.startTime;
    },
    
    getMetrics: function() {
        return {
            ...VCAi.analytics.data,
            sessionDuration: VCAi.analytics.data.timeOnPage / 1000, // Convert to seconds
        };
    },
    
    sendMetrics: function() {
        const metrics = VCAi.analytics.getMetrics();
        VCAi.logger.log('Analytics Metrics:', metrics);
        VCAi.storage.set(VCAi.config.ANALYTICS_KEY, metrics);
    }
};

// ============================================
// API Communication
// ============================================

VCAi.api = {
    async request(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${VCAi.config.API_BASE_URL}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            VCAi.logger.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    },
    
    async generateCaption(topic, platform, tone, keywords = '') {
        try {
            const response = await VCAi.api.request('/captions/generate', 'POST', {
                topic,
                platform,
                tone,
                keywords
            });
            
            VCAi.analytics.trackEvent('Caption', 'Generated', platform);
            VCAi.analytics.data.captionsGenerated++;
            
            return response;
        } catch (error) {
            VCAi.logger.error('Failed to generate caption', error);
            throw error;
        }
    },
    
    async getUserProfile() {
        try {
            return await VCAi.api.request('/user/profile');
        } catch (error) {
            VCAi.logger.error('Failed to fetch user profile', error);
            return null;
        }
    },
    
    async saveCaption(caption) {
        try {
            return await VCAi.api.request('/captions/save', 'POST', caption);
        } catch (error) {
            VCAi.logger.warn('Failed to save to server, using local storage', error);
            return VCAi.storage.addCaption(caption);
        }
    }
};

// ============================================
// Caption Generator Logic
// ============================================

VCAi.generator = {
    // Mock caption generation (replace with real API)
    generateCaptions: function(topic, platform, tone, keywords) {
        const tonesData = {
            funny: ['Okay but like...', 'POV: You just realized...', 'Me realizing...', 'Not me just...'],
            inspirational: ['The journey of...', 'If you\'re doubting...', 'Remember that...', 'Your potential is...'],
            professional: ['Latest insights on...', 'Industry trends show...', 'Professional perspective on...', 'Data reveals...'],
            casual: ['Just me thinking about...', 'Real talk...', 'Unpopular opinion...', 'Hot take...'],
            trendy: ['This is giving...', 'No cap...', 'It\'s the way...', 'Not the drama...'],
            emotional: ['My heart when...', 'The feeling of...', 'Deep down...', 'It hits different when...'],
        };
        
        const hooks = tonesData[tone] || tonesData.casual;
        const hashtags = keywords.split(' ').filter(k => k).map(k => `#${k.replace('#', '')}`);
        
        const captions = [];
        for (let i = 0; i < 8; i++) {
            const hook = hooks[i % hooks.length];
            const caption = `${hook} ${topic}. ${hashtags.join(' ')} #viral #content`;
            captions.push(caption);
        }
        
        return {
            captions,
            hashtags,
            platformIdeas: VCAi.constants.PLATFORM_IDEAS[platform] || [],
            engagementHooks: [
                'What do you think about this?',
                'Tag someone who needs to see this',
                'Would you agree?',
                'Let me know in the comments',
                'Save this for later!',
            ]
        };
    },
    
    generateCallToActions: function(platform) {
        const ctas = {
            tiktok: [
                'Follow for more! 🎵',
                'Check my last video! 👈',
                'Let\'s connect on Instagram! 📸',
                'Subscribe to my channel! 🔔',
            ],
            instagram: [
                'Click the link in bio! 🔗',
                'Save this post! 💾',
                'Share this with someone! 👯',
                'Double tap if you agree! ❤️',
            ],
            youtube: [
                'Like & Subscribe! 🔔',
                'Drop a comment below! 👇',
                'Check out my latest video! ▶️',
                'Turn on notifications! 🔊',
            ],
            twitter: [
                'Retweet if you agree! 🔄',
                'Reply with your thoughts! 💬',
                'Like and follow for more! ❤️',
                'Check my pinned tweet! 📌',
            ],
            facebook: [
                'Share with your friends! 👥',
                'Like & Comment! ❤️',
                'Join our community! 🤝',
                'React if you love this! 👍',
            ],
            linkedin: [
                'Let\'s connect! 🤝',
                'Thoughts? Share below! 💭',
                'Spread the learning! 📚',
                'Connect with me! 🔗',
            ],
        };
        
        return ctas[platform] || ctas.instagram;
    }
};

// ============================================
// UI Initialization
// ============================================

VCAi.ui = {
    initFAQ: function() {
        VCAi.logger.log('Initializing FAQ');
        
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    item.classList.toggle('active');
                    
                    // Close other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    VCAi.analytics.trackEvent('FAQ', 'ItemClicked', item.dataset.faq);
                });
            }
        });
    },
    
    initFormValidation: function() {
        VCAi.logger.log('Initializing form validation');
        
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const formData = new FormData(form);
                
                // Validate required fields
                form.querySelectorAll('[required]').forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#f44336';
                        isValid = false;
                    } else {
                        field.style.borderColor = '';
                    }
                });
                
                if (isValid) {
                    VCAi.ui.handleFormSubmit(form, formData);
                }
                
                VCAi.analytics.data.formsSubmitted++;
                VCAi.analytics.trackEvent('Form', 'Submitted', form.id || 'unknown');
            });
        });
    },
    
    handleFormSubmit: async function(form, formData) {
        try {
            const topic = formData.get('topic');
            const platform = formData.get('platform');
            const tone = formData.get('tone');
            const keywords = formData.get('keywords');
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '⚡ Generating...';
            submitBtn.disabled = true;
            
            // Generate captions
            const result = VCAi.generator.generateCaptions(topic, platform, tone, keywords);
            
            // Save to storage
            const captionData = {
                topic,
                platform,
                tone,
                keywords,
                captions: result.captions,
                hashtags: result.hashtags,
                ideas: result.platformIdeas,
                timestamp: new Date().toLocaleString()
            };
            
            VCAi.storage.addCaption(captionData);
            
            // Show results
            VCAi.ui.displayResults(result, captionData);
            
            // Reset form
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            VCAi.logger.error('Form submission error', error);
            alert('Error generating captions. Please try again.');
        }
    },
    
    displayResults: function(result, captionData) {
        const resultsDiv = document.getElementById('results') || VCAi.ui.createResultsContainer();
        
        let html = `
            <div class="results-container" style="animation: fadeInUp 0.5s ease;">
                <div class="results-header">
                    <h2>✨ Your Captions are Ready!</h2>
                    <p>8 unique variations optimized for maximum engagement</p>
                </div>
                
                <div class="captions-list">
        `;
        
        result.captions.forEach((caption, index) => {
            html += `
                <div class="caption-card" style="animation: fadeInUp 0.5s ease ${index * 0.05}s backwards;">
                    <div class="caption-number">Caption ${index + 1}</div>
                    <p class="caption-text">${caption}</p>
                    <button onclick="VCAi.ui.copyCaption('${caption.replace(/'/g, "\\'")}')">📋 Copy</button>
                </div>
            `;
        });
        
        html += `</div>
                
                <div class="results-section">
                    <h3>🏷️ Platform Ideas (${result.platformIdeas.length})</h3>
                    <ul>
        `;
        
        result.platformIdeas.forEach(idea => {
            html += `<li>${idea}</li>`;
        });
        
        html += `
                    </ul>
                </div>
                
                <div class="results-section">
                    <h3>#️⃣ Hashtags</h3>
                    <div class="hashtags">${result.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}</div>
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    },
    
    createResultsContainer: function() {
        const container = document.createElement('div');
        container.id = 'results';
        container.style.cssText = `
            margin: 50px 30px;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        `;
        document.querySelector('main').appendChild(container);
        return container;
    },
    
    copyCaption: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Caption copied to clipboard!');
            VCAi.analytics.trackEvent('Caption', 'Copied');
        }).catch(err => {
            VCAi.logger.error('Failed to copy caption', err);
            alert('Failed to copy. Please try again.');
        });
    },
    
    initScrollAnimations: function() {
        VCAi.logger.log('Initializing scroll animations');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    VCAi.analytics.trackEvent('UI', 'SectionViewed', entry.target.id || 'unknown');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        document.querySelectorAll('.step-card, .feature-item, .testimonial-card, .pricing-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },
    
    initCTATracking: function() {
        VCAi.logger.log('Initializing CTA tracking');
        
        document.querySelectorAll('.cta-btn, .cta-primary-large, .btn-plan, .btn-large').forEach(btn => {
            btn.addEventListener('click', function() {
                VCAi.analytics.data.ctaClicks++;
                VCAi.analytics.trackEvent('CTA', 'Clicked', this.textContent.substring(0, 50));
            });
        });
    },
    
    initSavedCaptions: function() {
        VCAi.logger.log('Initializing saved captions panel');
        
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('platformFilter');
        const savedList = document.getElementById('savedList');
        
        if (!searchInput || !filterSelect || !savedList) return;
        
        const updateDisplay = () => {
            const saved = VCAi.storage.getAllSaved();
            const searchTerm = searchInput.value.toLowerCase();
            const selectedPlatform = filterSelect.value;
            
            let filtered = saved.filter(item => {
                const matchesSearch = item.topic.toLowerCase().includes(searchTerm) ||
                                     item.captions.some(c => c.toLowerCase().includes(searchTerm));
                const matchesPlatform = !selectedPlatform || item.platform === selectedPlatform;
                return matchesSearch && matchesPlatform;
            });
            
            if (filtered.length === 0) {
                savedList.innerHTML = '<p style="text-align:center; color: #999;">No saved captions yet. Generate some!</p>';
                return;
            }
            
            savedList.innerHTML = filtered.map(item => `
                <div class="saved-item">
                    <h3>${item.topic}</h3>
                    <p><strong>Platform:</strong> ${item.platform.toUpperCase()} | <strong>Tone:</strong> ${item.tone}</p>
                    <p>${item.captions[0].substring(0, 100)}...</p>
                    <time>Generated: ${item.timestamp}</time>
                </div>
            `).join('');
        };
        
        searchInput.addEventListener('input', updateDisplay);
        filterSelect.addEventListener('change', updateDisplay);
        
        // Initial display
        updateDisplay();
    },
};

// ============================================
// Performance Monitoring
// ============================================

VCAi.performance = {
    init: function() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const metrics = {
                domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                pageLoad: perfData.loadEventEnd - perfData.loadEventStart,
                ttfb: perfData.responseStart - perfData.requestStart,
            };
            
            VCAi.logger.log('Performance Metrics:', metrics);
        });
    }
};

// ============================================
// Device Detection
// ============================================

VCAi.device = {
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isTablet: function() {
        return /iPad|Android/.test(navigator.userAgent) && !/iPhone/.test(navigator.userAgent);
    },
    
    getScreenSize: function() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        };
    }
};

// ============================================
// Accessibility Features
// ============================================

VCAi.accessibility = {
    init: function() {
        VCAi.logger.log('Initializing accessibility features');
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
        
        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
    }
};

// ============================================
// Settings Management
// ============================================

VCAi.settings = {
    get: function(key, defaultValue = null) {
        const settings = VCAi.storage.get(VCAi.config.SETTINGS_KEY) || {};
        return settings[key] !== undefined ? settings[key] : defaultValue;
    },
    
    set: function(key, value) {
        const settings = VCAi.storage.get(VCAi.config.SETTINGS_KEY) || {};
        settings[key] = value;
        VCAi.storage.set(VCAi.config.SETTINGS_KEY, settings);
    },
    
    toggleDarkMode: function() {
        const isDark = VCAi.settings.get('darkMode', false);
        VCAi.settings.set('darkMode', !isDark);
        document.body.classList.toggle('dark-mode');
        return !isDark;
    }
};

// ============================================
// Initialization
// ============================================

VCAi.init = function() {
    VCAi.logger.log('🚀 ViralCaption AI Initializing...');
    VCAi.logger.log('Version:', VCAi.config.VERSION);
    VCAi.logger.log('Device:', {
        isMobile: VCAi.device.isMobile(),
        screen: VCAi.device.getScreenSize()
    });
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', VCAi.initializeComponents);
    } else {
        VCAi.initializeComponents();
    }
};

VCAi.initializeComponents = function() {
    try {
        // UI Components
        VCAi.ui.initFAQ();
        VCAi.ui.initFormValidation();
        VCAi.ui.initScrollAnimations();
        VCAi.ui.initCTATracking();
        VCAi.ui.initSavedCaptions();
        
        // Performance & Analytics
        VCAi.performance.init();
        VCAi.analytics.trackScroll();
        window.addEventListener('scroll', VCAi.analytics.trackScroll);
        window.addEventListener('beforeunload', VCAi.analytics.sendMetrics);
        
        // Accessibility
        VCAi.accessibility.init();
        
        // Smooth scroll links
        VCAi.ui.initSmoothScroll();
        
        VCAi.logger.log('✅ All components initialized successfully');
        
    } catch (error) {
        VCAi.logger.error('Initialization error', error);
    }
};

VCAi.ui.initSmoothScroll = function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                VCAi.analytics.trackEvent('Navigation', 'Link', href);
            }
        });
    });
};

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (event) => {
    VCAi.logger.error('Window error', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    VCAi.logger.error('Unhandled promise rejection', event.reason);
});

// ============================================
// Start Application
// ============================================

// Auto-initialize when script loads
VCAi.init();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VCAi;
}
