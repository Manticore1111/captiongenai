/* ============================================
   VIRAL CAPTION AI - EXTENDED FEATURES
   Additional 2000+ Lines JavaScript Features
   ============================================ */

// Extension of VCAi namespace with advanced features

// ============================================
// Advanced UI Features
// ============================================

VCAi.advanced = {
    // Modal System
    modalManager: {
        createModal: function(title, content, options = {}) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" onclick="VCAi.advanced.modalManager.closeModal(this.closest('.modal'))">&times;</button>
                    </div>
                    <div>${content}</div>
                    ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.classList.add('show');
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    VCAi.advanced.modalManager.closeModal(modal);
                }
            });
            
            return modal;
        },
        
        closeModal: function(modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    },
    
    // Alert System
    alertManager: {
        show: function(message, type = 'primary', duration = 5000) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <span class="alert-icon">${VCAi.advanced.alertManager.getIcon(type)}</span>
                <div class="alert-content">
                    <p>${message}</p>
                </div>
            `;
            
            const container = document.querySelector('main') || document.body;
            container.insertBefore(alert, container.firstChild);
            
            alert.style.animation = 'slideDown 0.4s ease';
            
            if (duration > 0) {
                setTimeout(() => {
                    alert.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => alert.remove(), 300);
                }, duration);
            }
            
            return alert;
        },
        
        getIcon: function(type) {
            const icons = {
                primary: '🔔',
                success: '✅',
                warning: '⚠️',
                danger: '❌',
            };
            return icons[type] || icons.primary;
        }
    },
    
    // Tooltip System
    tooltipManager: {
        init: function() {
            document.querySelectorAll('[data-tooltip]').forEach(el => {
                const tooltip = el.dataset.tooltip;
                el.classList.add('tooltip-container');
                el.innerHTML += `<span class="tooltip-text">${tooltip}</span>`;
            });
        }
    },
    
    // Table Manager
    tableManager: {
        createTable: function(data, columns) {
            let html = '<table class="data-table"><thead><tr>';
            
            columns.forEach(col => {
                html += `<th>${col}</th>`;
            });
            
            html += '</tr></thead><tbody>';
            
            data.forEach(row => {
                html += '<tr>';
                columns.forEach(col => {
                    html += `<td>${row[col] || '-'}</td>`;
                });
                html += '</tr>';
            });
            
            html += '</tbody></table>';
            return html;
        },
        
        sortTable: function(tableElement, columnIndex, ascending = true) {
            const tbody = tableElement.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.sort((a, b) => {
                const aVal = a.children[columnIndex].textContent;
                const bVal = b.children[columnIndex].textContent;
                
                if (ascending) {
                    return aVal.localeCompare(bVal);
                } else {
                    return bVal.localeCompare(aVal);
                }
            });
            
            rows.forEach(row => tbody.appendChild(row));
        }
    }
};

// ============================================
// Form Handling Advanced
// ============================================

VCAi.formHandler = {
    builders: {},
    
    createForm: function(formId, fields, submitCallback) {
        let form = `<form id="${formId}" class="caption-form-premium">`;
        
        fields.forEach(field => {
            form += VCAi.formHandler.createField(field);
        });
        
        form += `<button type="submit" class="btn-generate-hero">Submit</button></form>`;
        
        this.builders[formId] = { fields, submitCallback };
        
        setTimeout(() => {
            const formEl = document.getElementById(formId);
            if (formEl) {
                formEl.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const data = new FormData(formEl);
                    const values = Object.fromEntries(data);
                    submitCallback(values);
                });
            }
        }, 100);
        
        return form;
    },
    
    createField: function(field) {
        const { id, label, type, required = false, placeholder = '', options = [] } = field;
        
        let fieldHtml = `<div class="form-group">
            <label for="${id}">${label}</label>`;
        
        if (type === 'select') {
            fieldHtml += `<select id="${id}" name="${id}" ${required ? 'required' : ''}>
                <option value="">Select...</option>`;
            options.forEach(opt => {
                fieldHtml += `<option value="${opt.value}">${opt.label}</option>`;
            });
            fieldHtml += '</select>';
        } else if (type === 'textarea') {
            fieldHtml += `<textarea id="${id}" name="${id}" placeholder="${placeholder}" ${required ? 'required' : ''}></textarea>`;
        } else {
            fieldHtml += `<input type="${type}" id="${id}" name="${id}" placeholder="${placeholder}" ${required ? 'required' : ''}>`;
        }
        
        fieldHtml += '</div>';
        return fieldHtml;
    },
    
    validateForm: function(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;
        
        let isValid = true;
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.parentElement.classList.add('error');
                isValid = false;
            } else {
                field.parentElement.classList.remove('error');
            }
        });
        
        return isValid;
    }
};

// ============================================
// Content Generator Extensions
// ============================================

VCAi.contentGenerator = {
    // Generate content by topic
    generateByTopic: function(topic) {
        const generators = {
            product: this.generateProductCaption,
            lifestyle: this.generateLifestyleCaption,
            motivation: this.generateMotivationCaption,
            educational: this.generateEducationalCaption,
            entertainment: this.generateEntertainmentCaption,
            business: this.generateBusinessCaption,
        };
        
        return generators[topic] ? generators[topic](topic) : this.generateGenericCaption(topic);
    },
    
    generateProductCaption: function(topic) {
        const hooks = [
            '🚀 Just Dropped:',
            '✨ Introducing:',
            '🎉 New Release:',
            '💎 Limited Edition:',
            '🔥 Hot Item:'
        ];
        
        const hooks2 = [
            'A game-changer you didn\'t know you needed',
            'The upgrade you\'ve been waiting for',
            'Quality meets affordability',
            'Designed with YOU in mind',
            'Simple, but POWERFUL'
        ];
        
        return `${hooks[Math.floor(Math.random() * hooks.length)]} ${topic}
        
${hooks2[Math.floor(Math.random() * hooks2.length)]}

✨ Available NOW
Link in bio 🔗

#NewRelease #Product #Shopping`;
    },
    
    generateLifestyleCaption: function(topic) {
        const starters = [
            'Living my best life ✨',
            'Some days are harder than others, but this makes it better 💪',
            'Found my happy place 😍',
            'Life update: ',
            'POV: ',
        ];
        
        return `${starters[Math.floor(Math.random() * starters.length)]}

${topic}

That's what self-care looks like 💆‍♀️

Tell me about YOUR routine! 👇

#Lifestyle #SelfCare #DailyFlex`;
    },
    
    generateMotivationCaption: function(topic) {
        const messages = [
            'The results will speak for themselves 🎯',
            'Every small step counts 🚶',
            'You\'re doing better than you think ⭐',
            'Progress over perfection 📈',
            'The only person you\'re competing with is yesterday\'s version of you 💪',
        ];
        
        return `${topic}

${messages[Math.floor(Math.random() * messages.length)]}

Remember: You got this! 💯

Drop a 💪 if you needed this reminder today

#Motivation #Mindset #YouGotThis`;
    },
    
    generateEducationalCaption: function(topic) {
        const formats = [
            'Quick tip:',
            'Did you know?',
            'Here\'s what I learned:',
            'Lesson of the day:',
            'Mind.Blown. moment:',
        ];
        
        return `${formats[Math.floor(Math.random() * formats.length)]}

${topic}

This changed my perspective 🧠

What\'s something YOU learned recently? Let me know below 👇

#Learning #Knowledge #Education`;
    },
    
    generateEntertainmentCaption: function(topic) {
        const reactions = [
            'SCREAMING 😭😭😭',
            'I can\'t handle this 💀',
            'Absolutely SENT me 🤣',
            'I came for the content, stayed for the vibes 😂',
            'POV: You\'re about to have the best 30 seconds of your day',
        ];
        
        return `${reactions[Math.floor(Math.random() * reactions.length)]}

${topic}

Tag someone who needs to see this 👇

#Entertainment #FYP #ForYou`;
    },
    
    generateBusinessCaption: function(topic) {
        const ctas = [
            'Ready to level up?',
            'Want to know my secret?',
            'Here\'s how I did it:',
            'The business move nobody talks about:',
            'This ACTUALLY works:',
        ];
        
        return `${ctas[Math.floor(Math.random() * ctas.length)]}

${topic}

Building a brand that LASTS requires:
✅ Authenticity
✅ Consistency  
✅ Value-First Mentality

Drop a comment on how you're scaling your business! 📈

#Business #Entrepreneurship #Growth`;
    },
    
    generateGenericCaption: function(topic) {
        return `✨ ${topic} ✨

This is it. This is the moment.

🔥 Make it happen
💡 Stay inspired
⭐ Keep pushing

Comment your thoughts! 👇

#Viral #Content #FYP`;
    }
};

// ============================================
// Analytics Enhancements
// ============================================

VCAi.analyticsAdvanced = {
    // User Journey Tracking
    journeyLog: [],
    
    trackUserJourney: function() {
        const journey = {
            startTime: Date.now(),
            entries: [],
            utm: VCAi.analyticsAdvanced.parseUTM(),
            referrer: document.referrer,
            language: navigator.language,
            platform: VCAi.device.isMobile() ? 'mobile' : 'desktop',
            screen: VCAi.device.getScreenSize(),
        };
        
        // Track page interactions
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track]');
            if (target) {
                journey.entries.push({
                    type: 'click',
                    element: target.dataset.track,
                    timestamp: Date.now()
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            journey.entries.push({
                type: 'form_submit',
                form: e.target.id || 'unknown',
                timestamp: Date.now()
            });
        });
        
        VCAi.analyticsAdvanced.journeyLog = journey;
    },
    
    parseUTM: function() {
        const params = new URLSearchParams(window.location.search);
        return {
            source: params.get('utm_source'),
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign'),
            content: params.get('utm_content'),
        };
    },
    
    // Heatmap simulation
    trackMouseMovement: function() {
        const heatmap = new Map();
        
        document.addEventListener('mousemove', (e) => {
            const key = `${Math.floor(e.clientX / 50)},${Math.floor(e.clientY / 50)}`;
            heatmap.set(key, (heatmap.get(key) || 0) + 1);
        });
        
        return heatmap;
    },
    
    // Engagement Score
    calculateEngagementScore: function() {
        const metrics = VCAi.analytics.getMetrics();
        let score = 0;
        
        // Time on page (max 30 points)
        score += Math.min((metrics.timeOnPage / 1000 / 60) * 10, 30);
        
        // Scroll depth (max 25 points)
        score += (metrics.maxScrollDepth / 100) * 25;
        
        // Forms submitted (max 20 points)
        score += Math.min(metrics.formsSubmitted * 10, 20);
        
        // CTAs clicked (max 15 points)
        score += Math.min(metrics.ctaClicks * 3, 15);
        
        // Captions generated (max 10 points)
        score += Math.min(metrics.captionsGenerated * 2, 10);
        
        return Math.min(Math.round(score), 100);
    }
};

// ============================================
// Notification System
// ============================================

VCAi.notifications = {
    queue: [],
    
    notify: function(message, type = 'primary', options = {}) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration: options.duration || 5000,
            showNow: true
        };
        
        this.queue.push(notification);
        
        const elem = VCAi.advanced.alertManager.show(message, type, options.duration);
        
        VCAi.analytics.trackEvent('Notification', 'Shown', type);
        
        return notification.id;
    },
    
    success: function(message) {
        return this.notify(message, 'success', { duration: 4000 });
    },
    
    error: function(message) {
        return this.notify(message, 'danger', { duration: 0 });
    },
    
    warning: function(message) {
        return this.notify(message, 'warning', { duration: 5000 });
    },
    
    info: function(message) {
        return this.notify(message, 'primary', { duration: 5000 });
    }
};

// ============================================
// Search & Filter System
// ============================================

VCAi.searchFilter = {
    indexes: {},
    
    createIndex: function(name, items, searchableFields) {
        this.indexes[name] = {
            items,
            searchableFields,
            keywords: this.buildKeywords(items, searchableFields)
        };
    },
    
    buildKeywords: function(items, fields) {
        const keywords = new Map();
        
        items.forEach((item, index) => {
            fields.forEach(field => {
                const value = item[field] ? String(item[field]).toLowerCase() : '';
                value.split(' ').forEach(word => {
                    if (!keywords.has(word)) {
                        keywords.set(word, []);
                    }
                    keywords.get(word).push(index);
                });
            });
        });
        
        return keywords;
    },
    
    search: function(indexName, query) {
        const index = this.indexes[indexName];
        if (!index) return [];
        
        const queryTerms = query.toLowerCase().split(' ').filter(t => t);
        const results = new Set();
        
        queryTerms.forEach(term => {
            const indexes = index.keywords.get(term) || [];
            indexes.forEach(i => results.add(i));
        });
        
        return Array.from(results).map(i => index.items[i]);
    },
    
    filter: function(items, criteria) {
        return items.filter(item => {
            for (const [key, value] of Object.entries(criteria)) {
                if (item[key] !== value) return false;
            }
            return true;
        });
    }
};

// ============================================
// Export & Download Features
// ============================================

VCAi.export = {
    downloadJSON: function(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    },
    
    downloadCSV: function(data, filename) {
        let csv = '';
        
        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]);
            csv += headers.join(',') + '\n';
            
            data.forEach(row => {
                csv += headers.map(h => `"${row[h] || ''}"`).join(',') + '\n';
            });
        }
        
        const blob = new Blob([csv], { type: 'text/csv' });
        this.downloadBlob(blob, filename);
    },
    
    downloadText: function(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        this.downloadBlob(blob, filename);
    },
    
    downloadBlob: function(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// ============================================
// Keyboard Shortcuts
// ============================================

VCAi.shortcuts = {
    registered: {},
    
    register: function(key, callback, description) {
        this.registered[key] = { callback, description };
    },
    
    init: function() {
        document.addEventListener('keydown', (e) => {
            const shortcut = `${e.ctrlKey || e.metaKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
            
            if (this.registered[shortcut]) {
                e.preventDefault();
                this.registered[shortcut].callback();
            }
        });
    }
};

// ============================================
// Theme Manager
// ============================================

VCAi.theme = {
    current: 'light',
    
    set: function(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        this.current = themeName;
        VCAi.storage.set('theme', themeName);
    },
    
    toggle: function() {
        const newTheme = this.current === 'light' ? 'dark' : 'light';
        this.set(newTheme);
    },
    
    init: function() {
        const saved = VCAi.storage.get('theme') || 'light';
        this.set(saved);
    }
};

// ============================================
// Lazy Loading Image Handler
// ============================================

VCAi.lazyLoad = {
    init: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

// ============================================
// Initialize Advanced Features
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    VCAi.advanced.tooltipManager.init();
    VCAi.analyticsAdvanced.trackUserJourney();
    VCAi.shortcuts.init();
    VCAi.theme.init();
    VCAi.lazyLoad.init();
    
    // Register useful shortcuts
    VCAi.shortcuts.register('ctrl+/', () => {
        VCAi.notifications.info('Shortcuts Coming Soon!');
    }, 'Show shortcuts help');
});

VCAi.logger.log('✅ Advanced features loaded');
