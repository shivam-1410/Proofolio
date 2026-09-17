# Proofolio: Confidential Solvency Verifier
> Zero-Knowledge Proof-of-Reserves dApp built on Midnight Network that mathematically proves asset solvency without disclosing balance sheets or customer numbers.

[![CI](https://github.com/shivam-1410/Proofolio/actions/workflows/ci.yml/badge.svg)](https://github.com/shivam-1410/Proofolio/actions)
[![Deploy](https://github.com/shivam-1410/Proofolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/shivam-1410/Proofolio/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Live Demo
🔗 **Live Application:** [https://shivam-1410.github.io/Proofolio/](https://shivam-1410.github.io/Proofolio/)
*(Also deployable to Vercel and Netlify with included `vercel.json` & `netlify.toml`)*

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d` |

*(Contract address is MANDATORY. Do not leave this blank.)*

- **Deployed Contract Address:** `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d`
- **Deployer / Institution Address:** `mn_addr_preview1j4qdvwggfyz43g8yuhata2ejszt23kc3nxwn2lfyvs0dwp4g37vsgxaku5`
- **Initial Deployment Block:** `900782`
- **Verified Proof Tx:** `00ec78c9bd1fe53a7b77e09b52c28022a06b7736fc550da2b28f8fb60e8707aea6` (Block `900942`)

---

## What This Does
Centralized exchanges, crypto custodians, and financial institutions face a critical transparency problem: depositors and regulators demand mathematical proof that customer deposits are 100% backed (`total_reserves >= total_liabilities`), yet disclosing complete balance sheets exposes confidential trade secrets, invites competitive front-running, and violates user financial privacy.

**Proofolio** resolves this dilemma using zero-knowledge cryptography on the **Midnight Network**. Through a browser-based dApp connecting directly to the **Lace wallet**, an institution or auditor evaluates balance sheet assets and liabilities inside a client-side zero-knowledge circuit. The circuit generates a cryptographic proof verifying that reserves exceed customer liabilities, which is then submitted and recorded on-chain. The public ledger is updated with an immutable certification of solvency without disclosing the underlying asset balances or customer totals.

---

## Privacy Model
- **What is PUBLIC:**
  - `solvency_status: Boolean` — Global boolean flag indicating whether the institution has satisfied the mathematical solvency constraint.
  - `last_verified_block: Uint<64>` — Block height / timestamp recording when the proof was verified on-chain.
  - `commitment_hash: Bytes<32>` — Cryptographic audit commitment binding the proof to a specific balance sheet snapshot.
- **What is PRIVATE:**
  - `total_reserves: Uint<64>` — Exact reserve assets held and controlled by the institution (e.g. `10,000,000`).
  - `total_liabilities: Uint<64>` — Exact customer deposit liabilities and obligations owed (e.g. `8,500,000`).
  - `salt: Bytes<32>` — Cryptographic blinding entropy preventing dictionary or brute-force derivation of financial positions.
- **What the user PROVES without revealing:**
  - The zero-knowledge circuit strictly enforces `total_reserves >= total_liabilities`.
  - The ZK proof guarantees mathematical solvency with 100% cryptographic certainty.
  - Selective disclosure (`disclose()`) guarantees that neither raw reserves, liabilities, nor customer balances are ever emitted to ledger state, block headers, or transaction payloads.
  - **Proved without revealing your input.**

---

## Observable Privacy Behavior
In traditional blockchain systems, verifying financial solvency requires either full disclosure of asset and liability balances on a public ledger, or reliance on trusted third-party auditing firms.

**Proofolio demonstrates observable privacy behavior through zero-knowledge execution:**
1. **Client-Side Private Witnessing:** The custodian's raw asset figures (`total_reserves = 12,500,000`) and customer deposit liabilities (`total_liabilities = 8,750,000`) exist solely inside local browser memory.
2. **Zero Information Leakage:** Neither the Vite frontend DOM, clear-text network requests, nor the transaction payload ever disclose the numerical figures.
3. **Succinct On-Chain Verification:** The Midnight blockchain verifies the mathematical constraint `total_reserves >= total_liabilities` via cryptographic proof. An on-chain observer sees that the entity is 100% solvent, yet possesses zero mathematical capability to determine whether reserves were 12.5M, 100M, or 10B.

---

## Privacy Claim
An on-chain observer or adversary inspecting the Midnight blockchain sees only the binary certification that the audited entity holds sufficient reserves to cover liabilities, along with an immutable cryptographic commitment hash and timestamp. The observer **CANNOT** deduce, estimate, or reconstruct the actual reserve balances, customer liabilities, or deposit sizes.

---

## Tech Stack
Midnight network, Compact, Midnight.js SDK, React/Vite, Lace wallet
- **Smart Contract Language:** Compact (`contracts/proof_of_reserves.compact`)
- **ZK Protocol & SDK:** `@midnight-ntwrk/dapp-connector-api@4.0.1`, `@midnight-ntwrk/compact-runtime@0.16.0`, `@midnight-ntwrk/midnight-js-contracts@4.1.1`
- **Frontend Framework:** React 19, TypeScript, Vite 8
- **Styling & UI:** Vanilla CSS design system with dark cyber/fintech aesthetics and Lucide icons
- **Wallet Support:** Midnight Lace Wallet DApp Connector (`window.midnight.mnLace`)

---

## Prerequisites
- Lace wallet installed (with Midnight testnet support)
- Node.js v22 (`node -v` >= 22.0.0)
- npm / npx

---

## Run Locally
Step-by-step instructions to clone, install, and run Proofolio:

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

# 5. (Optional) Run the automated circuit test suite
npm test

# 6. (Optional) Build production bundle
npm run build
```

---

## Demo Video
[PLACEHOLDER — I will add the link after recording]

---

## 📁 Repository Structure
```
Proofolio/
├── contracts/
│   └── proof_of_reserves.compact    # Compact ZK solvency verification contract
├── managed/
│   └── proof_of_reserves/           # Generated ZK keys, ZKIR, and TypeScript contract bindings
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx        # Lace wallet connect / disconnect UI & address display
│   │   └── CircuitCall.tsx          # Solvency circuit trigger, local ZK proof progress & on-chain receipt
│   ├── hooks/
│   │   └── useMidnight.ts           # Midnight.js SDK & Lace DApp connector hook
│   ├── App.tsx                      # Main Proofolio application dashboard
│   ├── main.tsx                     # Vite React entrypoint
│   ├── index.css                    # Modern dark theme stylesheet
│   ├── deploy.ts                    # Contract deployment script
│   ├── cli.ts                       # Interactive terminal CLI
│   └── network.ts                   # Midnight Preprod & Preview network configuration
├── tests/
│   └── proof_of_reserves.test.ts    # 4/4 passing unit tests covering circuit assertions & privacy invariants
├── public/
│   └── logo.svg                     # Proofolio brand icon
├── .github/
│   └── workflows/                   # CI workflow
├── vercel.json                      # Vercel deployment configuration
├── netlify.toml                     # Netlify deployment configuration
├── vite.config.ts                   # Vite build configuration
├── package.json
└── README.md
```

---

## 💡 Product Proposal: Confidential Eligibility & Solvency Gate
> **Chosen Level 3 Track:** *Age / Eligibility Gate — prove a threshold without revealing the underlying value*  
> **Full Design Document:** See [`PRODUCT_PROPOSAL.md`](file:///Users/shivam/Desktop/Proofolio/PRODUCT_PROPOSAL.md)

Proofolio operates as an institutional-grade zero-knowledge **Eligibility Gate**. Custodians and decentralized asset managers prove threshold compliance (`reserves >= liabilities` or `capital >= statutory_threshold`) without leaking proprietary balance sheets or depositor balances:
- **Threshold Gate Evaluation:** The Compact circuit strictly asserts `total_reserves >= total_liabilities`. If reserves fall below obligations, zero-knowledge proof generation aborts.
- **Selective Disclosure:** Only the binary certification (`solvency_status = true`), block height, and cryptographic commitment anchor are disclosed to the public ledger.
- **Tamper-Evident Freshness:** Commitments bind each attestation to a specific snapshot, preventing rehypothecation across audit epochs.

---

## 🧪 Verification & Test Results (7 Passing Tests)
Both contract and eligibility gate test suites run automatically in CI on every push:

```text
> npm test

  ✓ Initial ledger state verified (solvency_status = false)
  ✓ Circuit passed with total_reserves >= total_liabilities
    Reserves:    10,000,000 (Private)
    Liabilities: 8,500,000 (Private)
    Solvency:    true (Public)
    Block:       123456 (Public)
  ✓ Circuit rejected invalid state (reserves < liabilities) with assertion error
  ✓ Privacy guarantees verified: private witnesses strictly shielded from public ledger
▶ ZK Proof-of-Reserves Circuit & State Invariants
  ✔ Test 1: Initial state has solvency_status = false, zero block, and zero commitment (15.4ms)
  ✔ Test 2: Circuit execution succeeds when total_reserves >= total_liabilities (17.5ms)
  ✔ Test 3: Circuit execution reverts/fails when total_reserves < total_liabilities (2.6ms)
  ✔ Test 4: Privacy Invariants — private inputs are never exposed in public ledger state (4.4ms)
✔ ZK Proof-of-Reserves Circuit & State Invariants (40.5ms)

  ✓ Exact threshold boundary condition passed (100% reserve ratio verified)
  ✓ Cryptographic blinding ensures audit commitments cannot be correlated
  ✓ Public ledger contains zero fields revealing surplus assets or size magnitude
▶ Level 3: Confidential Eligibility Gate (Threshold Verification)
  ✔ Test 5: Eligibility Gate verifies exact threshold (total_reserves == total_liabilities) (16.8ms)
  ✔ Test 6: Multi-round proof uniqueness: separate blinding salts yield distinct commitments (8.0ms)
  ✔ Test 7: Observable Privacy Invariant: delta/surplus is zero-knowledge protected (7.7ms)
✔ Level 3: Confidential Eligibility Gate (Threshold Verification) (32.9ms)

ℹ total tests: 7 | pass: 7 | fail: 0 | 100% pass rate
```

---

## 📋 Level 3 Submission Checklist

| Requirement | Implementation & Proof | Status |
| :--- | :--- | :---: |
| **Fully functional dApp using Midnight privacy** | Proofolio implements selective disclosure with Lace wallet connector and browser proving | **PASS (✓)** |
| **Minimum 3 tests passing** | **7/7 automated unit and integration tests passing** across contract and eligibility gate suites | **PASS (✓)** |
| **CI/CD pipeline running** | Workflows in [`.github/workflows/ci.yml`](file:///Users/shivam/Desktop/Proofolio/.github/workflows/ci.yml) and [`.github/workflows/deploy.yml`](file:///Users/shivam/Desktop/Proofolio/.github/workflows/deploy.yml) | **PASS (✓)** |
| **Approved idea from provided list** | **Age / Eligibility Gate — prove a threshold without revealing the underlying value** (documented in [`PRODUCT_PROPOSAL.md`](file:///Users/shivam/Desktop/Proofolio/PRODUCT_PROPOSAL.md)) | **PASS (✓)** |
| **Minimum 10 meaningful commits** | **12+ structured commits** pushed to `origin main` | **PASS (✓)** |
| **Interactive UI with background figure** | Signature Midnight celestial figure (Half Light, Half Shadow) animated behind transparent glassmorphism UI | **PASS (✓)** |

---

## 📄 License
MIT License. Built for the Midnight Builder Challenge on Rise In.
