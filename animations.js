// TokInvoice Interactive Animations

document.addEventListener('DOMContentLoaded', function() {
    // Journey Tab Switching
    const journeyTabs = document.querySelectorAll('.journey-tab');
    const borrowerJourney = document.getElementById('borrower-journey');
    const lenderJourney = document.getElementById('lender-journey');

    journeyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            journeyTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            const journey = this.dataset.journey;

            if (journey === 'borrower') {
                borrowerJourney.classList.remove('hidden');
                lenderJourney.classList.add('hidden');
                // Restart animations
                restartAnimations(borrowerJourney);
            } else {
                lenderJourney.classList.remove('hidden');
                borrowerJourney.classList.add('hidden');
                // Restart animations
                restartAnimations(lenderJourney);
            }
        });
    });

    // Restart CSS animations by removing and re-adding elements
    function restartAnimations(container) {
        const steps = container.querySelectorAll('.journey-step');
        const connectors = container.querySelectorAll('.journey-connector');
        
        steps.forEach(step => {
            step.style.animation = 'none';
            step.offsetHeight; // Trigger reflow
            step.style.animation = null;
        });

        connectors.forEach(conn => {
            const line = conn.querySelector('.connector-line');
            const dot = conn.querySelector('.connector-dot');
            if (line) {
                line.style.animation = 'none';
                line.offsetHeight;
                line.style.animation = null;
            }
            if (dot) {
                dot.style.animation = 'none';
                dot.offsetHeight;
                dot.style.animation = null;
            }
        });
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // For journey sections, restart animations
                if (entry.target.classList.contains('journey-container')) {
                    restartAnimations(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.journey-container, .flow-animation').forEach(el => {
        animateOnScroll.observe(el);
    });

    // Add hover effects to flow entities
    const flowEntities = document.querySelectorAll('.flow-entity');
    flowEntities.forEach(entity => {
        entity.addEventListener('mouseenter', function() {
            this.querySelector('.entity-avatar').style.transform = 'scale(1.15) rotate(5deg)';
        });
        entity.addEventListener('mouseleave', function() {
            this.querySelector('.entity-avatar').style.transform = '';
        });
    });

    // Pause/resume flow animations on hover
    const flowAnimations = document.querySelectorAll('.flow-animation');
    flowAnimations.forEach(flow => {
        flow.addEventListener('mouseenter', function() {
            const packets = this.querySelectorAll('.flow-packet');
            packets.forEach(p => p.style.animationPlayState = 'paused');
        });
        flow.addEventListener('mouseleave', function() {
            const packets = this.querySelectorAll('.flow-packet');
            packets.forEach(p => p.style.animationPlayState = 'running');
        });
    });

    // Add click-to-highlight on journey steps
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        step.addEventListener('click', function() {
            // Remove highlight from siblings
            const siblings = this.parentElement.querySelectorAll('.journey-step');
            siblings.forEach(s => s.classList.remove('highlighted'));
            // Add highlight to clicked
            this.classList.add('highlighted');
            
            // Pulse effect
            const icon = this.querySelector('.step-icon');
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

