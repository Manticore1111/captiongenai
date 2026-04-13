document.addEventListener('DOMContentLoaded', function() {
    loadSettings();

    const settingsForm = document.getElementById('settingsForm');
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
});

function loadSettings() {
    // Load from localStorage or set defaults
    document.getElementById('siteTitle').value = localStorage.getItem('siteTitle') || 'ViralCaption AI';
    document.getElementById('maxFreeGenerations').value = localStorage.getItem('maxFreeGenerations') || '1';
    document.getElementById('subscriptionPrice').value = localStorage.getItem('subscriptionPrice') || '2.99';
    document.getElementById('maintenanceMode').checked = localStorage.getItem('maintenanceMode') === 'true';
    document.getElementById('emailNotifications').checked = localStorage.getItem('emailNotifications') !== 'false';
}

function saveSettings() {
    // Save to localStorage
    localStorage.setItem('siteTitle', document.getElementById('siteTitle').value);
    localStorage.setItem('maxFreeGenerations', document.getElementById('maxFreeGenerations').value);
    localStorage.setItem('subscriptionPrice', document.getElementById('subscriptionPrice').value);
    localStorage.setItem('maintenanceMode', document.getElementById('maintenanceMode').checked);
    localStorage.setItem('emailNotifications', document.getElementById('emailNotifications').checked);

    showMessage('Settings saved successfully!', 'success');
}

function showMessage(text, type) {
    const message = document.getElementById('settingsMessage');
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}