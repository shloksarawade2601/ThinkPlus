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

    // The URL the user lands on AFTER they click the email confirmation link.
    // This is your live Vercel domain + the page they should see when logged in.
    const POST_CONFIRMATION_URL = 'https://think-plus-ten.vercel.app/dashboard.html'; 

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This URL is embedded in the confirmation email link by Supabase
        emailRedirectTo: POST_CONFIRMATION_URL,
      },
    });

    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      // Immediate redirect for user experience: sends them to the "Check your email" message.
      // This page is hosted on GitHub Pages.
      alert("Check your email to confirm your signup!");
      window.location.href = "https://shloksarawade2601.github.io/ThinkPlus/public/email_confirmation.html";
    }
  });
}