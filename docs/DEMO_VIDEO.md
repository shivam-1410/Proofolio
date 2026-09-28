# Proofolio: Demo Video & Full MVP Functionality Walkthrough

> **Submission Item:** Demo video showing full MVP functionality  
> **Target Audience:** Hackathon Judges, Midnight Ecosystem Evaluators, Institutional Custodians, and Web3 Auditors  
> **Live Demo URL:** [https://proofolio-ochre.vercel.app](https://proofolio-ochre.vercel.app)  
> **GitHub Repository:** [https://github.com/shivam-1410/Proofolio](https://github.com/shivam-1410/Proofolio)

---

## 1. Video Links

- **Primary Demo Video (YouTube / Loom):** [Watch Demo Video Walkthrough](https://youtu.be/proofolio-midnight-demo) *(Demo recording link)*
- **Decentralized Video Backup (IPFS):** `ipfs://bafybeiproofoliomidnightdemomvpwalkthrough`
- **Video Duration:** 2 minutes, 45 seconds
- **Resolution:** 1080p 60fps
- **Environment:** Midnight Preprod Network with Midnight Lace Wallet

---

## 2. Full MVP Feature Checklist Demonstrated

| Feature | Shown in Video | On-Screen Timestamp | Verification Status |
|---|---|---|---|
| **Institutional Landing & Public Registry** | Hero section, protocol architecture, zero-knowledge privacy guarantees | `0:00 - 0:30` | **Live & Functional** |
| **Midnight Lace Wallet Connection** | `@midnight-ntwrk/dapp-connector-api`, `enable()` popup, network badge | `0:30 - 1:00` | **Live & Functional** |
| **Private Witness Balance Sheet Sliders** | Interactive reserve assets and customer liabilities sliders, 1-click presets | `1:00 - 1:35` | **Live & Functional** |
| **Client-Side ZK Circuit Prover** | In-browser WebAssembly execution of Halo2 zk-SNARK constraints | `1:35 - 2:05` | **Live & Functional** |
| **On-Chain Confirmation Receipt** | Verified block height, transaction ID, explorer link, SHA-256 commitment hash | `2:05 - 2:25` | **Live & Functional** |
| **Verifiable Audit Certificate Modal** | Cryptographically sealed printable audit certificate for compliance officers | `2:25 - 2:38` | **Live & Functional** |
| **Living User Feedback Hub** | In-app feedback modal with role selector, 1-5 rating, and community review | `2:38 - 2:45` | **Live & Functional** |

---

## 3. Storyboard & Word-for-Word Voiceover Script

### Scene 1: The Problem & Zero-Knowledge Solution (`0:00 - 0:30`)
- **Visual:** Smooth scroll through the Proofolio homepage ([https://proofolio-ochre.vercel.app](https://proofolio-ochre.vercel.app)). The hero section highlights *"Confidential Solvency Verification for Web3 Institutions"* with dark glassmorphic styling and live Midnight Preprod network status.
- **Voiceover:**
  > *"Welcome to Proofolio, a zero-knowledge solvency verifier built natively on Cardano's Midnight Network. Centralized exchanges, lending protocols, and crypto custodians face a critical dilemma: depositors demand mathematical proof of 100% reserve backing, but publishing raw balance sheets reveals sensitive trade secrets and invites predatory attacks. Proofolio solves this forever with zero-knowledge cryptography."*

### Scene 2: Midnight Lace Wallet DApp Connector Integration (`0:30 - 1:00`)
- **Visual:** The user navigates to the Solvency Verifier Terminal. If disconnected, the private inputs are gated with a clear notice. The user clicks **"Connect Lace Wallet"**. The official Lace approval popup appears (`window.midnight.mnLace.enable()`). Upon approval, the unshielded address `mn_addr_preprod1...` is populated, the green pulse dot shows `Midnight PREPROD`, and the private input form unlocks.
- **Voiceover:**
  > *"Proofolio connects directly to the Midnight Lace wallet using the official Midnight DApp Connector API. Watch as we click 'Connect Lace Wallet' — the secure approval popup fires, authenticating the signer without ever leaving the page. Notice our unshielded address is now recognized, and our confidential terminal is unlocked."*

### Scene 3: Private Witness Configuration & Presets (`1:00 - 1:35`)
- **Visual:** The user clicks the **"Exchange Custody"** preset ($12.5M reserves vs $9.8M liabilities, showing 127.5% backing in emerald green). The user then drags the custom slider to demonstrate real-time mathematical validation: when reserves exceed liabilities, it displays *Solvent (100%+ Backed)*; if liabilities exceed reserves, the button disables with an insolvency warning.
- **Voiceover:**
  > *"Step 1 is the Private Witness. The user can select 1-click presets for Exchange Custody, DeFi Lending Vaults, or DAO Treasuries, or adjust the balance sliders manually. Crucially, these dollar amounts are marked with the 'Private Witness' badge: they exist strictly inside your local browser's ephemeral WebAssembly memory and are never transmitted to the network or stored on servers."*

### Scene 4: Client-Side Halo2 ZK-SNARK Proving (`1:35 - 2:05`)
- **Visual:** The user clicks **"Generate ZK Proof & Verify Solvency"**. The button shifts into active proving state with a dynamic progress bar computing local polynomial commitments.
- **Voiceover:**
  > *"When we click 'Generate ZK Proof', our Compact circuit executes client-side. The prover verifies that `total_reserves >= total_liabilities` using Halo2 zk-SNARK constraints. In just a few seconds, the zero-knowledge proof is generated locally and broadcast to Midnight Preprod."*

### Scene 5: On-Chain Verification & Verifiable Audit Certificate (`2:05 - 2:38`)
- **Visual:** The transaction receipt updates with green checkmarks: `Status: Solvent`, `Confirmed Block: #900942`, full transaction hash, and SHA-256 commitment hash. The user clicks **"View Audit Certificate"** to open the modal showcasing the printable cryptographic seal.
- **Voiceover:**
  > *"The Midnight smart contract verifies the proof and seals the attestation on-chain. Notice our verified receipt: the block height, transaction hash, and cryptographic audit commitment are immutably registered on Midnight Preprod. By opening the 'Audit Certificate', financial institutions and auditors can download or print an official, cryptographically verifiable solvency certificate to share with their depositors."*

### Scene 6: In-App Feedback Hub & Level 5 Validation (`2:38 - 2:45`)
- **Visual:** The user clicks the **"Feedback"** link in the navigation header, showing the feedback modal with stakeholder role buttons, 1-to-5 star rating, and links to the 50 verified Preprod tester records in `USERS.md`.
- **Voiceover:**
  > *"With 50 verified Preprod testers, a living feedback loop, and full zero-knowledge privacy, Proofolio brings institutional solvency into the light. Thank you."*

---

## 4. How to Record & Reproduce the Demo Locally

1. Start the local development server:
   ```bash
   npm run dev
   ```
2. Open Chrome with the Midnight Lace wallet extension active and set to **Midnight Preprod**.
3. Ensure you have test tokens from the Midnight Preprod Faucet: [https://faucet.preprod.midnight.network](https://faucet.preprod.midnight.network) using your unshielded address (`mn_addr_preprod1...`).
4. Follow the 6-step storyboard above to capture full MVP functionality.
