document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading stats
    loadStats();
});

function loadStats() {
    // In a real app, this would fetch from a server
    // For demo, we'll use fake data
    document.getElementById('totalUsers').textContent = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('generationsToday').textContent = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('revenue').textContent = '€' + (Math.floor(Math.random() * 10000) + 1000);
    document.getElementById('activeSessions').textContent = Math.floor(Math.random() * 200) + 50;

    loadActivityLog();
}

function loadActivityLog() {
    const activityLog = document.getElementById('activityLog');
    activityLog.innerHTML = '';

    const activities = [
        { user: 'john@example.com', action: 'Generated captions for TikTok', time: '2 min ago' },
        { user: 'jane@example.com', action: 'Logged in', time: '5 min ago' },
        { user: 'bob@example.com', action: 'Generated captions for Instagram', time: '8 min ago' },
        { user: 'alice@example.com', action: 'Viewed dashboard', time: '12 min ago' },
        { user: 'charlie@example.com', action: 'Generated captions for YouTube', time: '15 min ago' }
    ];

    activities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <strong>${activity.user}</strong> ${activity.action}
            <div class="time">${activity.time}</div>
        `;
        activityLog.appendChild(div);
    });
}

function logout() {
    // In a real app, clear session/token
    alert('Logged out successfully!');
    window.location.href = 'admin-login.html';
}

function manageUsers() {
    window.location.href = 'manage-users.html';
}

function viewReports() {
    window.location.href = 'view-reports.html';
}

function systemSettings() {
    window.location.href = 'system-settings.html';
}