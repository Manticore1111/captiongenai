document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('userLoggedIn')) {
        window.location.href = 'user-login.html';
        return;
    }

    // Load user data
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

    document.getElementById('userGreeting').textContent = `Hello, ${userName}!`;

    // Simulate loading stats
    loadUserStats();
});

function loadUserStats() {
    // Fake data
    document.getElementById('userGenerations').textContent = Math.floor(Math.random() * 50) + 1;
    document.getElementById('userSubscription').textContent = Math.random() > 0.5 ? 'Premium' : 'Free';
    document.getElementById('userCreated').textContent = new Date().toLocaleDateString();
}

function userLogout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully!');
    window.location.href = 'index.html';
}