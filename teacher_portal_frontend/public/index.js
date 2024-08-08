document.addEventListener("DOMContentLoaded", function() {
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
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ username: username, password: password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status && data.data.token) {
          console.log(data.data.token)
          // Store the token in localStorage
          localStorage.setItem('authToken', data.data.token);
  
          // Redirect to the students page
          window.location.href = '/students';
        } else {
          console.log('Login failed:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
  