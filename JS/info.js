document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = storedUsers.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "home.html";
      } else {
        alert("Invalid credentials");
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const exists = storedUsers.find(u => u.email === email);

      if (exists) {
        alert("User already exists");
      } else {
        storedUsers.push({ email, password });
        localStorage.setItem("users", JSON.stringify(storedUsers));
        alert("Sign up successful. Please log in.");
        window.location.href = "index.html";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  }

  // Redirect if not logged in
  if (window.location.pathname.includes("home.html")) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      window.location.href = "index.html";
    }
  }
});
