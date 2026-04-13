document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('userRegisterForm');
    const registerMessage = document.getElementById('userRegisterMessage');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        if (name && email && password) {
            try {
                // Stuur registratie naar de server
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save lokaal
                    localStorage.setItem('userRegistered', 'true');
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('token', data.token);
                    
                    showMessage('Registration successful! You can now login. Check your email for confirmation! 📧', 'success');
                    setTimeout(() => {
                        window.location.href = 'user-login.html';
                    }, 2000);
                } else {
                    showMessage(data.error || 'Registration failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Connection error. Make sure the server is running!', 'error');
            }
        } else {
            showMessage('Please fill in all fields.', 'error');
        }
    });

    function showMessage(text, type) {
        registerMessage.textContent = text;
        registerMessage.className = `message ${type}`;
        registerMessage.style.display = 'block';
    }
});