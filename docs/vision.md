# TokInvoice Vision & Pitch

TokInvoice is building the next generation of invoice financing on XRPL, using three core primitives:

- **Multi-Purpose Tokens (MPT)** to represent invoices as real-world assets (RWAs).
- **XRPL Lending Protocol (XLS-65/66)** to originate and manage loans from on-ledger vaults.
- **XRPL DEX/AMM** to provide secondary liquidity and market-driven pricing (later phase).

The goal: make it trivial for a qualified supplier to get paid **today** on a 30/60-day invoice, using a **regulated, transparent, on-chain credit stack** that institutional lenders and SaaS platforms can trust.

---

## 1. Product vision

### 1.1 Problem

- SMEs routinely wait **30–90 days** to get paid.
- Existing invoice finance is opaque, operationally heavy, and hard to embed into SaaS products.

### 1.2 TokInvoice’s answer

> Any qualified invoice can be **tokenized on XRPL**, financed from a shared **on-chain lending pool**, and repaid through programmable workflows, with transparent risk and yields.

Key design goals:

- **Instant working capital** for suppliers once an invoice is approved.
- **Short-duration, transparent RWA yield** for institutional lenders.
- **Simple APIs and widgets** for SaaS partners to embed financing without becoming lenders.

---

## 2. Value Propositions

### 2.1 For Originators (SMBs Seeking Cash)

**The Problem They Have**:

| Pain Point | Traditional Solution | Issues |
|------------|---------------------|--------|
| Cash stuck in 60-90 day invoices | Bank line of credit | Hard to get, requires collateral, covenants |
| Need cash to pay suppliers/wages | Invoice factoring | Expensive (2-5%), invasive, volume commitments |
| Seasonal cash gaps | Merchant cash advance | Predatory rates (20-50% APR) |
| Won customer, can't fund the job | Turn down the work | Lost revenue, lost growth |

**TokInvoice Value Proposition**:

| Benefit | How We Deliver |
|---------|---------------|
| **Speed** | Minutes, not days. Connect Xero → select invoice → funds in bank. |
| **Flexibility** | No minimums, no volume commitments. Finance 1 invoice or 100. |
| **Transparency** | Flat 3% fee shown upfront. No hidden charges, no surprise deductions. |
| **Control** | You choose which invoices to finance, when you need cash. |

**Key messaging (zero crypto)**:

> Originators never see blockchain, tokens, or XRPL. They see:
> - "Connect your Xero account"
> - "Select the invoices you want to finance"
> - "Get £9,000 in your bank account"
>
> The crypto is invisible plumbing—like SWIFT for international transfers.

**30-second pitch**:

> "We help businesses get paid faster. Connect your Xero, pick the invoices you want to finance, and get cash in your bank account within minutes. No long contracts, no hidden fees, no hassle."

### 2.2 For Lenders (Capital Providers)

Two distinct audiences with different value propositions:

**Crypto-Native Lenders** (DeFi users, crypto funds, XRPL community):

| What They Want | What We Offer |
|----------------|---------------|
| Real yield, not token emissions | 8-12% APY backed by real invoice payments |
| On-chain transparency | XLS-65 vault is auditable on XRPL, loan-by-loan visibility |
| Short duration | 30-90 day invoices, capital cycles quickly |
| Diversification from DeFi | Real-world assets uncorrelated with crypto markets |

**TradFi Crossover Lenders** (Family offices, private credit, HNWIs):

| What They Want | What We Offer |
|----------------|---------------|
| Yield premium over treasuries | 8-12% vs 5% risk-free, with short duration |
| Familiar asset class | Invoice receivables—same as they'd buy from a bank |
| Low crypto friction | "You deposit USD, earn USD. We handle the plumbing." |
| Institutional infrastructure | Custody options, reporting, compliance |

**30-second pitch (crypto-native)**:

> "Earn 8-12% real yield on your RLUSD, backed by short-duration invoices from verified businesses. On-chain vault, transparent lending, 30-90 day duration."

**30-second pitch (TradFi)**:

> "We offer institutional investors access to short-duration, asset-backed lending with attractive risk-adjusted returns. Modern infrastructure keeps costs low and yields high."

### 2.3 Competitive Positioning

**vs. Traditional Invoice Factoring**:

| Factor | Traditional Factoring | TokInvoice |
|--------|----------------------|------------|
| Setup time | 1-4 weeks | 30 minutes |
| Minimum commitment | £100k/year | None |
| Fee transparency | Opaque (service fee + discount + admin) | Flat 3% |
| Contract length | 12-24 months | No contract |
| Debtor notification | Usually required | Optional |

**vs. Bank Line of Credit**:

| Factor | Bank LOC | TokInvoice |
|--------|----------|------------|
| Approval rate | ~20% for SMEs | Higher (invoice-based, not credit-based) |
| Time to funds | 2-6 weeks | Minutes to hours |
| Collateral required | Often personal guarantee | Invoice itself |
| Usage restrictions | Covenants, reporting | None |

**vs. Merchant Cash Advance (MCA)**:

| Factor | MCA | TokInvoice |
|--------|-----|------------|
| Effective APR | 40-150% | 15-25% equivalent |
| Repayment | Daily deductions from revenue | When debtor pays |
| Risk to business | High—cash flow pressure | Low—repayment follows invoice |

---

## 3. Realistic Funding Timelines

Not "instant"—but dramatically faster than alternatives.

### 3.1 Where Time Actually Goes

| Step | Time | Blocker |
|------|------|---------|
| Account creation | 2 min | None |
| KYC/AML verification | 1-60 min | ID check provider |
| Legal docs signed | 5-15 min | E-signature |
| Connect accounting software | 2 min | OAuth |
| BaaS virtual account created | 1-5 min | Modulr/Stripe API |
| Select invoice to finance | 1 min | None |
| Debtor credit check | 1-30 min | Credit bureau API |
| Invoice verification | **0-24h** | Trust tier |
| XRPL loan creation | 5 sec | None |
| Fiat payout (Faster Payments) | **Instant** | Pre-funded GBP float |

### 3.2 Timeline by Scenario

| Scenario | Time to Funds |
|----------|--------------|
| **First-time originator** (manual verification) | 24-48 hours |
| **First-time originator** (instant KYC) | 2-4 hours |
| **Established originator** (Tier 2+, first invoice) | 25-30 minutes |
| **Established originator** (subsequent invoice) | **5-10 minutes** |
| **Trusted originator** (Tier 3) | **2-3 minutes** |

### 3.3 Trust Tiers

| Tier | Criteria | Verification | Max Advance |
|------|----------|--------------|-------------|
| Tier 1 (New) | Just onboarded | Manual review (1-24h) | £10,000/invoice |
| Tier 2 (Established) | 30+ days on platform, 3+ invoices repaid | Auto-verified | £50,000/invoice |
| Tier 3 (Trusted) | 6+ months, 10+ invoices repaid | Auto-approved | £250,000/invoice |

### 3.4 Instant Funding Architecture

To achieve near-instant payouts, we maintain a GBP float:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   RLUSD Vault   │     │   GBP Float     │     │  Originator     │
│   (XRPL)        │     │   (Modulr)      │     │  Bank Account   │
└────────┬────────┘     └────────┬────────┘     └────────▲────────┘
         │                       │                       │
         │ Loan created          │ Instant FPS           │
         │ (5 sec)               │ (seconds)             │
         ▼                       ▼                       │
┌─────────────────────────────────────────────────────────┐
│              treasury-service                            │
│  1. Create XLS-66 loan (RLUSD)                          │
│  2. Debit GBP float                                      │
│  3. Send FPS to originator                               │───────────────┘
│  4. Queue RLUSD→GBP conversion to replenish float       │
└─────────────────────────────────────────────────────────┘
```

Originator sees: **£9,000 in bank within minutes**.
Backend: Float replenished async via off-ramp (hours).

---

## 4. How XRPL Primitives Fit Together

1. **MPT: invoice as a real-world asset**
   - Each financed invoice is minted as an MPT issuance with metadata: face value, currency, buyer, due date, jurisdiction, off-chain hash.
   - MPT is the canonical on-ledger representation of the economic claim.

2. **Lending protocol: vault-based capital engine**
   - Lenders deposit RLUSD (and later other regulated stablecoins) into **single-asset vaults**.
   - TokInvoice, acting as a loan broker, originates short-term loans from these vaults to suppliers.
   - Loans reference the underlying invoice MPT and are priced using a holistic risk engine and oracles.

3. **DEX/AMM: secondary liquidity (later phase)**
   - Once XRPL MPT-on-DEX support is live, invoice MPTs and/or portfolio tokens can trade on the XRPL AMM/DEX.
   - This provides exit liquidity and market-driven discount rates for different invoice profiles.

### 4.1 End-to-end flow for a financed invoice

1. **Tokenization**
   - `invoice-service` mints an invoice MPT with hash, debtor, due date, amount, currency, etc.

2. **Pricing & eligibility**
   - `lending-service` uses credit/oracle data and the pricing engine to decide advance rate and risk tier (AAA/AA/BB).

3. **Loan origination**
   - `lending-service` creates an XLS-66 Loan against the chosen XLS-65 Vault, referencing the MPT (via memo or off-ledger index).

4. **Payout**
   - Proceeds flow from the Vault to a TokInvoice lending account and then to the supplier; the MPT sits in a custody account controlled by TokInvoice.

5. **Repayment**
   - `settlement-service` watches external rails, converts funds to RLUSD if needed, and repays the Loan back into the Vault; MPT clawback/cleanup happens as part of settlement.

### 4.2 Compliance & risk benefits

- **Permissioned Vaults & clear roles** – Vaults live in permissioned domains; capital providers, TokInvoice/SPVs, and MPT holders have clearly separated responsibilities.
- **On-ledger supervision** – Regulators and auditors can inspect Vaults, Loans, and the MPT invoice registry directly on XRPL.
- **Centralized risk buckets** – Liquidity and risk are aggregated per Vault and per risk tier instead of scattered across ad-hoc escrows, and pricing aligns with XLS-47 oracles and the holistic pricing engine.

---

## 5. Go-to-Market Strategy

### 5.1 Originator Acquisition

| Channel | Strategy | Target |
|---------|----------|--------|
| **Accounting App Marketplaces** | Xero App Store, QuickBooks App Store | SMBs already using cloud accounting |
| **Industry Partnerships** | Trade associations, industry bodies | Construction, logistics, manufacturing |
| **Accountant Referrals** | Partner program for accountants/bookkeepers | Their SMB clients |
| **Content Marketing** | SEO for "invoice financing", "factoring alternative" | Search-intent traffic |
| **Vertical SaaS Partnerships** | Embed in construction PM, logistics TMS | Captive audience with invoice pain |

**Key messaging themes**:
- "Get paid faster" (not "blockchain financing")
- Speed and simplicity vs. traditional factoring
- No volume commitments, no long contracts

### 5.2 Lender Acquisition

#### Lender Segments (Priority Order)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LENDER UNIVERSE                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TIER 0: STRATEGIC / ANCHOR (Start here!)                                   │
│  ├─ Ripple (RLUSD ecosystem growth—aligned incentives)                     │
│  ├─ XRPL Foundation / Grants                                               │
│  └─ Founding team capital                                                   │
│                                                                              │
│  TIER 1: CRYPTO-NATIVE (Fastest to close)                                   │
│  ├─ XRPL community (XRP holders seeking real yield)                        │
│  ├─ RLUSD early adopters (want to put RLUSD to work)                       │
│  ├─ DeFi yield seekers (tired of ponzinomics, want real yield)             │
│  └─ Crypto funds with RWA mandate                                          │
│                                                                              │
│  TIER 2: TRADFI CROSSOVER (Slower, but larger)                              │
│  ├─ Private credit funds (yield premium seekers)                           │
│  ├─ Family offices (diversification, alternative assets)                   │
│  ├─ Invoice factoring companies (tech upgrade / partnership)              │
│  └─ Fintech lenders (infrastructure partnership)                           │
│                                                                              │
│  TIER 3: INSTITUTIONAL (Long sales cycle)                                   │
│  ├─ Asset managers (structured products)                                   │
│  ├─ Banks (credit facilities)                                              │
│  └─ Insurance companies / pension funds                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Lender Acquisition Roadmap

| Phase | Source | Target Amount | Timeline |
|-------|--------|---------------|----------|
| **Anchor** | Ripple / RLUSD team | $500k-1M | 1-3 months |
| | XRPL Foundation grant | $100k-250k | 2-4 months |
| | Founding team + angels | $100k-300k | Immediate |
| **Community** | XRPL community (public vault) | $1M-3M | 3-6 months |
| | RWA crypto funds | $1M-5M | 3-6 months |
| **Institutional** | Private credit funds | $5M-50M | 6-12 months |
| | Invoice factoring partnerships | $10M-100M | 12-18 months |

#### Key Outreach Targets

**Ripple Ecosystem** (Highest Priority):
- RLUSD product team → Anchor liquidity + OTC terms
- Ripple Ventures → Investment + strategic support
- RippleX → Developer grants, technical validation

**XRPL Community**:
- XRPL Foundation → Grants, community introductions
- XRPL Labs → Technical credibility, community reach
- Large XRPL validators → Capital + credibility
- Crypto Twitter influencers → Community awareness

**RWA Space**:
- Maple Finance, Goldfinch, Centrifuge teams → Cross-chain learnings
- RWA.xyz → Data/research, investor introductions

#### Lender Value Propositions

| Segment | Pitch |
|---------|-------|
| **Crypto-Native** | "Earn 8-12% real yield on RLUSD. Backed by verified invoices, not token emissions. 30-90 day duration, on-chain transparency." |
| **TradFi Crossover** | "You deposit USD, earn USD. We handle the blockchain plumbing. Short-duration, asset-backed lending with 8-12% returns." |
| **Institutional** | "Scalable invoice receivables exposure via modern infrastructure. Lower operational cost = higher yields passed to investors." |

### 5.3 Geographic Focus

| Phase | Market | BaaS Provider | Stablecoin | Regulatory Path |
|-------|--------|---------------|------------|-----------------|
| v1 (MVP) | **UK** | Modulr | RLUSD | FCA EMD Agent via Modulr |
| v1.5 | **EU** | Modulr | RLUSD or EURØP | MiCA CASP application |
| v2 | **US** | Stripe Treasury | RLUSD | State-by-state or SEC exemption |

### 5.4 Strategic Advantage: Ripple OTC Access

TokInvoice has direct access to Ripple's OTC desk for RLUSD liquidity, providing significant cost and speed advantages over exchange-based on/off-ramps.

#### The Problem Without OTC Access

| Step | Cost | Time |
|------|------|------|
| Lender: Wire USD to exchange | $25-50 wire fee | 1-2 days |
| Lender: Buy RLUSD on exchange | 0.1-0.5% spread + fees | Minutes |
| Payout: Sell RLUSD → USD | 0.1-0.5% spread | Minutes |
| Payout: Convert USD → GBP | 0.3-0.5% FX spread | — |
| Payout: Wire to Modulr | — | 1-2 days |
| **Total** | **0.5-1.5% per direction** | **1-3 days** |

#### With Ripple OTC Access

| Step | Cost | Time |
|------|------|------|
| TokInvoice ↔ Ripple OTC | ~0.1-0.3% (relationship pricing) | Same day |
| GBP direct (if supported) | No USD intermediate | — |
| **Total** | **~0.1-0.3% per direction** | **Hours** |

#### Impact on Unit Economics

| Metric | Without OTC | With OTC | Improvement |
|--------|-------------|----------|-------------|
| Fiat → RLUSD cost | 0.5-1% | 0.1-0.3% | **3-5x cheaper** |
| RLUSD → Fiat cost | 0.5-1.5% | 0.1-0.3% | **3-5x cheaper** |
| Settlement time | 1-3 days | Same day | **80% faster** |
| Float requirement | Higher | Lower | **Less capital** |

**Example: £10,000 Invoice**

| Line Item | Without OTC | With OTC |
|-----------|-------------|----------|
| Gross revenue (3% fee) | £300 | £300 |
| RLUSD acquisition cost | -£50 to -£100 | -£10 to -£30 |
| GBP payout cost | -£50 to -£150 | -£10 to -£30 |
| **Net margin** | **£50-200** | **£240-280** |

This is a **2-5x margin improvement** that translates directly to competitive pricing or higher lender yields.

#### Ripple Alignment

Ripple is incentivized to support TokInvoice:
- **RLUSD utility**: Real-world use case drives RLUSD adoption
- **XRPL showcase**: Demonstrates XLS-65/66 lending protocol in production
- **RWA narrative**: Positions XRPL as the chain for real-world assets
- **Revenue**: OTC desk volume

---

## 6. Roadmap at a Glance

- **MVP** – MPT + Lending Protocol (Vaults & Loans)
  - Tokenize invoices as MPT.
  - Fund them from RLUSD vaults via XLS-65/66 on Lending Devnet.
  - Use escrow only at funding/repayment edges for operational safety.
  - UK-first: Modulr BaaS, Xero integration, GBP payouts.

- **v2** – DEX/AMM & Risk-Tier Tokens
  - Add risk-tier IOU or portfolio tokens backed by baskets of invoice MPTs.
  - List suitable pools on XRPL AMM/DEX for early exits and extra yield.
  - Multi-market: EU (EURØP), US (Stripe Treasury).

- **v3** – Advanced Credit & Regulation
  - More sophisticated risk stratification and tranching.
  - Deeper MiCA/UK-compliant reporting and structuring.
  - Institutional lender products (SPV structures, tranched notes).

### 6.1 Phase Overview (Capital Engine)

| Phase | Label | Capital Engine                          | Status / Intent                                      |
|-------|-------|-----------------------------------------|------------------------------------------------------|
| v0    | IOU   | Risk-tier IOU pool tokens + XRPL DEX    | **Legacy prototype**; kept only for demos/rollback.  |
| v1    | MVP   | XLS-65 Vaults + XLS-66 Loans (Devnet)   | **Current target**; primary path for new financing.  |
| v2+   | DEX   | Vault-backed risk-tier tokens + AMM/DEX | **Future**; investor products & secondary liquidity. |

---

## 7. Where to Look Next

**Architecture & Technical**:
- `docs/architecture.md` – System structure and services.
- `docs/features/12-mpt_invoices.md` – How MPT is implemented.
- `docs/features/11-lending_protocol_xls65_66.md` – How lending is wired (Vaults & Loans).
- `docs/features/13-oracles_xls47.md` – Oracles and pricing.

**User Journeys & Flows**:
- `docs/features/34-onboarding_flows.md` – Detailed originator and lender onboarding. [#34]
- `docs/features/35-kyc_integration.md` – KYC/AML integration (Onfido, ComplyAdvantage, TrueLayer). [#35]
- `docs/features/36-fx_hedging.md` – FX hedging for GBP/USD exposure. [#36]
- `docs/features/32-invoice_lifecycle_and_external_events.md` – Invoice saga and lifecycle. [#32]
- `docs/features/16-feature_xero_ingestion.md` – Xero integration. [#16]
- `docs/features/30-baas_integration.md` – BaaS payment interception. [#30]

**Market & Compliance**:
- `docs/market/uk_construction.md` – UK construction market analysis.
- `docs/market/us_aviation.md` – US aviation MRO market analysis.
- `docs/market/eu_logistics.md` – EU logistics market analysis.
- `docs/compliance.md` – Regulatory/compliance strategy.

