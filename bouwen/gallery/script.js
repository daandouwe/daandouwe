// Gallery JavaScript - Handles gallery grid generation, lightbox, and navigation
document.addEventListener('DOMContentLoaded', function() {

    // Images loaded from Cloudinary
    let images = []; // { thumbnail, full, url }
    let currentLightboxIndex = 0;

    // DOM elements
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Fetch images from Cloudinary and build gallery
    async function loadGallery() {
        try {
            const response = await fetch('/api/images');
            if (response.ok) {
                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    images = data.images;
                    buildGalleryGrid();
                }
            }
        } catch (error) {
            console.error('Failed to load images from Cloudinary:', error);
        }
    }

    function buildGalleryGrid() {
        if (!galleryGrid) return;

        // Clear existing content
        galleryGrid.innerHTML = '';

        // Create gallery items
        images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = image.thumbnail;
            img.alt = `Portfolio image ${index + 1}`;
            img.loading = 'lazy';

            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => openLightbox(index));
            galleryGrid.appendChild(galleryItem);
        });
    }

    // Lightbox functions
    function openLightbox(index) {
        if (lightbox && lightboxImage && images[index]) {
            currentLightboxIndex = index;
            lightboxImage.src = images[index].full;
            lightboxImage.alt = `Portfolio image ${index + 1}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    function showPrevImage() {
        if (images.length === 0) return;
        currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : images.length - 1;
        if (lightboxImage && images[currentLightboxIndex]) {
            lightboxImage.src = images[currentLightboxIndex].full;
            lightboxImage.alt = `Portfolio image ${currentLightboxIndex + 1}`;
        }
    }

    function showNextImage() {
        if (images.length === 0) return;
        currentLightboxIndex = currentLightboxIndex < images.length - 1 ? currentLightboxIndex + 1 : 0;
        if (lightboxImage && images[currentLightboxIndex]) {
            lightboxImage.src = images[currentLightboxIndex].full;
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

    // Load gallery on page load
    loadGallery();

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