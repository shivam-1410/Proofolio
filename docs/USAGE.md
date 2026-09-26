# How to Use Proofolio

Proofolio is an institutional-grade zero-knowledge **Solvency & Eligibility Gate** built on the **Midnight Network**. It enables custodians, exchanges, and financial institutions to mathematically verify that reserve assets exceed customer deposit obligations without ever revealing underlying balance sheets, customer lists, or exact dollar amounts.

---

## What You Need

Before interacting with Proofolio on Midnight Preprod, ensure you have:

1. **Midnight Lace Wallet Extension:**
   - Install the Lace browser extension with Midnight Network support (available for Chrome/Brave/Edge).
   - Switch active network in Lace settings to **Midnight Preprod**.
   - Fund your unshielded/shielded address using the official Midnight Preprod Faucet: [https://faucet.preprod.midnight.network](https://faucet.preprod.midnight.network).

2. **Web Browser:**
   - Chrome, Brave, Edge, or Firefox with WebAssembly and Web Crypto API enabled.

3. **Node.js (for local execution):**
   - Node.js v22+ (`node -v >= 22.0.0`) and npm.

*(Note: If you do not have the Lace extension installed right now, Proofolio features a built-in **Simulated Demo Wallet Mode** allowing you to test client-side zero-knowledge proof generation immediately in your browser.)*

---

## Getting Started on Preprod

1. **Open the Live Application:**
   - Navigate to [https://shivam-1410.github.io/Proofolio/](https://shivam-1410.github.io/Proofolio/) or launch locally (`npm run dev`).
2. **Verify Preprod Network Indicator:**
   - The top navigation bar will display **Midnight Preprod** in green with an active pulse indicator.
   - The on-chain contract address is pre-loaded:
     `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d`
3. **Connect Your Wallet:**
   - Click **Connect Lace Wallet**.
   - Approve the connection prompt inside the Lace popup window.
   - Your unshielded address and shielded ZK address will appear securely on screen.

---

## Step-by-Step Guide

Follow these simple steps to perform an institutional zero-knowledge solvency verification:

### Step 1: Select an Institution Profile or Enter Custom Balances
- Choose one of the preset scenarios:
  - **Tier-1 Exchange Custody:** $12,500,000 Reserves / $9,800,000 Liabilities (127.5% Backing).
  - **DeFi Overcollateralized Vault:** $45,000,000 Reserves / $38,200,000 Liabilities (117.8% Backing).
  - **Protocol DAO Runway Reserve:** $8,200,000 Reserves / $5,100,000 Liabilities (160.8% Backing).
  - *Or adjust the sliders manually to formulate your private witness.*
- Notice the badge: `[PRIVATE WITNESS] Never On-Chain`. These figures exist solely within client browser memory.

### Step 2: Validate the Mathematical Constraint
- The client-side circuit checks that `total_reserves >= total_liabilities`.
- If reserves fall below liabilities, the circuit refuses execution with an insolvency safety warning.

### Step 3: Generate Zero-Knowledge Proof in Browser
- Click **Generate ZK Proof & Submit to Preprod**.
- The browser prover executes the Halo2 / Plonk polynomial commitment circuit locally.
- Watch the step-by-step proving progress bar as the cryptographic witness is generated.

### Step 4: Submit Proof to Midnight Preprod On-Chain
- The generated zero-knowledge proof along with the selective disclosure payload is broadcast to the Midnight network.
- The smart contract verifies the zk-SNARK proof and updates the on-chain ledger state.

### Step 5: View On-Chain Confirmation & Audit Certificate
- The transaction receipt displays:
  - **On-Chain Solvency Status:** `[STATUS: VERIFIED SOLVENT]`
  - **Confirmed Block Height:** (e.g. `#900942`)
  - **Transaction Hash:** Direct link to Midnight Preprod Explorer
  - **Cryptographic Audit Commitment:** 32-byte sha256 commitment binding the proof to the balance sheet snapshot.
- Click **View Verifiable Certificate** to view and print the official cryptographic certificate receipt.

---

## Your First Transaction

To perform your very first test transaction on Preprod:

```bash
# 1. Clone and install
git clone https://github.com/shivam-1410/Proofolio.git
cd Proofolio
npm install

# 2. Run the test suite to verify circuit logic
npm test

# 3. Start local development server
npm run dev
```

1. Open `http://localhost:5173` in your browser.
2. Click **Connect Demo Wallet (Test ZK Circuit)** if you want an instant zero-configuration walkthrough, or **Connect Lace Wallet** for live Preprod signing.
3. Click **Generate ZK Proof & Submit to Preprod**.
4. Within seconds, your proof is computed, validated, and verified!

---

## What Gets Proved (and What Stays Private)

| Parameter | Type | On-Chain Visibility | Privacy Guarantee |
| :--- | :--- | :--- | :--- |
| `solvency_status` | Boolean | **PUBLIC** (Everyone) | Displays `true` on-chain indicating full reserve backing. |
| `last_verified_block` | Uint<64> | **PUBLIC** (Everyone) | Freshness timestamp proving the audit occurred at a specific block. |
| `commitment_hash` | Bytes<32> | **PUBLIC** (Everyone) | Audit commitment anchoring proof to snapshot without revealing data. |
| `total_reserves` | Uint<64> | **PRIVATE** (No one) | Raw asset balances strictly kept in local client memory. |
| `total_liabilities` | Uint<64> | **PRIVATE** (No one) | Customer liabilities strictly kept in local client memory. |
| `salt` | Bytes<32> | **PRIVATE** (No one) | Cryptographic blinding entropy preventing dictionary attacks. |

**The Core Privacy Guarantee:**  
An on-chain observer or adversary inspecting the blockchain learns that an institution holds sufficient funds to cover 100% of liabilities, but **cannot deduce whether reserves are $10,000,000 or $10,000,000,000**, nor can they see individual customer balances.

---

## Troubleshooting

### 1. "Wallet not installed"
- Ensure the Midnight Lace extension is installed in your browser.
- Refresh the page after installing or enabling the extension.
- Alternatively, click **Connect Demo Wallet** to preview full functionality.

### 2. "Network Mismatch" Error
- Open the Lace Wallet extension &rarr; Settings &rarr; Network.
- Switch the active network to **Midnight Preprod**.
- Click the "Switch to Preprod & Reconnect" button in Proofolio.

### 3. "Insufficient gas / tDU balance"
- Solvency verification transactions require a nominal amount of test tDU for execution fees.
- Head to the [Midnight Preprod Faucet](https://faucet.preprod.midnight.network) to request test tokens to your Lace address.

### 4. "Mathematical Constraint Error (Insolvent)"
- The circuit strictly forbids generating proofs when `total_reserves < total_liabilities`.
- Ensure your reserve balance meets or exceeds customer liabilities before submitting.
