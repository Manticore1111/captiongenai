document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    // Mock AI responses
    const responses = [
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

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = isUser ? 'Jij' : 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        const p = document.createElement('p');
        p.textContent = content;
        contentDiv.appendChild(p);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getRandomResponse() {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        // Simulate AI response after a short delay
        setTimeout(() => {
            const response = getRandomResponse();
            addMessage(response);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Focus input on load
    chatInput.focus();
});</content>
<parameter name="filePath">c:\Users\mofik\OneDrive\Desktop\Nieuwe map\standalone\chat.js