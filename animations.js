// TokInvoice Interactive Animations - Using GSAP for cross-browser support

document.addEventListener('DOMContentLoaded', function () {
    // Journey Tab Switching
    const journeyTabs = document.querySelectorAll('.journey-tab');
    const borrowerJourney = document.getElementById('borrower-journey');
    const lenderJourney = document.getElementById('lender-journey');

    journeyTabs.forEach(tab => {
        tab.addEventListener('click', function () {
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
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // HERO & SCROLL ANIMATIONS
    // ========================================

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entrance
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl.from(".hero h1", { y: 50, opacity: 0, duration: 1, delay: 0.2 })
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 1 }, "-=0.6")
        .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".bg-blob", { scale: 0, opacity: 0, duration: 2, stagger: 0.3, ease: "elastic.out(1, 0.5)" }, "-=1.5");

    // Scroll Animations for Sections: Use Batch for safety
    // This ensures elements don't get stuck at opacity:0 if scroll position is weird
    ScrollTrigger.batch(".problem-card, .feature-card, .tech-card, .step, .opportunity-card", {
        interval: 0.1, // time between batches
        batchMax: 3,   // max items per batch
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, duration: 0.8, ease: "power2.out" }),
        // Ensure they are hidden initially (but use set to avoid stuck from tweens)
        onRefresh: batch => gsap.set(batch, { opacity: 0, y: 30 })
    });

    // Animate Section Headers separately
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        const headers = section.querySelectorAll("h2, .section-subtitle");
        if (headers.length > 0) {
            gsap.fromTo(headers,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%", // Trigger earlier (when top hits 90% of viewport)
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Comparison Table special case
        const table = section.querySelector(".comparison-table-wrapper");
        if (table) {
            gsap.fromTo(table,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: table,
                        start: "top 90%",
                    }
                }
            );
        }
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
        { caption: "🔷 TokInvoice tokenizes your invoice on the blockchain", activeNode: "platform", animateConnector: 1 },
        { caption: "💵 The vault returns cash directly to you", activeNode: "vault", animateConnector: 2 },
        { caption: "✅ Done! You received early payment for your invoice", activeNode: "supplier", animateConnector: null }
    ];

    const lenderSteps = [
        { caption: "Click NEXT to see how it works", activeNode: null, animateConnector: null, token: null },
        { caption: "💵 You deposit capital into the lending vault", activeNode: "investor", animateConnector: 0, token: null },
        { caption: "🏦 The vault pools funds from multiple lenders", activeNode: "vault", animateConnector: null, token: null },
        { caption: "💵↔🎫 Vault exchanges cash for tokenized invoice", activeNode: "vault", animateConnector: 1, token: "receive" },
        { caption: "🏢 Borrower gets cash, vault holds the invoice token", activeNode: "borrower", animateConnector: null, token: "hold" },
        { caption: "🔥 Invoice paid! Token is burned, releasing value", activeNode: "vault", animateConnector: null, token: "burn" },
        { caption: "💵 Principal flows back to you", activeNode: "investor", animateConnector: 2, token: null },
        { caption: "💰 Plus interest earned on top", activeNode: "investor", animateConnector: 3, token: null },
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
            // Reset connectors (SVG)
            flow.querySelectorAll('.connector-track').forEach(t => {
                gsap.set(t, { attr: { "marker-end": t.id.includes('lender') ? "url(#arrowhead-lender)" : "url(#arrowhead)", stroke: "#64748b" } });
            });
            flow.querySelectorAll('.connector-packet-group').forEach(p => {
                gsap.set(p, { opacity: 0 });
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

            // Build growing step list in caption
            const stepList = flow.querySelector('.step-list');
            if (stepList) {
                // Clear all items
                stepList.innerHTML = '';

                // Add all steps up to and including current
                for (let i = 0; i <= stepIndex; i++) {
                    const item = document.createElement('div');
                    item.className = 'step-item' + (i === stepIndex ? ' current' : '');
                    item.innerHTML = `
                        <span class="step-number-badge">${i}</span>
                        <span class="step-text">${steps[i].caption}</span>
                    `;
                    stepList.appendChild(item);

                    // Animate new current item
                    if (i === stepIndex && stepIndex > 0) {
                        gsap.fromTo(item,
                            { opacity: 0, y: -10 },
                            { opacity: 1, y: 0, duration: 0.3 }
                        );
                    }
                }
            }

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
                // SVG Update
                const track = flow.querySelector(`#track-${connId}`);
                if (track) {
                    gsap.set(track, { attr: { "marker-end": "url(#arrowhead-done)", stroke: "#22d3ee" } });
                }
            } else {
                // Lender Flow
                let trackId;
                if (connId === 0 || connId === 2 || connId === 3) { // Fund, Principal Return, Interest Return
                    trackId = 'lender-track-0';
                } else if (connId === 1) { // Lend (Exchange)
                    trackId = 'lender-track-1';
                }

                if (trackId) {
                    const track = flow.querySelector(`#${trackId}`);
                    if (track) {
                        gsap.set(track, { stroke: "#22d3ee" });
                    }
                }
            }
        }

        function animateConnector(connId) {
            let trackId, packetId;
            let reverse = false;
            let secondaryPacketId = null;

            if (isBorrower) {
                trackId = `track-${connId}`;
                packetId = `packet-${connId}`;
            } else {
                // Lender Flow Logic
                // 0: Fund (Inv -> Vault)
                // 1: Lend (Vault -> Borrower) - effectively "Exchange"
                // 2: Principal (Vault -> Inv) - REVERSE of 0
                // 3: Interest (Vault -> Inv)  - REVERSE of 0

                if (connId === 0) { trackId = 'lender-track-0'; packetId = 'lender-packet-0'; }
                else if (connId === 1) {
                    trackId = 'lender-track-1';
                    packetId = 'lender-packet-1';
                    secondaryPacketId = 'lender-invoice-1';
                }
                else if (connId === 2) { trackId = 'lender-track-0'; packetId = 'lender-packet-0'; reverse = true; } // Return Principal
                else if (connId === 3) { trackId = 'lender-track-0'; packetId = 'lender-packet-0'; reverse = true; } // Return Interest
            }

            const track = flow.querySelector(`#${trackId}`);
            const packetGroup = flow.querySelector(`#${packetId}`);
            const secondaryPacket = secondaryPacketId ? flow.querySelector(`#${secondaryPacketId}`) : null;

            if (track) {
                // Determine marker based on direction
                let markerUrl = isBorrower ? "url(#arrowhead-active)" : "url(#arrowhead-lender-active)";

                // For lender, we want to control arrow direction
                if (!isBorrower) {
                    // Reset markers first? 
                    // Actually, let's just use the active color for the line itself.
                    // If reverse, we ideally want a marker at Start. SVG 1.1 doesn't support marker-start easily without defining it pointing back.
                    // For simplicity, we'll just color the line and move the packet. "money flows back and forth"
                    // We can hide markers if we want strictly bidirectional look, or just ignore them for now.
                    gsap.to(track, { stroke: "#818cf8", duration: 0.3 });
                } else {
                    gsap.to(track, { attr: { "marker-end": markerUrl }, stroke: "#818cf8", duration: 0.3 });
                }
            }

            if (packetGroup && track) {
                const x1 = parseFloat(track.getAttribute('x1'));
                const y1 = parseFloat(track.getAttribute('y1'));
                const x2 = parseFloat(track.getAttribute('x2'));
                const y2 = parseFloat(track.getAttribute('y2'));

                // Determine Start and End based on direction
                const startX = reverse ? x2 : x1;
                const startY = reverse ? y2 : y1;
                const endX = reverse ? x1 : x2;
                const endY = reverse ? y1 : y2;

                // Update packet Icon if needed
                if (!isBorrower) {
                    const text = packetGroup.querySelector('text');
                    if (text) {
                        if (connId === 3) text.textContent = "💰"; // Interest
                        else text.textContent = "💵"; // Principal / Funding
                    }
                }

                gsap.set(packetGroup, { opacity: 1, attr: { transform: `translate(${startX}, ${startY})` } });

                // SECONDARY PACKET (Exchange: Invoice)
                if (secondaryPacket && !isBorrower && connId === 1) {
                    // Invoice moves REVERSE (Borrower -> Vault)
                    const invStartX = x2;
                    const invStartY = y2;
                    const invEndX = x1;
                    const invEndY = y1;

                    gsap.set(secondaryPacket, { opacity: 1, attr: { transform: `translate(${invStartX}, ${invStartY})` } });
                    gsap.to(secondaryPacket, {
                        duration: 1.5,
                        ease: "power1.inOut",
                        attr: { transform: `translate(${invEndX}, ${invEndY})` },
                        onComplete: () => {
                            gsap.to(secondaryPacket, { opacity: 0, duration: 0.2, delay: 0.1 });
                        }
                    });
                }

                gsap.to(packetGroup, {
                    duration: 1.5,
                    ease: "power1.inOut",
                    attr: { transform: `translate(${endX}, ${endY})` },
                    onComplete: () => {
                        if (track) {
                            const doneColor = "#22d3ee";
                            gsap.to(track, { stroke: doneColor, duration: 0.3 });
                            if (isBorrower) {
                                gsap.to(track, { attr: { "marker-end": "url(#arrowhead-done)" }, duration: 0.3 });
                            }
                        }
                        gsap.to(packetGroup, { opacity: 0, duration: 0.2, delay: 0.1 });
                    }
                });
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

