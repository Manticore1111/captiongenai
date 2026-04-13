document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('userLoginForm');
    const loginMessage = document.getElementById('userLoginMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        // Simulate login check (in real app, this would be server-side)
        if (email && password) {
            // For demo, accept any email/password
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 2000);
        } else {
            showMessage('Please enter email and password.', 'error');
        }
    });

    function showMessage(text, type) {
        loginMessage.textContent = text;
        loginMessage.className = `message ${type}`;
        loginMessage.style.display = 'block';
    }
});