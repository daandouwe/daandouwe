// Turnstile success handler – keeps global name for the widget callback.
window.onTurnstileSuccess = function onTurnstileSuccess(token) {
    // Reveal contact info
    const info = document.getElementById("contact-info");
    if (info) info.hidden = false;
  
    // Hide the Turnstile widget after success (optional)
    const widget = document.querySelector(".cf-turnstile");
    if (widget) widget.style.display = "none";
  
    // If you want to verify the token server-side, POST `token` to your backend here.
    // fetch('/api/verify-turnstile', { method: 'POST', body: JSON.stringify({ token }) });
  };
  
  // Progressive enhancement: ensure the contact block stays hidden until JS loads.
  document.addEventListener("DOMContentLoaded", () => {
    const info = document.getElementById("contact-info");
    if (info && !info.hasAttribute("hidden")) info.hidden = true;
  });