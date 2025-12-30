// TokInvoice Interactive Animations - Using GSAP for cross-browser support

document.addEventListener('DOMContentLoaded', function() {
    // Journey Tab Switching
    const journeyTabs = document.querySelectorAll('.journey-tab');
    const borrowerJourney = document.getElementById('borrower-journey');
    const lenderJourney = document.getElementById('lender-journey');

    journeyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            journeyTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const journey = this.dataset.journey;
            if (journey === 'borrower') {
                borrowerJourney.classList.remove('hidden');
                lenderJourney.classList.add('hidden');
            } else {
                lenderJourney.classList.remove('hidden');
                borrowerJourney.classList.add('hidden');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // STEP-THROUGH FLOW LOGIC WITH GSAP
    // ========================================

    // GSAP animation helper functions
    function animatePacket(packet, fromX, toX, duration = 1) {
        gsap.set(packet, { opacity: 1, x: fromX });
        return gsap.to(packet, { x: toX, duration: duration, ease: "power2.inOut" });
    }

    function pulseNode(node) {
        gsap.to(node, {
            scale: 1.1,
            boxShadow: "0 0 20px rgba(129, 140, 248, 0.8)",
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }

    function highlightTrack(track, color) {
        gsap.to(track, { backgroundColor: color, duration: 0.3 });
    }

    // Define the steps for each flow
    const borrowerSteps = [
        { caption: "Click NEXT to see how it works", activeNode: null, animateConnector: null },
        { caption: "📄 You submit your invoice to TokInvoice", activeNode: "supplier", animateConnector: 0 },
        { caption: "🔷 TokInvoice tokenizes your invoice on the blockchain", activeNode: "platform", animateConnector: null },
        { caption: "💵 The vault provides immediate cash back to you", activeNode: "vault", animateConnector: 1 },
        { caption: "✅ Done! You received early payment for your invoice", activeNode: "supplier", animateConnector: null }
    ];

    const lenderSteps = [
        { caption: "Click NEXT to see how it works", activeNode: null, animateConnector: null, token: null },
        { caption: "💵 You deposit capital into the lending vault", activeNode: "investor", animateConnector: 0, token: null },
        { caption: "🏦 The vault pools funds from multiple lenders", activeNode: "vault", animateConnector: null, token: null },
        { caption: "💵↔🎫 Vault exchanges cash for tokenized invoice", activeNode: "vault", animateConnector: "exchange", token: "receive" },
        { caption: "🏢 Borrower gets cash, vault holds the invoice token", activeNode: "borrower", animateConnector: null, token: "hold" },
        { caption: "🔥 Invoice paid! Token is burned, releasing value", activeNode: "vault", animateConnector: null, token: "burn" },
        { caption: "💵 Principal flows back to you", activeNode: "investor", animateConnector: "principal", token: null },
        { caption: "💰 Plus interest earned on top", activeNode: "investor", animateConnector: "interest", token: null },
        { caption: "✅ Done! You earned yield from real invoice financing", activeNode: "investor", animateConnector: null, token: null }
    ];

    // Initialize step flows
    document.querySelectorAll('.step-flow').forEach(flow => {
        const isBorrower = flow.classList.contains('borrower-step-flow');
        const steps = isBorrower ? borrowerSteps : lenderSteps;
        const nextBtn = flow.querySelector('.step-btn-next');
        const resetBtn = flow.querySelector('.step-btn-reset');
        let currentStep = 0;

        function resetAllElements() {
            // Reset nodes
            flow.querySelectorAll('.flow-node').forEach(n => {
                gsap.set(n, { clearProps: "all" });
                n.classList.remove('active', 'completed');
            });
            flow.querySelectorAll('.node-circle').forEach(c => {
                gsap.set(c, { clearProps: "all" });
            });
            // Reset connectors
            flow.querySelectorAll('.flow-connector').forEach(c => {
                c.classList.remove('animating', 'completed');
            });
            flow.querySelectorAll('.connector-packet').forEach(p => {
                gsap.set(p, { clearProps: "all", opacity: 0, x: 0 });
            });
            flow.querySelectorAll('.connector-track').forEach(t => {
                gsap.set(t, { clearProps: "all" });
            });
            // Reset return arrows
            flow.querySelectorAll('.return-arrow').forEach(r => {
                r.classList.remove('animating', 'completed');
            });
            flow.querySelectorAll('.return-packet').forEach(p => {
                gsap.set(p, { clearProps: "all", opacity: 0, left: "calc(100% - 24px)" });
            });
            flow.querySelectorAll('.return-track').forEach(t => {
                gsap.set(t, { clearProps: "all" });
            });
            // Reset token
            const vaultToken = flow.querySelector('.vault-token');
            if (vaultToken) {
                gsap.set(vaultToken, { clearProps: "all", opacity: 0, scale: 0 });
                vaultToken.classList.remove('visible', 'burning');
            }
            // Reset burn indicator
            const tokenBurn = flow.querySelector('.token-burn');
            if (tokenBurn) {
                tokenBurn.classList.remove('active');
                gsap.set(tokenBurn, { clearProps: "all" });
            }
        }

        function updateFlow(stepIndex) {
            const step = steps[stepIndex];
            flow.setAttribute('data-step', stepIndex);

            // Update caption with GSAP fade
            const badge = flow.querySelector('.step-number-badge');
            const text = flow.querySelector('.step-text');
            gsap.to(text, {
                opacity: 0,
                duration: 0.15,
                onComplete: () => {
                    badge.textContent = stepIndex;
                    text.textContent = step.caption;
                    gsap.to(text, { opacity: 1, duration: 0.15 });
                }
            });

            // Reset everything first
            resetAllElements();

            // Mark previous steps as completed
            for (let i = 1; i < stepIndex; i++) {
                const prevStep = steps[i];
                if (prevStep.activeNode) {
                    const node = flow.querySelector(`[data-node="${prevStep.activeNode}"]`);
                    if (node) {
                        node.classList.add('completed');
                        const circle = node.querySelector('.node-circle');
                        if (circle) {
                            gsap.set(circle, { borderColor: "#22d3ee", backgroundColor: "rgba(0, 184, 148, 0.15)" });
                        }
                    }
                }
                // Mark previous connectors as completed
                if (prevStep.animateConnector !== null) {
                    markConnectorCompleted(prevStep.animateConnector);
                }
                // Handle token state from previous steps
                if (!isBorrower && prevStep.token) {
                    const vaultToken = flow.querySelector('.vault-token');
                    if (prevStep.token === "receive" || prevStep.token === "hold") {
                        if (vaultToken) gsap.set(vaultToken, { opacity: 1, scale: 1 });
                    } else if (prevStep.token === "burn") {
                        if (vaultToken) gsap.set(vaultToken, { opacity: 0, scale: 0 });
                    }
                }
            }

            // Set current node as active with GSAP
            if (step.activeNode) {
                const node = flow.querySelector(`[data-node="${step.activeNode}"]`);
                if (node) {
                    node.classList.add('active');
                    const circle = node.querySelector('.node-circle');
                    if (circle) {
                        gsap.to(circle, {
                            scale: 1.15,
                            borderColor: "#818cf8",
                            boxShadow: "0 0 20px rgba(129, 140, 248, 0.6)",
                            duration: 0.3
                        });
                        // Pulse animation
                        gsap.to(circle, {
                            boxShadow: "0 0 30px rgba(129, 140, 248, 0.8)",
                            duration: 0.8,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                }
            }

            // Handle token animation for current step (lender only)
            if (!isBorrower && step.token) {
                const vaultToken = flow.querySelector('.vault-token');
                const tokenBurn = flow.querySelector('.token-burn');

                if (step.token === "receive") {
                    if (vaultToken) {
                        gsap.fromTo(vaultToken,
                            { opacity: 0, scale: 0 },
                            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                        );
                    }
                } else if (step.token === "hold") {
                    if (vaultToken) {
                        gsap.set(vaultToken, { opacity: 1, scale: 1 });
                        gsap.to(vaultToken, {
                            y: -3,
                            duration: 0.5,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                } else if (step.token === "burn") {
                    if (vaultToken) {
                        gsap.set(vaultToken, { opacity: 1, scale: 1 });
                        gsap.to(vaultToken, {
                            scale: 1.5,
                            opacity: 0,
                            rotation: 180,
                            duration: 0.8,
                            ease: "power2.in"
                        });
                    }
                    if (tokenBurn) {
                        tokenBurn.classList.add('active');
                        gsap.fromTo(tokenBurn,
                            { scale: 0.9, opacity: 0.5 },
                            { scale: 1, opacity: 1, duration: 0.3 }
                        );
                        // GSAP flicker for burn icon
                        const burnIcon = tokenBurn.querySelector('.burn-icon');
                        if (burnIcon) {
                            gsap.to(burnIcon, {
                                scale: 1.1,
                                opacity: 0.7,
                                duration: 0.25,
                                repeat: -1,
                                yoyo: true,
                                ease: "sine.inOut"
                            });
                        }
                    }
                }
            }

            // Animate current connector with GSAP
            if (step.animateConnector !== null) {
                animateConnector(step.animateConnector);
            }

            // Build step history
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

        function markConnectorCompleted(connId) {
            if (isBorrower) {
                const connectors = flow.querySelectorAll('.flow-connector');
                if (typeof connId === 'number' && connectors[connId]) {
                    const track = connectors[connId].querySelector('.connector-track');
                    const packet = connectors[connId].querySelector('.connector-packet');
                    if (track) gsap.set(track, { backgroundColor: "#22d3ee" });
                    if (packet) gsap.set(packet, { opacity: 1, x: 60 });
                }
            } else {
                const lenderConnectors = flow.querySelectorAll('.lender-main-row .flow-connector:not(.exchange-connector)');
                if (connId === "exchange") {
                    const exchConn = flow.querySelector('.exchange-connector');
                    if (exchConn) {
                        const track = exchConn.querySelector('.connector-track');
                        const moneyPacket = exchConn.querySelector('.money-out');
                        if (track) gsap.set(track, { backgroundColor: "#22d3ee" });
                        if (moneyPacket) gsap.set(moneyPacket, { opacity: 1, x: 60 });
                    }
                } else if (connId === "principal") {
                    const princ = flow.querySelector('.lender-return-principal');
                    if (princ) {
                        const track = princ.querySelector('.return-track');
                        const packet = princ.querySelector('.return-packet');
                        if (track) gsap.set(track, { backgroundColor: "#22c55e" });
                        if (packet) gsap.set(packet, { opacity: 1, left: "0px" });
                    }
                } else if (connId === "interest") {
                    const inter = flow.querySelector('.lender-return-interest');
                    if (inter) {
                        const track = inter.querySelector('.return-track');
                        const packet = inter.querySelector('.return-packet');
                        if (track) gsap.set(track, { backgroundColor: "#facc15" });
                        if (packet) gsap.set(packet, { opacity: 1, left: "0px" });
                    }
                } else if (typeof connId === 'number' && lenderConnectors[connId]) {
                    const track = lenderConnectors[connId].querySelector('.connector-track');
                    const packet = lenderConnectors[connId].querySelector('.connector-packet');
                    if (track) gsap.set(track, { backgroundColor: "#22d3ee" });
                    if (packet) gsap.set(packet, { opacity: 1, x: 60 });
                }
            }
        }

        function animateConnector(connId) {
            if (isBorrower) {
                const connectors = flow.querySelectorAll('.flow-connector');
                if (typeof connId === 'number' && connectors[connId]) {
                    const track = connectors[connId].querySelector('.connector-track');
                    const packet = connectors[connId].querySelector('.connector-packet');
                    if (track) {
                        gsap.to(track, { backgroundColor: "#818cf8", duration: 0.3 });
                    }
                    if (packet) {
                        gsap.set(packet, { opacity: 1, x: 0 });
                        gsap.to(packet, { x: 60, duration: 1, ease: "power2.inOut" });
                    }
                }
            } else {
                if (connId === "exchange") {
                    const exchConn = flow.querySelector('.exchange-connector');
                    if (exchConn) {
                        const track = exchConn.querySelector('.connector-track');
                        const moneyPacket = exchConn.querySelector('.money-out');
                        const tokenPacket = exchConn.querySelector('.token-in');
                        if (track) gsap.to(track, { backgroundColor: "#818cf8", duration: 0.3 });
                        if (moneyPacket) {
                            gsap.set(moneyPacket, { opacity: 1, x: 0 });
                            gsap.to(moneyPacket, { x: 60, duration: 1, ease: "power2.inOut" });
                        }
                        if (tokenPacket) {
                            gsap.set(tokenPacket, { opacity: 1, x: 60 });
                            gsap.to(tokenPacket, { x: 0, duration: 1, delay: 0.5, ease: "power2.inOut" });
                        }
                    }
                } else if (connId === "principal") {
                    const princ = flow.querySelector('.lender-return-principal');
                    if (princ) {
                        const track = princ.querySelector('.return-track');
                        const packet = princ.querySelector('.return-packet');
                        if (track) gsap.to(track, { backgroundColor: "#22c55e", duration: 0.3 });
                        if (packet) {
                            // Start at right side (calc(100% - 24px)), animate to left (0px)
                            gsap.set(packet, { opacity: 1, left: "calc(100% - 24px)" });
                            gsap.to(packet, { left: "0px", duration: 1.2, ease: "power2.inOut" });
                        }
                    }
                } else if (connId === "interest") {
                    const inter = flow.querySelector('.lender-return-interest');
                    if (inter) {
                        const track = inter.querySelector('.return-track');
                        const packet = inter.querySelector('.return-packet');
                        if (track) gsap.to(track, { backgroundColor: "#facc15", duration: 0.3 });
                        if (packet) {
                            // Start at right side, animate to left
                            gsap.set(packet, { opacity: 1, left: "calc(100% - 24px)" });
                            gsap.to(packet, { left: "0px", duration: 1.2, ease: "power2.inOut" });
                        }
                    }
                } else {
                    const lenderConnectors = flow.querySelectorAll('.lender-main-row .flow-connector:not(.exchange-connector)');
                    if (typeof connId === 'number' && lenderConnectors[connId]) {
                        const track = lenderConnectors[connId].querySelector('.connector-track');
                        const packet = lenderConnectors[connId].querySelector('.connector-packet');
                        if (track) gsap.to(track, { backgroundColor: "#818cf8", duration: 0.3 });
                        if (packet) {
                            gsap.set(packet, { opacity: 1, x: 0 });
                            gsap.to(packet, { x: 60, duration: 1, ease: "power2.inOut" });
                        }
                    }
                }
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

