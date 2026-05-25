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
        
        // Auto sliding functionality (2 seconds rotation)
        const startAutoSlide = () => {
            stopAutoSlide();
            slideInterval = setInterval(() => {
                const maxIdx = getMaxIdx();
                if (currentIdx >= maxIdx) {
                    goToSlide(0); // wrap around
                } else {
                    goToSlide(currentIdx + 1);
                }
            }, 2000);
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
        
        // Continuous auto-play (no hover pause)
        
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

    // ----------------------------------------------------
    // Cities Section Carousel
    // ----------------------------------------------------
    const citiesContainer = document.querySelector('.cities-carousel-container');
    const citiesGrid = document.querySelector('.cities-grid');
    const cityCards = document.querySelectorAll('.city-card');
    const citiesPrevBtn = document.querySelector('.cities-carousel-btn.prev-btn');
    const citiesNextBtn = document.querySelector('.cities-carousel-btn.next-btn');
    const citiesDotsContainer = document.querySelector('.cities-carousel-dots');
    
    if (citiesGrid && cityCards.length > 0 && citiesPrevBtn && citiesNextBtn && citiesDotsContainer) {
        let cityIdx = 0;
        let cityInterval = null;
        
        // Helper to get active visible cards from CSS Variable
        const getVisibleCitiesCount = () => {
            return parseInt(getComputedStyle(citiesGrid).getPropertyValue('--visible-cities')) || 3;
        };
        
        // Helper to get max index
        const getMaxCityIdx = () => {
            return Math.max(0, cityCards.length - getVisibleCitiesCount());
        };
        
        // Render pagination dots dynamically
        const renderCityDots = () => {
            citiesDotsContainer.innerHTML = '';
            const maxIdx = getMaxCityIdx();
            const totalDots = maxIdx + 1;
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === cityIdx) dot.classList.add('active');
                dot.setAttribute('data-slide', i);
                
                dot.addEventListener('click', () => {
                    goToCitySlide(i);
                    resetCityAutoSlide();
                });
                
                citiesDotsContainer.appendChild(dot);
            }
        };
        
        // Go to specific slide index
        const goToCitySlide = (idx) => {
            const maxIdx = getMaxCityIdx();
            
            // Allow wrapping around infinitely
            if (idx < 0) {
                cityIdx = maxIdx;
            } else if (idx > maxIdx) {
                cityIdx = 0;
            } else {
                cityIdx = idx;
            }
            
            // Calculate translation width
            const cardWidth = cityCards[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(citiesGrid).gap) || 32;
            const translateOffset = cityIdx * (cardWidth + gap);
            
            citiesGrid.style.transform = `translateX(-${translateOffset}px)`;
            
            // Update active dot
            const dots = citiesDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === cityIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // In a truly infinite loop carousel, next/prev buttons are never disabled
            citiesPrevBtn.disabled = false;
            citiesNextBtn.disabled = false;
        };
        
        // Event Listeners for Nav buttons
        citiesPrevBtn.addEventListener('click', () => {
            goToCitySlide(cityIdx - 1);
            resetCityAutoSlide();
        });
        
        citiesNextBtn.addEventListener('click', () => {
            goToCitySlide(cityIdx + 1);
            resetCityAutoSlide();
        });
        
        // Auto sliding functionality (2 seconds rotation with infinite loop)
        const startCityAutoSlide = () => {
            stopCityAutoSlide();
            cityInterval = setInterval(() => {
                goToCitySlide(cityIdx + 1);
            }, 2000);
        };
        
        const stopCityAutoSlide = () => {
            if (cityInterval) {
                clearInterval(cityInterval);
                cityInterval = null;
            }
        };
        
        const resetCityAutoSlide = () => {
            startCityAutoSlide();
        };
        
        // Continuous auto-play (no hover pause)
        
        // Recalculate slider alignment on window resize
        let cityResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(cityResizeTimeout);
            cityResizeTimeout = setTimeout(() => {
                // Adjust index if out of bounds on resize
                const maxIdx = getMaxCityIdx();
                if (cityIdx > maxIdx) {
                    cityIdx = maxIdx;
                }
                renderCityDots();
                goToCitySlide(cityIdx);
            }, 100);
        });
        
        // Initialize
        renderCityDots();
        goToCitySlide(0);
        startCityAutoSlide();
    }

    // ----------------------------------------------------
    // Testimonials Section Carousel
    // ----------------------------------------------------
    const testimonialsContainer = document.querySelector('.testimonials-carousel-container');
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialsPrevBtn = document.querySelector('.testimonials-carousel-btn.prev-btn');
    const testimonialsNextBtn = document.querySelector('.testimonials-carousel-btn.next-btn');
    const testimonialsDotsContainer = document.querySelector('.testimonials-carousel-dots');
    
    if (testimonialsGrid && testimonialCards.length > 0 && testimonialsPrevBtn && testimonialsNextBtn && testimonialsDotsContainer) {
        let testIdx = 0;
        let testInterval = null;
        
        // Helper to get active visible cards from CSS Variable
        const getVisibleTestimonialsCount = () => {
            return parseInt(getComputedStyle(testimonialsGrid).getPropertyValue('--visible-testimonials')) || 3;
        };
        
        // Helper to get max index
        const getMaxTestIdx = () => {
            return Math.max(0, testimonialCards.length - getVisibleTestimonialsCount());
        };
        
        // Render pagination dots dynamically
        const renderTestDots = () => {
            testimonialsDotsContainer.innerHTML = '';
            const maxIdx = getMaxTestIdx();
            const totalDots = maxIdx + 1;
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === testIdx) dot.classList.add('active');
                dot.setAttribute('data-slide', i);
                
                dot.addEventListener('click', () => {
                    goToTestSlide(i);
                    resetTestAutoSlide();
                });
                
                testimonialsDotsContainer.appendChild(dot);
            }
        };
        
        // Go to specific slide index
        const goToTestSlide = (idx) => {
            const maxIdx = getMaxTestIdx();
            
            // Allow wrapping around infinitely
            if (idx < 0) {
                testIdx = maxIdx;
            } else if (idx > maxIdx) {
                testIdx = 0;
            } else {
                testIdx = idx;
            }
            
            // Calculate translation width
            const cardWidth = testimonialCards[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(testimonialsGrid).gap) || 32;
            const translateOffset = testIdx * (cardWidth + gap);
            
            testimonialsGrid.style.transform = `translateX(-${translateOffset}px)`;
            
            // Update active dot
            const dots = testimonialsDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === testIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // In a truly infinite loop carousel, next/prev buttons are never disabled
            testimonialsPrevBtn.disabled = false;
            testimonialsNextBtn.disabled = false;
        };
        
        // Event Listeners for Nav buttons
        testimonialsPrevBtn.addEventListener('click', () => {
            goToTestSlide(testIdx - 1);
            resetTestAutoSlide();
        });
        
        testimonialsNextBtn.addEventListener('click', () => {
            goToTestSlide(testIdx + 1);
            resetTestAutoSlide();
        });
        
        // Auto sliding functionality (2 seconds rotation with infinite loop)
        const startTestAutoSlide = () => {
            stopTestAutoSlide();
            testInterval = setInterval(() => {
                goToTestSlide(testIdx + 1);
            }, 2000);
        };
        
        const stopTestAutoSlide = () => {
            if (testInterval) {
                clearInterval(testInterval);
                testInterval = null;
            }
        };
        
        const resetTestAutoSlide = () => {
            startTestAutoSlide();
        };
        
        // Continuous auto-play (no hover pause)
        
        // Recalculate slider alignment on window resize
        let testResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(testResizeTimeout);
            testResizeTimeout = setTimeout(() => {
                // Adjust index if out of bounds on resize
                const maxIdx = getMaxTestIdx();
                if (testIdx > maxIdx) {
                    testIdx = maxIdx;
                }
                renderTestDots();
                goToTestSlide(testIdx);
            }, 100);
        });
        
        // Initialize
        renderTestDots();
        goToTestSlide(0);
        startTestAutoSlide();
    }

    // ----------------------------------------------------
    // Pricing Section Billing Toggle
    // ----------------------------------------------------
    const billingToggle = document.getElementById('billing-toggle');
    const billingMonthly = document.getElementById('billing-monthly');
    const billingYearly = document.getElementById('billing-yearly');
    const priceVals = document.querySelectorAll('.price-val');
    
    if (billingToggle && billingMonthly && billingYearly && priceVals.length > 0) {
        billingToggle.addEventListener('click', () => {
            const isYearly = billingToggle.classList.toggle('active');
            billingMonthly.classList.toggle('active', !isYearly);
            billingYearly.classList.toggle('active', isYearly);
            
            priceVals.forEach(val => {
                // Smooth transition fade-out and slide-up
                val.style.opacity = '0';
                val.style.transform = 'translateY(-6px)';
                
                setTimeout(() => {
                    const newPrice = isYearly ? val.getAttribute('data-yearly') : val.getAttribute('data-monthly');
                    val.textContent = `$${newPrice}`;
                    val.style.opacity = '1';
                    val.style.transform = 'translateY(0)';
                }, 150);
            });
        });
        
        // Add click listener to the labels too for better UX
        const setBillingCycle = (toYearly) => {
            const isActive = billingToggle.classList.contains('active');
            if (toYearly !== isActive) {
                billingToggle.click();
            }
        };
        
        billingMonthly.addEventListener('click', () => setBillingCycle(false));
        billingYearly.addEventListener('click', () => setBillingCycle(true));
    }
});
