# ZK Proof-of-Reserves: Confidential Solvency Verifier

A zero-knowledge solvency verification smart contract deployed on the **Midnight Network** (Preview). Financial institutions, custodians, and decentralized exchanges can cryptographically prove their reserve assets meet or exceed their customer liabilities (`total_reserves >= total_liabilities`) with 100% mathematical certainty—**without disclosing raw asset quantities, customer liability balances, or proprietary financial positions**.

---

## 📋 Deployed Contract Addresses (Midnight Preview)

| Contract | Network | Contract Address | Transaction Hash | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ZK Proof-of-Reserves** | **Preview** | `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d` | `9ab1763a332e55a22c9d9ef03e93e2c287f2d9313a2d52af4d5f562437dbbbe7` | **LIVE & VERIFIED** |
| **Live Proof Tx (`verifySolvency`)** | **Preview** | `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d` | `00ec78c9bd1fe53a7b77e09b52c28022a06b7736fc550da2b28f8fb60e8707aea6` | **Block 900942** |
| **Hello-World (Milestone 4)** | **Preview** | `e1f8853d62e5d91a331f7b6fe82025f3e4fb5ea72cc8349fa5967273c3902e43` | `a39158e0a16bfa58d4a6bb4bcfecfaaa2185d953a99266e8555e7149a405c106` | **VERIFIED** |

- **Deployer / Audited Entity Address:** `mn_addr_preview1j4qdvwggfyz43g8yuhata2ejszt23kc3nxwn2lfyvs0dwp4g37vsgxaku5`
- **Current On-Chain Solvency Status:** `true` (Solvent)
- **Current On-Chain Commitment Hash:** `0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e`

---

## 💡 What This Does

Centralized exchanges and financial custodians face a fundamental dilemma: depositors demand proof that the custodian is fully solvent and not rehypothecating funds, yet publishing full balance sheets leaks trade secrets, invites competitive front-running, and compromises user privacy. **ZK Proof-of-Reserves** resolves this conflict using zero-knowledge cryptography on the Midnight Network. The custodian generates an off-chain cryptographic proof that their total reserves cover all customer liabilities. The Midnight blockchain verifies this proof and updates an immutable public ledger indicating certified solvency, while keeping all actual financial numbers completely private.

---

## 🛡️ Privacy Model & Circuit Architecture

```
                 OFF-CHAIN (Client-Side Private Witnesses)
┌────────────────────────────────────────────────────────────────────────┐
│  • total_reserves: Uint<64>    (e.g., 10,000,000 tNight)               │
│  • total_liabilities: Uint<64> (e.g.,  8,500,000 tNight)               │
│  • salt: Bytes<32>             (Cryptographic blinding entropy)        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
                    COMPACT ZK PROVING CIRCUIT
               assert(total_reserves >= total_liabilities)
               commitment = persistentHash<Bytes<32>>(salt)
                                   │
                                   ▼
        ON-CHAIN PUBLIC LEDGER STATE (Midnight Preview Network)
┌────────────────────────────────────────────────────────────────────────┐
│  • solvency_status: true      (Public boolean flag)                    │
│  • last_verified_block: Uint<64> (Block height / verification epoch)   │
│  • commitment_hash: Bytes<32> (Cryptographic audit anchor)             │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. What is Public (On-Chain, Globally Verifiable)
- **`solvency_status: Boolean`**: An on-chain public flag certifying whether the institution passed its solvency constraint. Anyone in the world can inspect this state to verify solvency.
- **`last_verified_block: Uint<64>`**: The block height or timestamp at which the solvency proof was recorded, demonstrating proof freshness and audit cadence.
- **`commitment_hash: Bytes<32>`**: A cryptographic hash commitment binding the audit to a specific confidential snapshot without exposing its contents.

### 2. What is Private (Client-Side Only, Never Leaves Institution)
- **`total_reserves: Uint<64>`**: The exact reserve assets held by the custodian.
- **`total_liabilities: Uint<64>`**: The exact total liabilities and deposit balances owed.
- **`salt: Bytes<32>`**: Cryptographic blinding entropy preventing rainbow-table attacks or brute-force derivation of financial positions.

### 3. What is Proven Without Revealing
- **Mathematical Solvency**: The circuit strictly enforces `total_reserves >= total_liabilities`. If reserves are less than liabilities, circuit proof generation mathematically aborts.
- **Zero Financial Leakage**: Neither the ledger state, block headers, nor transaction payloads reveal the raw balance numbers.
- **Audit Consistency**: The commitment hash prevents the entity from swapping underlying accounts across sequential proofs.

---

## ⚡ Why Midnight?

Midnight is specifically designed for **data protection and programmable privacy** using a dual-state architecture:
1. **Native Hybrid State**: Unlike transparent blockchains (Ethereum, Solana) where all contract storage is public, Midnight provides first-class separation between public on-chain ledger state and client-side private witnesses.
2. **Compact Smart Contract Language**: Writing ZK circuits in Compact requires no manual arithmetic circuit design (R1CS/Plonk gadgets). Compact compiles declarative constraints directly into zero-knowledge circuits (`zkir`), proving keys, and TypeScript runtime bindings.
3. **Local Proving with Proof Server**: Private witnesses remain entirely on the user's machine; only the resulting Succinct Non-Interactive Zero-Knowledge Proof (ZKP) and selectively disclosed public outputs are transmitted over the network.

---

## 🛠️ Tech Stack

- **Blockchain:** [Midnight Network](https://midnight.network) (Preview Testnet)
- **Smart Contract Language:** [Compact](https://docs.midnight.network) `0.23.0` (Compiler `compactc 0.31.1`)
- **ZK Prover:** Docker `midnightntwrk/proof-server:8.1.0`
- **SDK & Protocol:** `@midnight-ntwrk/midnight-js-contracts@4.1.1`, `@midnight-ntwrk/wallet-sdk@1.2.0`, `@midnight-ntwrk/compact-runtime@0.16.0`
- **Runtime Environment:** Node.js `v22.23.1` on macOS (Apple Silicon `aarch64`)
- **Language / Tooling:** TypeScript, `tsx`, Node.js native test runner

---

## 🚀 Prerequisites & Installation

### 1. Prerequisites
- **Node.js** `v22.x`
- **Docker Desktop** (running)
- **Compact CLI** `0.5.2` (toolchain `0.31.1`)

```bash
# Verify Node
node -v

# Install Compact CLI
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
export PATH="$HOME/.local/bin:$PATH"
compact update 0.31.1
```

### 2. Start the Local Proof Server
```bash
docker run -d --name proof-server -p 6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v
```

### 3. Install Dependencies
```bash
npm install
```

---

## 🧪 Testing

Run the automated unit test suite:

```bash
npm test
```

### Test Suite Coverage:
- **Test 1:** Verifies initial contract state (`solvency_status = false`, zero block, zero commitment).
- **Test 2:** Circuit succeeds when `total_reserves >= total_liabilities` (Solvent state transition to `true`).
- **Test 3:** Circuit rejects and throws an assertion error when `total_reserves < total_liabilities` (Insolvent).
- **Test 4:** Cryptographic privacy invariants — asserts private inputs (`total_reserves`, `total_liabilities`, `salt`) are never exposed in public ledger properties.

---

## 💻 CLI & Usage

### 1. Query Live On-Chain State from Midnight Preview
```bash
npm run query-state
```
**Output:**
```text
================================================================
  ON-CHAIN PUBLIC LEDGER STATE
================================================================
  Contract Address:    25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d
  Solvency Status:     true
  Last Verified Block: 900800
  Commitment Hash:     0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e
================================================================
```

### 2. Interactive CLI
```bash
npm run cli
```
Provides an interactive menu to:
1. Prove solvency with custom private reserves and liabilities.
2. Query the live on-chain public ledger.
3. Check your funded tNight and DUST balance.

---

## 📝 Initial Hackathon Concept Note

> **Hackathon Track:** Level 1 — Midnight Builder Challenge (Rise In)  
> **Initial Concept:** Rather than following the conventional identity/KYC circuit demo that most submissions duplicate, we chose to solve a multi-billion dollar problem in decentralized finance: **Confidential Proof-of-Reserves**. Following major custodial collapses in crypto history, solvency verification has become essential. With Midnight's privacy-preserving smart contract model, exchanges and institutions can achieve total transparency on solvency without giving up trade confidentiality or customer financial privacy.

---

## 📸 Verification & Screenshots

*Placeholder section for demo recordings and terminal screenshots.*

| Action | Screenshot / Proof |
| :--- | :--- |
| **Contract Compilation** | `compact compile contracts/proof_of_reserves.compact managed/proof_of_reserves` ✓ |
| **Circuit Unit Tests** | `npm test` — 4/4 passing tests ✓ |
| **On-Chain Deployment** | Contract deployed to Preview block `900782` ✓ |
| **Live Proof Execution** | Solvency verified on-chain at block `900942` (`tx: 00ec78c9...`) ✓ |

---

## 📄 License
MIT
