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


  // Smooth scroll fix for mobile dropdown menu
document.addEventListener('DOMContentLoaded', function() {
  // Get all anchor links in the dropdown that point to sections on the same page
  const dropdownLinks = document.querySelectorAll('.dropdown-content a[href^="#"]');
  
  dropdownLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent default anchor behavior
          
          // Get the target section
          const targetId = this.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
              // Close the dropdown menu first
              const dropdownContent = document.querySelector('.dropdown-content');
              if (dropdownContent) {
                  dropdownContent.classList.remove('show');
              }
              
              // Smooth scroll to the target section
              targetSection.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
              
              // Update URL without jumping
              if (history.pushState) {
                  history.pushState(null, null, targetId);
              }
          }
      });
  });
  
  // Also handle the case where Contact link might be a full URL with hash
  const contactLinks = document.querySelectorAll('.dropdown-content a[href*="#contact"]');
  
  contactLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          // Check if this links to the same page
          const linkUrl = new URL(this.href, window.location.href);
          
          if (linkUrl.pathname === window.location.pathname && linkUrl.hash) {
              e.preventDefault();
              
              // Get the target section
              const targetSection = document.querySelector(linkUrl.hash);
              
              if (targetSection) {
                  // Close the dropdown menu
                  const dropdownContent = document.querySelector('.dropdown-content');
                  if (dropdownContent) {
                      dropdownContent.classList.remove('show');
                  }
                  
                  // Calculate offset for fixed header if needed
                  const offset = 80; // Adjust this value based on your header height
                  const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                  
                  // Smooth scroll with offset
                  window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                  });
                  
                  // Update URL
                  if (history.pushState) {
                      history.pushState(null, null, linkUrl.hash);
                  }
              }
          }
      });
  });
});

// Additional fix for iOS Safari
if ('ontouchstart' in window) {
  document.addEventListener('touchstart', function() {}, {passive: true});
}