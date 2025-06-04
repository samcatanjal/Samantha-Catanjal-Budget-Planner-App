// Sign Up //

const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    try {
      const res = await fetch('https://pocket-friendly-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('User created successfully! Please sign in.');

        // Remove any stored token/email (optional, but recommended here)
        localStorage.removeItem('token');
        localStorage.removeItem('email');

        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login.html'; // Adjust this path to your actual login page
        }, 1500);
      } else {
        if (data.message === 'Email already in use' || data.message === 'User already exists') {
          alert('This email is already registered. Please login instead.');
        } else {
          alert(data.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during signup');
    }
  });
}


// Login //

const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      const res = await fetch('https://pocket-friendly-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        window.location.href = '/index.html';
      } else {
        // Specific error handling
        if (data.message === 'User not found') {
          alert('No account found with this email. Please sign up first.');
        } else if (data.message === 'Invalid credentials') {
          alert('Incorrect password. Please try again.');
        } else {
          alert(data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login');
    }
  });
}

// Main //

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  if (!token) {
    return; 
  }

  window.location.href = '/home.html';
});
