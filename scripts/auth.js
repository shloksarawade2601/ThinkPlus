// Auth.js - Supabase Login + Signup Integration
// ---------------------------------------------

// 🟢 Initialize Supabase client
const SUPABASE_URL = "https://mqosqiucfkrmscfkacto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb3NxaXVjZmtybXNjZmthY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTQ4MDMsImV4cCI6MjA3NTQzMDgwM30.b6PYbitm8uUcQPd_Yc1qGbV6WGfZSQlDI_RxrHjzZC0";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🟢 Handle Login Form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      console.log("Login successful:", data);
      window.location.href = "dashboard.html";
    }
  });
}

// 🟣 Handle Signup Form
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      alert("Check your email to confirm your signup!");
      window.location.href = "login.html";
    }
  });
}
