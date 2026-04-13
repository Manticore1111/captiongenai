// Chat Widget JavaScript
(function() {
    // Inject CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'chat-widget.css';
    document.head.appendChild(cssLink);

    // Create widget HTML
    const widgetHTML = `
        <div class="chat-widget" id="chatWidget">
            <div class="chat-widget-header" id="chatWidgetHeader">
                <h3>AI Chat Assist</h3>
                <button class="chat-widget-close" id="chatWidgetClose">&times;</button>
            </div>
            <div class="chat-widget-messages" id="chatWidgetMessages">
                <div class="chat-widget-message ai">
                    <div class="chat-widget-avatar">AI</div>
                    <div class="chat-widget-content">
                        <p>Hoi! Ik ben je AI-assistent. Hoe kan ik helpen met je captions vandaag?</p>
                    </div>
                </div>
            </div>
            <div class="chat-widget-input-area">
                <input type="text" class="chat-widget-input" id="chatWidgetInput" placeholder="Typ je vraag..." maxlength="500">
                <button class="chat-widget-send" id="chatWidgetSend">Verstuur</button>
            </div>
        </div>
        <button class="chat-widget-toggle" id="chatWidgetToggle">💬</button>
    `;

    // Inject HTML
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Get elements
    const widget = document.getElementById('chatWidget');
    const toggle = document.getElementById('chatWidgetToggle');
    const close = document.getElementById('chatWidgetClose');
    const input = document.getElementById('chatWidgetInput');
    const send = document.getElementById('chatWidgetSend');
    const messages = document.getElementById('chatWidgetMessages');
    const header = document.getElementById('chatWidgetHeader');

    // Slimmere AI responses
    function getSmartResponse(userMsg) {
        const msg = userMsg.toLowerCase();
        if (msg.includes('tiktok')) {
            return "Voor TikTok werkt een korte, opvallende eerste zin goed. Gebruik trending hashtags en wees creatief!";
        }
        if (msg.includes('instagram')) {
            return "Instagram captions doen het goed met een persoonlijke touch en relevante hashtags. Wil je een voorbeeld?";
        }
        if (msg.includes('linkedin')) {
            return "LinkedIn vraagt om een professionele toon. Deel waardevolle inzichten of tips voor je netwerk.";
        }
        if (msg.includes('hashtag')) {
            return "Gebruik maximaal 5-10 relevante hashtags per post. Wil je suggesties voor jouw onderwerp?";
        }
        if (msg.includes('call to action') || msg.includes('cta')) {
            return "Een goede call-to-action is bijvoorbeeld: 'Wat vind jij?' of 'Laat je reactie achter!'";
        }
        if (msg.includes('idee') || msg.includes('inspiratie')) {
            return "Vertel me je onderwerp of doelgroep, dan geef ik je een creatieve caption!";
        }
        if (msg.includes('plan') || msg.includes('kalender')) {
            return "Wil je een contentkalender maken? Ik kan je helpen met een weekschema of post-ideeën.";
        }
        if (msg.includes('emojis') || msg.includes('emoji')) {
            return "Emojis maken je caption levendiger! Gebruik ze spaarzaam en passend bij je boodschap.";
        }
        if (msg.includes('tips')) {
            return "Mijn beste tip: wees consistent, test verschillende stijlen en analyseer wat werkt voor jouw publiek.";
        }
        if (msg.includes('bedankt') || msg.includes('dank')) {
            return "Graag gedaan! Heb je nog meer vragen over captions of content?";
        }
        if (msg.includes('rekenmachine')) {
            return "Je kunt de rekenmachine linksonder openen voor snelle berekeningen!";
        }
        // fallback: random tip
        const fallback = [
            "Dat klinkt als een goed idee! Probeer hashtags toe te voegen zoals #viral en #content om meer bereik te krijgen.",
            "Voor TikTok captions raad ik aan om de eerste zin intrigerend te maken. Wat is je onderwerp?",
            "Instagram Stories werken goed met korte, pakkende teksten. Wil je een voorbeeld?",
            "LinkedIn posts doen het beter met professionele taal. Focus op waarde voor je netwerk.",
            "Een goede call-to-action aan het eind kan engagement boosten. Bijvoorbeeld: 'Wat vind jij?'",
            "Trends veranderen snel. Check altijd de laatste hashtags voordat je post.",
            "Consistent posten is key! Plan je content voor de hele week.",
            "Gebruik emojis om je captions levendiger te maken, maar niet te veel.",
            "A/B test verschillende captions om te zien wat werkt voor jouw publiek.",
            "Vertel een verhaal in je caption om mensen langer vast te houden."
        ];
        return fallback[Math.floor(Math.random() * fallback.length)];
    }

    // Toggle widget
    toggle.addEventListener('click', () => {
        widget.classList.toggle('open');
        if (widget.classList.contains('open')) {
            input.focus();
        }
    });

    close.addEventListener('click', () => {
        widget.classList.remove('open');
    });

    // Add message function
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-widget-message ${isUser ? 'user' : 'ai'}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'chat-widget-avatar';
        avatarDiv.textContent = isUser ? 'Jij' : 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chat-widget-content';
        const p = document.createElement('p');
        p.textContent = content;
        contentDiv.appendChild(p);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messages.appendChild(messageDiv);

        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
    }


    // Send message
    function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        addMessage(message, true);
        input.value = '';

        // Simuleer AI response met eenvoudige keyword-detectie
        setTimeout(() => {
            const response = getSmartResponse(message);
            addMessage(response);
        }, 800 + Math.random() * 1200);
    }

    // Event listeners
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Make widget draggable
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let widgetStartX = 0;
    let widgetStartY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = widget.getBoundingClientRect();
        widgetStartX = rect.left;
        widgetStartY = rect.top;
        widget.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        const newLeft = widgetStartX + deltaX;
        const newTop = widgetStartY + deltaY;

        // Keep widget within viewport
        const maxLeft = window.innerWidth - widget.offsetWidth;
        const maxTop = window.innerHeight - widget.offsetHeight;

        widget.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        widget.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            widget.style.cursor = 'default';
        }
    });

    // Prevent text selection during drag
    header.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });

})();