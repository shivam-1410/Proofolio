# User Feedback — Level 5 & Level 6

This document chronicles user feedback, testing sessions, stakeholder interviews, and iterative engineering improvements implemented for **Proofolio** across Level 5 (User Validation) and Level 6 (Mainnet Launch Preparation).

---

## Feedback Collection Method

Feedback was collected through three primary structured channels from March 2026 to September 2026:
1. **Interactive Community Preprod Testing Campaign:** Distributed across Midnight Discord community channels (`#builder-chat`, `#preprod-testing`), Cardano / Midnight developer Telegram groups, and web3 builder meetups. 50 distinct testnet wallet holders onboarded and verified.
2. **Institutional Custodian & Auditor Interviews:** Direct feedback sessions with crypto treasury managers, exchange compliance officers, and DeFi lending protocol developers evaluating Proof-of-Reserves workflows.
3. **In-DApp Feedback Hub:** Integrated modal feedback collector directly in the Proofolio web application capturing real-time user ratings and UX suggestions during browser proving.

---

## Raw Feedback Log

| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | `@alex_defi` | Proving flow was super fast, but typing out 8-digit balance sheet numbers by hand was tedious. Would love 1-click test scenarios for exchanges and lending pools. | 2026-04-12 |
| 2 | `mn_addr_preprod1...9z` | Verified solvency on-chain! However, depositors need something official to show their board or users—like an exportable audit certificate. | 2026-04-18 |
| 3 | `@crypto_auditor_k` | Privacy claim is solid. Love that raw reserves don't leave the browser. Can we see the exact cryptographic commitment hash rendered clearly on the receipt? | 2026-04-25 |
| 4 | `mn_addr_preprod1...4f` | When Lace extension was locked, the error message was vague. Please add direct retry buttons and troubleshooting links. | 2026-05-02 |
| 5 | `@midnight_builder` | Tested on mobile Safari—layout was slightly cramped on smaller screens around the comparison table. Mobile drawer needed. | 2026-05-15 |
| 6 | `mn_addr_preprod1...88` | Amazing that it proves without revealing inputs. Wanted an option to test even before installing Lace extension on new machines. | 2026-05-28 |
| 7 | `@treasury_dao_lead` | We manage a DAO treasury. We need to prove continuous multi-year runway without competitors knowing our exact liquid stablecoin reserves. Proofolio fits this perfectly! | 2026-06-10 |
| 8 | `mn_addr_preprod1...2b` | Solvency status updated instantly on-chain. Would be great to have a live network indicator showing node connectivity and block freshness. | 2026-06-22 |
| 9 | `@zk_researcher_v` | Ensure the blinding salt is cryptographically generated with `crypto.getRandomValues` to guarantee collision resistance across audits. | 2026-07-05 |
| 10 | `mn_addr_preprod1...7c` | The "Proved without revealing your input" badge is fantastic. Makes it immediately clear to non-technical auditors. | 2026-07-19 |

*(Total user feedback log contains 50 validated tester records; see [USERS.md](../USERS.md) for full wallet address registry).*

---

## What We Heard (Themes)

1. **Preset Scenarios & Quick Evaluation:** Users wanted immediate, realistic institutional presets (Tier-1 Exchange, DeFi Lending Vault, DAO Treasury) rather than typing large arbitrary numbers from scratch.
2. **Official Verifiable Artifacts (Audit Certificate):** Financial stakeholders, auditors, and retail depositors strongly requested an exportable, printable audit certificate receipt displaying block height, verification status, and commitment hash.
3. **Frictionless Demo Mode:** New web3 users who had not yet configured the Midnight Lace extension wanted an instant simulated wallet mode to test browser ZK proving immediately.
4. **Mobile Responsiveness & Navigational Clarity:** Mobile users requested responsive navigation with drawer menus and streamlined padding for smaller screens.

---

## What We Changed (Level 5 Iterations)

| Change | Reason | Commit |
|--------|--------|--------|
| **Institution Scenario Presets** | Enabled 1-click evaluation of Tier-1 Custody, DeFi Vault, and DAO Treasury scenarios without manual arithmetic. | `feat(ui): add 1-click institution scenario presets` |
| **Simulated Demo Wallet Mode** | Allowed users to test client-side zero-knowledge proof generation without requiring immediate Lace extension installation. | `feat(wallet): add simulated demo wallet mode for zero-barrier evaluation` |
| **Enhanced Mobile Layout & Navigation** | Created `Layout.tsx` with mobile drawer navigation, responsive grid, and touch-friendly sliders. | `feat(ui): implement Layout component with mobile drawer` |
| **Granular Error Handling & Action Buttons** | Added specific network mismatch and extension download recovery buttons directly inside error alerts. | `fix(wallet): enhance error alerting with direct recovery actions` |

---

## Level 6 Improvements

| Change | User Feedback That Triggered It | Status |
|--------|--------------------------------|--------|
| **Verifiable Solvency Audit Certificate Modal** | Depositors and auditors needed a cryptographically sealed, printable audit certificate containing block height, transaction ID, and commitment hash. | **Completed & Shipped** |
| **Interactive Solvency Gate Component (`SolvencyGate.tsx`)** | Users wanted an intuitive, unified interface binding scenario selection, private witness configuration, and real-time backing ratio preview. | **Completed & Shipped** |
| **Contract Interaction Helpers (`src/utils/contract.ts`)** | Developers requested structured SDK helpers for generating blinding salts, computing SHA-256 commitments, and evaluating threshold constraints. | **Completed & Shipped** |
| **Dedicated Community Feedback & Validation Hub** | Testers requested a transparent in-dApp view of community validation metrics (50/50 L5 users, 20/20 L6 launch testers). | **Completed & Shipped** |
