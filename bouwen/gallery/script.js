// Gallery JavaScript - Handles gallery grid generation, lightbox, and navigation
document.addEventListener('DOMContentLoaded', function() {
    
    // Gallery images array - all images in numerical order
    const images = [
        '../images/1.jpeg',
        '../images/2.jpeg',
        '../images/3.jpeg',
        '../images/4.jpeg',
        '../images/5.jpeg',
        '../images/6.jpeg',
        '../images/7.jpeg',
        '../images/8.jpeg',
        '../images/9.jpeg',
        '../images/10.jpeg',
        '../images/11.jpeg',
        '../images/12.jpeg',
        '../images/13.jpeg',
        '../images/14.jpeg',
        '../images/15.jpeg',
        '../images/16.jpeg',
        '../images/17.jpeg',
        '../images/18.jpeg',
        '../images/19.jpeg',
        '../images/20.jpeg',
        '../images/21.jpeg',
        '../images/22.jpeg',
        '../images/23.jpeg',
        '../images/24.jpeg',
        '../images/25.jpeg',
        '../images/26.jpeg',
        '../images/27.jpeg',
        '../images/28.jpeg',
        '../images/29.jpeg',
        '../images/30.jpeg',
        '../images/31.jpeg',
        '../images/32.jpeg',
        '../images/33.jpeg',
        '../images/34.jpeg',
        '../images/35.jpeg',
        '../images/36.jpeg'
    ];

    // Gallery grid generation
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (galleryGrid) {
        // Create gallery items for all images
        images.forEach((imageSrc, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Portfolio image ${index + 1}`;
            img.loading = 'lazy'; // Lazy loading for performance
            
            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => openLightbox(index));
            galleryGrid.appendChild(galleryItem);
        });
    }

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;

    // Lightbox functions
    function openLightbox(index) {
        if (lightbox && lightboxImage) {
            currentLightboxIndex = index;
            lightboxImage.src = images[index];
            lightboxImage.alt = `Portfolio image ${index + 1}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    function showPrevImage() {
        // Loop to the last image if at the beginning
        currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : images.length - 1;
        if (lightboxImage) {
            lightboxImage.src = images[currentLightboxIndex];
            lightboxImage.alt = `Portfolio image ${currentLightboxIndex + 1}`;
        }
    }

    function showNextImage() {
        // Loop to the first image if at the end
        currentLightboxIndex = currentLightboxIndex < images.length - 1 ? currentLightboxIndex + 1 : 0;
        if (lightboxImage) {
            lightboxImage.src = images[currentLightboxIndex];
            lightboxImage.alt = `Portfolio image ${currentLightboxIndex + 1}`;
        }
    }

    // Event listeners for lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });

    // Dropdown menu functionality (shared with main site)
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
            if (dropdownContent && dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                if (dropdownArrow) {
                    dropdownArrow.classList.remove('flipped');
                }
            }
        });
    }

    // Smooth scroll for anchor links in dropdown (for Contact link)
    const dropdownLinks = document.querySelectorAll('.dropdown-content a[href*="#"]');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's linking to the parent directory with a hash
            if (href.includes('../#')) {
                // Let the browser handle the navigation to parent with hash
                return;
            }
            
            // For same-page anchors (shouldn't be any in gallery, but just in case)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Close the dropdown
                    if (dropdownContent) {
                        dropdownContent.classList.remove('show');
                    }
                    if (dropdownArrow) {
                        dropdownArrow.classList.remove('flipped');
                    }
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Touch gesture support for mobile lightbox navigation
let touchStartX = null;
let touchEndX = null;

document.addEventListener('touchstart', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        touchStartX = e.touches[0].clientX;
    }
}, {passive: true});

document.addEventListener('touchend', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active') && touchStartX !== null) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }
}, {passive: true});

function handleSwipe() {
    if (touchStartX === null || touchEndX === null) return;
    
    const swipeThreshold = 50; // Minimum distance for a swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - show next image
            document.getElementById('lightboxNext')?.click();
        } else {
            // Swiped right - show previous image
            document.getElementById('lightboxPrev')?.click();
        }
    }
    
    // Reset values
    touchStartX = null;
    touchEndX = null;
}