# Product Proposal

## What is the product, and who uses it?
**Proofolio** is an institutional zero-knowledge **Solvency & Eligibility Gate** built on the **Midnight Network**. It enables centralized crypto exchanges, custody providers, decentralized lending protocols, and DAO treasury managers to mathematically certify that their reserve assets meet or exceed their customer liabilities and debt obligations (`total_reserves >= total_liabilities`) with 100% cryptographic certainty—**without disclosing raw asset quantities, client deposit amounts, or proprietary portfolio allocations**.

### Who Uses It:
1. **Centralized Exchanges & Custodians (e.g. Coinbase, Binance, BitGo):** To prove 1:1 asset backing to depositors and regulatory authorities without exposing corporate liquidity reserves or sensitive trade positions to competitors.
2. **DeFi Lending Desks & Prime Brokers:** To verify borrower collateral adequacy and debt eligibility in real time without leaking client account balances or liquidation thresholds.
3. **DAO Treasuries & Web3 Foundations:** To prove runway solvency and debt backing to token holders without disclosing strategic market accumulation or confidential investment operations.
4. **Institutional Depositors & Retail Users:** To verify with absolute mathematical confidence that customer funds are fully backed on an immutable public ledger.

---

## Why Midnight specifically?
Transparent blockchains (such as Ethereum, Solana, or Bitcoin) enforce a catastrophic trade-off for institutions: all contract states and transaction inputs are 100% public. If an exchange attempts to publish proof-of-reserves on Ethereum, it must either:
- Disclose its exact balance sheet numbers publicly, inviting predatory front-running, trading counterparty exploitation, and customer financial privacy violations; or
- Rely on centralized off-chain accounting firms whose reports are dated, expensive, and vulnerable to rehypothecation between audit snapshots.

Midnight uniquely resolves this through its **native dual-state architecture** and **Compact language**:
- **Client-Side Private Proving:** Sensitive financial figures (`total_reserves`, `total_liabilities`, and blinding entropy) are evaluated entirely inside client browser memory via private witnesses. They never enter the network or block headers.
- **Selective On-Chain Disclosure (`disclose()`):** The zero-knowledge circuit enforces the mathematical constraint `total_reserves >= total_liabilities` and selectively discloses only the binary solvency certification (`solvency_status = true`), block height timestamp, and cryptographic commitment hash to the public ledger.
- **Native Compliance & Privacy:** Midnight enables compliance-ready zero-knowledge verification where proofs are publicly auditable by anyone, while the underlying financial data remains completely confidential.

---

## Data Model

| Data Point | Type | Disclosed To | Description |
|---|---|---|---|
| `solvency_status` | Public ledger | Everyone | Boolean flag (`true`/`false`) certifying whether reserves meet liabilities. |
| `last_verified_block` | Public ledger | Everyone | Midnight block height recording proof freshness and timestamp. |
| `commitment_hash` | Public ledger | Everyone | 32-byte SHA-256 cryptographic audit commitment anchoring the proof. |
| `total_reserves` | Private witness | No one | Exact reserve balance held by the institution (e.g. $12,500,000). |
| `total_liabilities` | Private witness | No one | Exact customer deposit obligations (e.g. $9,800,000). |
| `salt` | Private witness | No one | 32-byte cryptographic blinding entropy preventing dictionary/rainbow table attacks. |
| `surplus_delta` | Private circuit logic | No one | Surplus margin (`reserves - liabilities`) computed in ZK but never exposed. |

---

## Mainnet Feasibility
**Yes, Proofolio is 100% realistic to reach Mainnet by Level 6 and launch as a production-grade commercial startup.**

### Technical Feasibility:
- **Production Compact Smart Contracts:** Written and compiled with `compactc 0.31.1` targeting the official Midnight specification. Both `contracts/proof_of_reserves.compact` and `contracts/counter.compact` compile and test with zero errors.
- **Client-Side Browser Proving:** Full integration with `@midnight-ntwrk/dapp-connector-api@4.0.1` and the Midnight Lace wallet.
- **Preprod On-Chain Deployment:** Successfully deployed and verified on Midnight Preprod at address:  
  `25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d` (Block `#900942`).
- **Comprehensive Automated CI/CD:** Passing 10 automated unit and integration tests across 3 suites on every GitHub commit.

### Commercial Feasibility & Go-To-Market:
- Immediate enterprise demand in the wake of centralized custody failures.
- Zero-knowledge audit certificates offer continuous, automated attestation at a fraction of the cost of traditional quarterly audits.
- Multi-currency Merkle sum tree expansion roadmap ready for institutional enterprise pilots.
