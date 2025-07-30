const form = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');
const submitBtn = form.querySelector('button');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        dob: document.getElementById('dob').value,
        password: document.getElementById('password').value
    };

    try {
        const res = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (res.ok) {
            messageDiv.textContent = '✅ Signup successful!';
            messageDiv.className = 'message success';
            form.reset();
        } else {
            messageDiv.textContent = '❌ ' + (data.error || 'Something went wrong');
            messageDiv.className = 'message error';
        }
    } catch (err) {
        messageDiv.textContent = '❌ Error connecting to server';
        messageDiv.className = 'message error';
    } finally {
        submitBtn.disabled = false;
    }
});
