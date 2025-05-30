document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutBtn = document.getElementById("logout-btn");

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("loggedInUser", JSON.stringify({ email }));
          window.location.href = "home.html";
        } else {
          alert(data.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }

  // SIGN UP
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      try {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Signup successful. Please log in.");
          window.location.href = "index.html";
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  }

  // REDIRECT IF NOT LOGGED IN
  if (window.location.pathname.includes("home.html")) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "index.html";
    }
  }
});
