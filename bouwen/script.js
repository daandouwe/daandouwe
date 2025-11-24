// Image carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Image carousel setup
    const images = [
        'logo-large.svg',
        'images/1.jpeg',
        'images/2.jpeg',
        'images/3.jpeg',
        'images/4.jpeg',
        'images/5.jpeg',
        'images/6.jpeg',
        'images/7.jpeg',
        'images/8.jpeg',
        'images/9.jpeg',
        'images/10.jpeg',
        'images/11.jpeg',
        'images/12.jpeg',
        'images/13.jpeg',
        'images/14.jpeg',
        'images/15.jpeg',
        'images/16.jpeg',
        'images/17.jpeg',
        'images/18.jpeg',
        'images/19.jpeg',
        'images/20.jpeg',
        'images/21.jpeg',
        'images/22.jpeg',
        'images/23.jpeg',
        'images/24.jpeg',
        'images/25.jpeg',
        'images/26.jpeg',
        'images/27.jpeg',
        'images/28.jpeg',
        'images/29.jpeg',
        'images/30.jpeg',
        'images/31.jpeg',
        'images/32.jpeg',
        'images/33.jpeg',
        'images/34.jpeg',
        'images/35.jpeg',
        'images/36.jpeg',
    ];

    let currentIndex = 0;
    const imgElement = document.getElementById('rotatingImage');

    function rotateImage() {
        if (imgElement) {
            imgElement.src = images[currentIndex];
            currentIndex = (currentIndex + 1) % images.length;
            
            // If we just showed the first image, wait 6 seconds. Otherwise wait 1 second.
            const delay = currentIndex === 1 ? 6000 : 1000;
            setTimeout(rotateImage, delay);
        }
    }

    // Start image rotation if element exists
    if (imgElement) {
        rotateImage();
        
        // Make the image carousel clickable to go to gallery
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', function() {
            window.location.href = 'gallery/';
        });
        
        // Optional: Add title attribute for better UX
        imgElement.title = 'Click to view gallery';
    }

    // Dropdown menu functionality
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownArrow = document.getElementById('dropdownArrow');

    if (dropdownButton && dropdownContent && dropdownArrow) {
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

    // Smooth scroll fix for mobile dropdown menu
    const dropdownLinks = document.querySelectorAll('.dropdown-content a[href^="#"], .dropdown-content a[href*="#"]');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's a hash link on the same page
            if (href.startsWith('#') || (this.href && new URL(this.href, window.location.href).pathname === window.location.pathname)) {
                const hash = href.startsWith('#') ? href : new URL(this.href, window.location.href).hash;
                const targetSection = document.querySelector(hash);
                
                if (targetSection) {
                    e.preventDefault();
                    
                    // Close the dropdown menu
                    if (dropdownContent) {
                        dropdownContent.classList.remove('show');
                        dropdownArrow.classList.remove('flipped');
                    }
                    
                    // Calculate offset for fixed header
                    const offset = 80;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    // Smooth scroll with offset
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL
                    if (history.pushState) {
                        history.pushState(null, null, hash);
                    }
                }
            }
        });
    });
});

// Turnstile callback function (needs to be global for the widget)
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

// Additional fix for iOS Safari smooth scrolling
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}