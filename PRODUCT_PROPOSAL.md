# Product Proposal: Proofolio — Confidential Solvency & Eligibility Gate

> **Midnight Builder Challenge Track:** Age / Eligibility Gate — prove a threshold without revealing the underlying value  
> **Project Name:** Proofolio  
> **Author:** Shivam  
> **Repository:** [https://github.com/shivam-1410/Proofolio](https://github.com/shivam-1410/Proofolio)  
> **Status:** Level 3 Production Proposal  

---

## 1. Executive Summary

**Proofolio** is an institutional-grade zero-knowledge **Eligibility Gate** built on the **Midnight Network**. It enables financial institutions, custodians, decentralized lending protocols, and accredited funds to prove that reserve balances meet or exceed required liability thresholds (`total_reserves >= total_liabilities`) with 100% mathematical certainty—**without disclosing raw asset quantities, client deposit amounts, or proprietary portfolio allocations**.

By leveraging Midnight's native dual-state architecture and the Compact language, Proofolio turns the traditional trade-off between institutional confidentiality and public accountability into a zero-knowledge primitive: **prove threshold qualification without revealing the underlying value**.

---

## 2. Problem Statement

Centralized exchanges, prime brokers, and financial custodians face an existential dilemma:
1. **The Transparency Imperative:** Following high-profile collapses in digital asset custody (e.g. FTX, Celsius, BlockFi), users, depositors, and regulatory bodies demand mathematical proof that customer funds are fully backed 1:1.
2. **The Confidentiality Imperative:** Publishing full balance sheets publicly exposes institutional trading positions, invites predatory front-running by market competitors, reveals corporate cash reserves, and leaks customer transaction metadata.
3. **The Failure of Traditional Audits:** Periodic "point-in-time" attestations by accounting firms are slow (occurring months after the fact), exorbitantly expensive, vulnerable to collusion, and incapable of preventing rehypothecation between audit windows.

---

## 3. The Solution: Midnight ZK Eligibility Gate

Proofolio applies Midnight's zero-knowledge smart contract protocol to implement a **Confidential Eligibility Gate**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │              CLIENT-SIDE PRIVATE STATE (LACE WALLET)         │
 │  • total_reserves: Uint<64>    (Confidential Asset Holdings)│
 │  • total_liabilities: Uint<64> (Confidential Deposit Debts) │
 │  • salt: Bytes<32>             (Blinding Entropy)           │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Local ZK Proof Generation
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                  COMPACT CIRCUIT VALIDATION                 │
 │            assert(total_reserves >= total_liabilities)      │
 │            commitment = persistentHash<Bytes<32>>(salt)     │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Selective Disclosure (disclose)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │              PUBLIC LEDGER STATE (MIDNIGHT NETWORK)         │
 │  • solvency_status: true      (Public Boolean Certification)│
 │  • last_verified_block: Uint   (Block Freshness Timestamp)  │
 │  • commitment_hash: Bytes<32> (Cryptographic Audit Anchor)  │
 └─────────────────────────────────────────────────────────────┘
```

### Key Capabilities:
- **Client-Side Proof Generation:** Private witnesses never leave the custodian's local device; proving is executed entirely in browser memory / local proof provider.
- **Observable Privacy Behavior:** The world learns with mathematical certainty that assets cover liabilities, yet observes zero information about the magnitude of reserves or surplus margin.
- **Audit Commitment Binding:** Each proof publishes a cryptographic commitment hash that binds the proof to a specific snapshot, preventing double-counting across balance sheets.

---

## 4. Market Opportunity & Target Audiences

| Target Persona | Key Pain Point | Proofolio Value Proposition |
| :--- | :--- | :--- |
| **Crypto Custodians & Exchanges** | Depositor trust deficit; regulatory scrutiny over solvency. | Continuous, on-chain proof of solvency without balance sheet leaks. |
| **Institutional Lending Desks** | Counterparty risk assessment for under-collateralized borrowing. | Verify borrower collateral threshold qualification in real time. |
| **DAOs & Treasury Committees** | Tokenholder governance demands proof of runway and debt backing. | Confidential solvency verification without revealing treasury strategy. |
| **Accredited Communities & Gated Protocols** | Proof of net-worth / capital threshold required for entry. | Eligibility gating without disclosing user net worth or income. |

---

## 5. Technical Architecture & Tech Stack

- **Smart Contract Language:** Compact (`0.23.0` specification, compiler `compactc 0.31.1`)
- **Blockchain Protocol:** Midnight Network (Preprod Testnet)
- **Client SDK:** `@midnight-ntwrk/dapp-connector-api@4.0.1`, `@midnight-ntwrk/compact-runtime@0.16.0`, `@midnight-ntwrk/midnight-js-contracts@4.1.1`
- **Frontend Framework:** React 19, TypeScript, Vite 8
- **Wallet Infrastructure:** Midnight Lace Wallet DApp Connector (`window.midnight.mnLace`)
- **Automated CI/CD:** GitHub Actions workflow executing contract unit tests, eligibility test suites, and production Vite compilation on every commit.

---

## 6. Product Roadmap

### Phase 1: MVP Solvency Circuit & Web3 DApp Connector (Completed — Level 3)
- Compact smart contract with declarative assertions (`total_reserves >= total_liabilities`).
- Browser dApp with Lace wallet connector and step-by-step local ZK proof generation.
- Automated CI/CD test pipeline with 7 automated unit and integration tests.
- Observable Privacy Inspector component demonstrating client-side vs public ledger states.

### Phase 2: Multi-Asset Merkle Sum Tree Integration (Q2 2026)
- Support for multi-currency asset baskets (tNight, BTC, ETH, USD-pegged tokens).
- Client-side Merkle sum tree generation allowing individual depositors to verify their account inclusion privately without revealing total liability sum.

### Phase 3: Continuous Attestation Oracle & Governance SDK (Q3 2026)
- Cron-driven scheduled proof submissions with automated block-cadence monitoring.
- SDK for DeFi protocols to query `solvency_status` as an on-chain prerequisite for liquidity deployment.

### Phase 4: Enterprise Audit Dashboard & Compliance Export (Q4 2026)
- Institutional role-based access control (auditor view vs depositor view).
- Cryptographic compliance reports exportable to regulatory standard schemas.

---

## 7. Conclusion

Proofolio exemplifies the core promise of the Midnight Network: privacy and compliance are not opposites, but mutual imperatives. As an **Eligibility Gate**, Proofolio proves threshold compliance without exposing proprietary financial data, establishing a new gold standard for decentralized trust.
