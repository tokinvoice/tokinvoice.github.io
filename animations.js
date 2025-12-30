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
            const avatar = this.querySelector('.entity-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.15) rotate(5deg)';
            }
        });
        entity.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.entity-avatar');
            if (avatar) {
                avatar.style.transform = '';
            }
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
            const siblings = this.parentElement ? this.parentElement.querySelectorAll('.journey-step') : [];
            siblings.forEach(s => s.classList.remove('highlighted'));
            // Add highlight to clicked
            this.classList.add('highlighted');
            
            // Pulse effect
            const icon = this.querySelector('.step-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            }
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

    // ========================================
    // STEP-THROUGH FLOW LOGIC
    // ========================================

    // Define the steps for each flow
    const borrowerSteps = [
        { caption: "Click NEXT to see how it works", activeNode: null, animateConnector: null },
        { caption: "📄 You submit your invoice to TokInvoice", activeNode: "supplier", animateConnector: 0 },
        { caption: "🔷 TokInvoice tokenizes your invoice on the blockchain", activeNode: "platform", animateConnector: null },
        { caption: "💵 The vault provides immediate cash back to you", activeNode: "vault", animateConnector: 1 },
        { caption: "✅ Done! You received early payment for your invoice", activeNode: "supplier", animateConnector: null }
    ];

    const lenderSteps = [
        { caption: "Click NEXT to see how it works", activeNode: null, animateConnector: null },
        { caption: "💵 You deposit capital into the lending vault", activeNode: "investor", animateConnector: 0 },
        { caption: "🏦 The vault pools investor funds", activeNode: "vault", animateConnector: null },
        { caption: "🎫 Your capital funds tokenized invoices", activeNode: "vault", animateConnector: 1 },
        { caption: "📄 Invoices are repaid by borrowers", activeNode: "invoices", animateConnector: null },
        { caption: "💰 Yield + principal flows back to you", activeNode: "invoices", animateConnector: "return" },
        { caption: "✅ Done! You earned yield from real-world invoice financing", activeNode: "investor", animateConnector: null }
    ];

    // Initialize step flows
    document.querySelectorAll('.step-flow').forEach(flow => {
        const isBorrower = flow.classList.contains('borrower-step-flow');
        const steps = isBorrower ? borrowerSteps : lenderSteps;
        const nextBtn = flow.querySelector('.step-btn-next');
        const resetBtn = flow.querySelector('.step-btn-reset');
        let currentStep = 0;

        function updateFlow(stepIndex) {
            const step = steps[stepIndex];
            flow.setAttribute('data-step', stepIndex);

            // Update caption
            const badge = flow.querySelector('.step-number-badge');
            const text = flow.querySelector('.step-text');
            badge.textContent = stepIndex;
            text.textContent = step.caption;

            // Reset all nodes and connectors
            flow.querySelectorAll('.flow-node').forEach(n => {
                n.classList.remove('active', 'completed');
            });
            flow.querySelectorAll('.flow-connector').forEach(c => {
                c.classList.remove('animating', 'completed');
            });

            // Mark previous nodes as completed
            if (isBorrower) {
                const nodeOrder = ['supplier', 'platform', 'vault'];
                for (let i = 1; i < stepIndex; i++) {
                    const nodeName = borrowerSteps[i].activeNode;
                    if (nodeName) {
                        const node = flow.querySelector(`[data-node="${nodeName}"]`);
                        if (node) node.classList.add('completed');
                    }
                    if (borrowerSteps[i].animateConnector !== null) {
                        const connectors = flow.querySelectorAll('.flow-connector');
                        if (connectors[borrowerSteps[i].animateConnector]) {
                            connectors[borrowerSteps[i].animateConnector].classList.add('completed');
                        }
                    }
                }
            } else {
                // Lender flow - now uses same index-based approach for main connectors
                const lenderConnectors = flow.querySelectorAll('.lender-main-row .flow-connector');
                const returnConnector = flow.querySelector('.lender-return');

                for (let i = 1; i < stepIndex; i++) {
                    const nodeName = lenderSteps[i].activeNode;
                    if (nodeName) {
                        const node = flow.querySelector(`[data-node="${nodeName}"]`);
                        if (node) node.classList.add('completed');
                    }
                    const connId = lenderSteps[i].animateConnector;
                    if (connId === "return" && returnConnector) {
                        returnConnector.classList.add('completed');
                    } else if (typeof connId === 'number' && lenderConnectors[connId]) {
                        lenderConnectors[connId].classList.add('completed');
                    }
                }
            }

            // Set current node as active
            if (step.activeNode) {
                const node = flow.querySelector(`[data-node="${step.activeNode}"]`);
                if (node) node.classList.add('active');
            }

            // Animate current connector
            if (step.animateConnector !== null) {
                const connectors = flow.querySelectorAll(isBorrower ? '.flow-connector' : '.lender-main-row .flow-connector');

                if (step.animateConnector === "return") {
                    const returnConn = flow.querySelector('.lender-return');
                    if (returnConn) returnConn.classList.add('animating');
                } else if (typeof step.animateConnector === 'number' && connectors[step.animateConnector]) {
                    connectors[step.animateConnector].classList.add('animating');
                }
            }

            // Build step history (previous steps shown as faded list)
            const historyContainer = flow.querySelector('.step-history');
            if (historyContainer) {
                historyContainer.innerHTML = '';
                for (let i = 1; i < stepIndex; i++) {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'step-history-item';
                    historyItem.innerHTML = `<span class="mini-badge">✓</span> ${steps[i].caption.replace(/^[^\s]+\s/, '')}`;
                    historyContainer.appendChild(historyItem);
                }
            }

            // Update button states
            resetBtn.disabled = stepIndex === 0;
            if (stepIndex >= steps.length - 1) {
                nextBtn.textContent = '✓';
                nextBtn.disabled = true;
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.disabled = false;
            }
        }

        nextBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateFlow(currentStep);
            }
        });

        resetBtn.addEventListener('click', () => {
            currentStep = 0;
            updateFlow(currentStep);
        });

        // Initialize
        updateFlow(0);
    });
});

