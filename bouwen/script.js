// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // =====================================
    // 1. IMAGE CAROUSEL (loads from Cloudinary)
    // =====================================
    let images = ['logo-large.svg']; // Start with logo, images loaded async
    let currentIndex = 0;
    const imgElement = document.getElementById('rotatingImage');

    // Fetch images from Cloudinary via API
    async function loadImages() {
        try {
            const response = await fetch('/api/images');
            if (response.ok) {
                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    // Add Cloudinary images after the logo
                    images = ['logo-large.svg', ...data.images.map(img => img.url)];
                }
            }
        } catch (error) {
            console.error('Failed to load images from Cloudinary:', error);
        }
    }

    function rotateImage() {
        if (imgElement) {
            imgElement.src = images[currentIndex];
            currentIndex = (currentIndex + 1) % images.length;

            // First image waits 6 seconds, others wait 1 second
            const delay = currentIndex === 1 ? 6000 : 1000;
            setTimeout(rotateImage, delay);
        }
    }

    // Start carousel and make it clickable
    if (imgElement) {
        // Load images then start carousel
        loadImages().then(() => {
            rotateImage();
        });

        // Make carousel clickable to go to gallery
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', function() {
            window.location.href = 'gallery/';
        });
        imgElement.title = 'Click to view gallery';
    }

    // =====================================
    // 2. DROPDOWN MENU
    // =====================================
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownArrow = document.getElementById('dropdownArrow');

    if (dropdownButton && dropdownContent && dropdownArrow) {
        // Toggle dropdown on button click
        dropdownButton.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
            dropdownArrow.classList.toggle('flipped');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                dropdownArrow.classList.remove('flipped');
            }
        });
    }

    // Smooth scroll for anchor links in dropdown
    const dropdownLinks = document.querySelectorAll('.dropdown-content a[href^="#"], .dropdown-content a[href*="#"]');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's a hash link on the same page
            if (href.startsWith('#')) {
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    e.preventDefault();
                    
                    // Close dropdown
                    if (dropdownContent) {
                        dropdownContent.classList.remove('show');
                        dropdownArrow.classList.remove('flipped');
                    }
                    
                    // Smooth scroll with offset for fixed header
                    const offset = 80;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });

});

// =====================================
// TURNSTILE CALLBACK
// =====================================
function onSuccess(token) {
    const contactInfo = document.getElementById('contact-turnstile');
    const turnstileWidget = document.querySelector('.cf-turnstile');
    
    if (contactInfo) {
        contactInfo.style.display = 'block';
    }
    
    if (turnstileWidget) {
        turnstileWidget.style.display = 'none';
    }
}

// =====================================
// iOS SAFARI FIX
// =====================================
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}