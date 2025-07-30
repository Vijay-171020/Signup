const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('loginMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            messageDiv.textContent = '✅ Login successful!';
            messageDiv.className = 'message success';
            form.reset();

            setTimeout(() => {
                window.location.href = '/welcome.html'; // Adjust this path if needed
            }, 1000);

        } else {
            messageDiv.textContent = '❌ ' + (data.error || 'Login failed');
            messageDiv.className = 'message error';
        }
    } catch (err) {
        messageDiv.textContent = '❌ Server error';
        messageDiv.className = 'message error';
    }
});
