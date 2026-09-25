# Proofolio: Confidential Solvency & Eligibility Gate
![CI](https://github.com/shivam-1410/Proofolio/actions/workflows/ci.yml/badge.svg)
> Zero-Knowledge Proof-of-Reserves & Solvency Gate protocol built on Midnight Network that mathematically certifies asset backing without disclosing balance sheets or customer deposits.

## Live Demo
- **Primary Production URL (Vercel):** [https://proofolio-ochre.vercel.app](https://proofolio-ochre.vercel.app)
- **GitHub Pages Mirror:** [https://shivam-1410.github.io/Proofolio/](https://shivam-1410.github.io/Proofolio/)

## Contract Address
| Network | Address |
|---|---|
| Preprod | `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d` |

- **Deployed Contract Address:** `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d`
- **Deployer / Institution Address:** `mn_addr_preview1j4qdvwggfyz43g8yuhata2ejszt23kc3nxwn2lfyvs0dwp4g37vsgxaku5`
- **Initial Deployment Block:** `900782`
- **Verified Proof Transaction:** `00ec78c9bd1fe53a7b77e09b52c28022a06b7736fc550da2b28f8fb60e8707aea6` (Block `900942`)

## What This Product Does
Centralized exchanges, digital asset custodians, decentralized lending desks, and financial institutions face an existential transparency dilemma: depositors and regulatory authorities demand mathematical proof that customer deposits are 100% backed (`total_reserves >= total_liabilities`). However, publishing raw balance sheets publicly exposes confidential business strategies, invites predatory front-running by market competitors, and breaches user financial privacy.

Traditional third-party accounting audits fail to solve this dilemma: they are slow (conducted months after the fact), exorbitantly expensive, vulnerable to collusion, and powerless to detect rehypothecation between audit reporting dates.

**Proofolio** resolves this crisis using zero-knowledge smart contracts on the **Midnight Network**. Through an intuitive client-side dApp connecting to the **Lace wallet**, an institution evaluates balance sheet assets and liabilities inside a browser-based ZK circuit. The circuit generates a cryptographic proof verifying that reserves exceed customer liabilities, which is then submitted and validated on-chain. The public ledger records an immutable certification of solvency without disclosing the underlying asset balances or depositor totals.

## Privacy Model
- **What is PUBLIC (on-chain, visible to anyone):**
  - `solvency_status: Boolean` — On-chain flag indicating whether the institution has satisfied the mathematical solvency constraint (`reserves >= liabilities`).
  - `last_verified_block: Uint<64>` — Block height / timestamp recording when the proof was verified on-chain.
  - `commitment_hash: Bytes<32>` — Cryptographic audit commitment binding the proof to a specific balance sheet snapshot.
- **What is PRIVATE (private witness, never on-chain):**
  - `total_reserves: Uint<64>` — Exact reserve assets held and controlled by the institution (e.g. `$12,500,000`).
  - `total_liabilities: Uint<64>` — Exact customer deposit liabilities and obligations owed (e.g. `$9,800,000`).
  - `salt: Bytes<32>` — Cryptographic blinding entropy preventing brute-force deduction of financial positions.
- **What the user PROVES without revealing:**
  - The zero-knowledge circuit strictly enforces `assert(total_reserves >= total_liabilities)`.
  - The ZK proof guarantees mathematical solvency with 100% cryptographic certainty.
  - Selective disclosure (`disclose()`) guarantees that neither raw reserves, liabilities, nor customer balances are ever emitted to ledger state, block headers, or transaction payloads.
  - Proved without revealing your input.

## Privacy Claim
What an on-chain observer sees vs cannot see:
- **What an on-chain observer SEES:**
  - The verified boolean certification (`solvency_status = true`).
  - The timestamp / block index of the attestation (`last_verified_block = #900942`).
  - The cryptographic commitment hash binding the attestation to an immutable snapshot.
- **What an on-chain observer CANNOT see:**
  - The total reserve asset balance or currency breakdown.
  - The total customer liabilities or individual user balances.
  - The surplus or reserve ratio magnitude (e.g. whether 101% or 200% backed).
  - The blinding salt or any intermediate witness calculation.

## Tech Stack
Midnight network, Compact, Midnight.js SDK, React/Vite, Lace wallet
- **Smart Contract Language:** Compact (`contracts/proof_of_reserves.compact`, `contracts/counter.compact`)
- **ZK Protocol & SDK:** `@midnight-ntwrk/dapp-connector-api@4.0.1`, `@midnight-ntwrk/compact-runtime@0.16.0`, `@midnight-ntwrk/midnight-js-contracts@4.1.1`
- **Frontend Framework:** React 19, TypeScript, Vite 8
- **Styling & UI:** Vanilla CSS design system with dark cyber/fintech aesthetics and Lucide icons
- **Wallet Support:** Midnight Lace Wallet DApp Connector (`window.midnight.mnLace`) + Built-in Simulated Demo Mode

## Prerequisites
- Lace wallet installed (with Midnight Preprod testnet support)
- Node.js v22 (`node -v` >= 22.0.0)
- npm / npx
- Docker (optional, for local proof-server)

## Setup & Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/shivam-1410/Proofolio.git
   cd Proofolio
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Start the local frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   ```bash
   http://localhost:5173
   ```
5. Compile Compact circuits:
   ```bash
   npm run compile
   ```
6. Run the automated test suite:
   ```bash
   npm test
   ```
7. Build production bundle:
   ```bash
   npm run build
   ```

## Run Tests
Run the comprehensive test suite with 10 passing tests across 3 suites:

```bash
npm test
```

Suite includes:
1. `tests/counter.test.ts` — Tests circuit logic, state transitions, and privacy invariants.
2. `tests/proof_of_reserves.test.ts` — Tests initial ledger state, valid solvency execution, insolvency revert assertion, and selective disclosure.
3. `tests/eligibility_gate.test.ts` — Tests exact boundary conditions, blinding salt uniqueness, and surplus zero-knowledge protection.

## CI/CD
The automated GitHub Actions pipeline is configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
- **Triggers:** Automatically on every `push` to `main` and on every `pull_request` targeting `main`.
- **Pipeline Stages:**
  1. Check out code repository
  2. Setup Node.js v22 with npm dependency caching
  3. Install dependencies (`npm install`)
  4. Compile Compact circuits (`compact compile` / `npm run compile`)
  5. Run complete circuit test suite (`npm test`)
  6. Build production frontend bundle (`npm run build`)
- **Status:** Verified passing with zero warnings or errors.

## Usage Guide
See [docs/USAGE.md](docs/USAGE.md) for full step-by-step documentation, including 'Getting Started on Preprod' and 'Your First Transaction'.

## Feedback & Iterations
See [docs/FEEDBACK.md](docs/FEEDBACK.md) for the complete raw feedback log, stakeholder interviews, and engineering changelog.

Summary of top changes made from user feedback:
- **1-Click Institution Presets:** Rapid one-click evaluation of Tier-1 Exchange ($12.5M / $9.8M), DeFi Lending Vault ($45M / $38.2M), and DAO Treasury ($8.2M / $5.1M) scenarios without manual number entry.
- **Exportable Verifiable Audit Certificate:** Printable, cryptographically sealed solvency certificate containing block height, transaction ID, and commitment hash for depositors and auditors.
- **Simulated Demo Wallet Mode:** Instant zero-friction onboarding allowing users and evaluators to test client-side ZK proving immediately without needing the Lace extension pre-installed.

## Level 5 — User Validation
- Target: 50 Preprod users
- Current: 50 / 50 verified wallet addresses
- See [USERS.md](USERS.md) for full list of verified wallet addresses
- See [docs/FEEDBACK.md](docs/FEEDBACK.md) for feedback log and iterative changes

## Level 6 Users
See [LAUNCH_USERS.md](LAUNCH_USERS.md) for the registry of 20 verified launch onboarding testers on Midnight Preprod.

## Product Proposal
See [PROPOSAL.md](PROPOSAL.md)

## Product X Profile
[https://x.com/ProofolioZK](https://x.com/ProofolioZK) *(Placeholder - Account handle reserved for mainnet launch)*

## Brand Assets
[Brand Assets & Identity Brief](docs/BRAND_BRIEF.md) *(Includes logo, color palette, typography tokens, and social banner concept)*
