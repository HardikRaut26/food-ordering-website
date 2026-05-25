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
});
