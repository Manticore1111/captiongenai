document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check credentials
        if (email === 'mofik.kalinci@hotmail.com' && password === 'cerberus123') {
            // Successful login
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'admin-panel.html';
            }, 2000);
        } else {
            showMessage('Invalid email or password.', 'error');
        }
    });

    function showMessage(text, type) {
        loginMessage.textContent = text;
        loginMessage.className = `message ${type}`;
        loginMessage.style.display = 'block';
    }
});