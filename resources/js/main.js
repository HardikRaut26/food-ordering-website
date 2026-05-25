document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Sticky Navigation (Glassmorphic)
    // ----------------------------------------------------
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        const handleScroll = () => {
            // Add sticky class when scrolling past 80px (about navbar height)
            if (window.scrollY > 80) {
                nav.classList.add('sticky');
            } else {
                nav.classList.remove('sticky');
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        // Run once on load to handle refreshed page scroll states
        handleScroll();
    }

    // ----------------------------------------------------
    // Mobile Navigation Toggle
    // ----------------------------------------------------
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.contains('nav-open');
            if (isOpen) {
                mainNav.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // re-enable scroll
            } else {
                mainNav.classList.add('nav-open');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; // prevent scrolling main body
            }
        });
        
        // Close menu when clicking links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ----------------------------------------------------
    // Smooth Scroll behavior for standard Anchor Links
    // ----------------------------------------------------
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip empty links or single hashes
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Get navbar height to offset scroll
                const navHeight = nav ? nav.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (navHeight > 0 ? navHeight - 10 : 70);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without causing abrupt jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // ----------------------------------------------------
    // Features Section Carousel
    // ----------------------------------------------------
    const featuresContainer = document.querySelector('.features-carousel-container');
    const featuresGrid = document.querySelector('.features-grid');
    const featureCards = document.querySelectorAll('.feature-card');
    const featuresPrevBtn = document.querySelector('.features-carousel-btn.prev-btn');
    const featuresNextBtn = document.querySelector('.features-carousel-btn.next-btn');
    const featuresDotsContainer = document.querySelector('.features-carousel-dots');
    
    if (featuresGrid && featureCards.length > 0 && featuresPrevBtn && featuresNextBtn && featuresDotsContainer) {
        let currentIdx = 0;
        let slideInterval = null;
        
        // Helper to get active visible cards from CSS Variable
        const getVisibleCardsCount = () => {
            return parseInt(getComputedStyle(featuresGrid).getPropertyValue('--visible-cards')) || 3;
        };
        
        // Helper to get max index
        const getMaxIdx = () => {
            return Math.max(0, featureCards.length - getVisibleCardsCount());
        };
        
        // Render pagination dots dynamically
        const renderDots = () => {
            featuresDotsContainer.innerHTML = '';
            const maxIdx = getMaxIdx();
            const totalDots = maxIdx + 1;
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentIdx) dot.classList.add('active');
                dot.setAttribute('data-slide', i);
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoSlide();
                });
                
                featuresDotsContainer.appendChild(dot);
            }
        };
        
        // Go to specific slide index
        const goToSlide = (idx) => {
            const maxIdx = getMaxIdx();
            currentIdx = Math.min(Math.max(0, idx), maxIdx);
            
            // Calculate translation width
            const cardWidth = featureCards[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(featuresGrid).gap) || 32;
            const translateOffset = currentIdx * (cardWidth + gap);
            
            featuresGrid.style.transform = `translateX(-${translateOffset}px)`;
            
            // Update active dot
            const dots = featuresDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Update buttons disable state
            featuresPrevBtn.disabled = currentIdx === 0;
            featuresNextBtn.disabled = currentIdx === maxIdx;
        };
        
        // Event Listeners for Nav buttons
        featuresPrevBtn.addEventListener('click', () => {
            if (currentIdx > 0) {
                goToSlide(currentIdx - 1);
                resetAutoSlide();
            }
        });
        
        featuresNextBtn.addEventListener('click', () => {
            const maxIdx = getMaxIdx();
            if (currentIdx < maxIdx) {
                goToSlide(currentIdx + 1);
                resetAutoSlide();
            }
        });
        
        // Auto sliding functionality
        const startAutoSlide = () => {
            stopAutoSlide();
            slideInterval = setInterval(() => {
                const maxIdx = getMaxIdx();
                if (currentIdx >= maxIdx) {
                    goToSlide(0); // wrap around
                } else {
                    goToSlide(currentIdx + 1);
                }
            }, 3000);
        };
        
        const stopAutoSlide = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        };
        
        const resetAutoSlide = () => {
            startAutoSlide();
        };
        
        // Pause auto-sliding on hover
        featuresContainer.addEventListener('mouseenter', stopAutoSlide);
        featuresContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Recalculate slider alignment on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Adjust index if out of bounds on resize
                const maxIdx = getMaxIdx();
                if (currentIdx > maxIdx) {
                    currentIdx = maxIdx;
                }
                renderDots();
                goToSlide(currentIdx);
            }, 100);
        });
        
        // Initialize
        renderDots();
        goToSlide(0);
        startAutoSlide();
    }
});
