// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // =====================================
    // 1. IMAGE CAROUSEL
    // =====================================
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
            
            // First image waits 6 seconds, others wait 1 second
            const delay = currentIndex === 1 ? 6000 : 1000;
            setTimeout(rotateImage, delay);
        }
    }

    // Start carousel and make it clickable
    if (imgElement) {
        rotateImage();
        
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

    // =====================================
    // 3. QR CODE GENERATION & CLICK HANDLER
    // =====================================
    const qrElement = document.getElementById('qrcode');
    
    if (qrElement) {
        // Generate QR code
        try {
            new QRCode(qrElement, {
                text: "https://daandouwe.com/daandouwe.vcf",
                width: 120,
                height: 120,
                colorDark: "#063B40",
                colorLight: "#F7ECD6",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
        }

        // Make QR clickable on Apple devices
        const isAppleDevice = /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
        
        if (isAppleDevice) {
            // Show hint text
            const hint = document.getElementById('qrHint');
            if (hint) {
                hint.style.display = 'block';
            }
            
            // Make QR code clickable
            qrElement.classList.add('clickable');
            
            // Add click handler
            qrElement.addEventListener('click', function() {
                // Try to go to card page or download vCard
                window.location.href = 'daandouwe.vcf';
            });
        }
    }
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