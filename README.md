# Proofolio: Confidential Solvency Verifier
![CI](https://github.com/shivam-1410/Proofolio/actions/workflows/ci.yml/badge.svg)
> Zero-Knowledge Proof-of-Reserves dApp built on Midnight Network that mathematically proves asset solvency without disclosing balance sheets or customer numbers.

## Live Demo
[https://shivam-1410.github.io/Proofolio/](https://shivam-1410.github.io/Proofolio/)

*(Also deployable to Vercel and Netlify via included `vercel.json` & `netlify.toml`)*

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d` |

- **Deployed Contract Address:** `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d`
- **Deployer / Institution Address:** `mn_addr_preview1j4qdvwggfyz43g8yuhata2ejszt23kc3nxwn2lfyvs0dwp4g37vsgxaku5`
- **Initial Deployment Block:** `900782`
- **Verified Proof Tx:** `00ec78c9bd1fe53a7b77e09b52c28022a06b7736fc550da2b28f8fb60e8707aea6` (Block `900942`)

## What This Does
Centralized exchanges, crypto custodians, and financial institutions face a critical transparency dilemma: depositors and regulators demand mathematical proof that customer deposits are 100% backed (`total_reserves >= total_liabilities`), yet disclosing complete balance sheets exposes confidential business secrets, invites predatory trading, and breaches user financial privacy.

**Proofolio** resolves this problem using zero-knowledge cryptography on the **Midnight Network**. Through a browser-based dApp connecting directly to the **Lace wallet**, an institution evaluates balance sheet assets and liabilities inside a client-side zero-knowledge circuit. The circuit generates a cryptographic proof verifying that reserves exceed customer liabilities, which is then submitted and verified on-chain. The public ledger records an immutable certification of solvency without disclosing the underlying asset balances or depositor totals.

## Privacy Model
- **PUBLIC:**
  - `solvency_status: Boolean` — On-chain flag indicating whether the institution has satisfied the mathematical solvency constraint (`reserves >= liabilities`).
  - `last_verified_block: Uint<64>` — Block height / timestamp recording when the proof was verified on-chain.
  - `commitment_hash: Bytes<32>` — Cryptographic audit commitment binding the proof to a specific balance sheet snapshot.
- **PRIVATE:**
  - `total_reserves: Uint<64>` — Exact reserve assets held and controlled by the institution (e.g. `10,000,000`).
  - `total_liabilities: Uint<64>` — Exact customer deposit liabilities and obligations owed (e.g. `8,500,000`).
  - `salt: Bytes<32>` — Cryptographic blinding entropy preventing brute-force deduction of financial positions.
- **PROVED without revealing:**
  - The zero-knowledge circuit strictly enforces `total_reserves >= total_liabilities`.
  - The ZK proof guarantees mathematical solvency with 100% cryptographic certainty.
  - Selective disclosure (`disclose()`) guarantees that neither raw reserves, liabilities, nor customer balances are ever emitted to ledger state, block headers, or transaction payloads.
  - Proved without revealing your input.

## Privacy Claim
What an on-chain observer sees vs cannot see:
- **What an on-chain observer SEES:**
  - The verified boolean certification (`solvency_status = true`).
  - The timestamp / block index of the attestation (`last_verified_block`).
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
- **Wallet Support:** Midnight Lace Wallet DApp Connector (`window.midnight.mnLace`)

## Prerequisites
- Lace wallet installed (with Midnight testnet support)
- Node.js v22 (`node -v` >= 22.0.0)
- npm / npx

## Setup & Run Locally
Step-by-step commands to clone, install, and run Proofolio locally:

```bash
# 1. Clone repository
git clone https://github.com/shivam-1410/Proofolio.git
cd Proofolio

# 2. Install dependencies
npm install

# 3. Start the local frontend development server
npm run dev

# 4. Open browser at:
# http://localhost:5173

# 5. Compile Compact circuits
npm run compile

# 6. Run automated test suite
npm test

# 7. Build production bundle
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

## Product Proposal
See [PROPOSAL.md](PROPOSAL.md)
