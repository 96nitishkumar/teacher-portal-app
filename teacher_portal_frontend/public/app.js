document.addEventListener("DOMContentLoaded", function() {
  const url = 'http://127.0.0.1:3000'
  const form = document.getElementById('form-submit');
  const loginButton = document.getElementById('login-btn');

  loginButton.addEventListener('click', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    document.getElementById('username-error').innerText = '';
    document.getElementById('password-error').innerText = '';

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(username)) {
      document.getElementById('username-error').innerText = 'Invalid email format';
      return;
    }

    // Validate strong password
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      document.getElementById('password-error').innerText = 'Weak password. Use 8+ chars with uppercase, lowercase, number, and symbol.';
      return;
    }

    // If validation passes, submit the form data to the backend
    fetch(`${url}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem('authToken', data.token);

        // Redirect to the home.html page
        window.location.href = 'home.html';
      } else {
        document.getElementById('username-error').innerText = 'Invalid email or password';
      }
    })
    .catch(error => console.error('Error:', error));
  });
});
