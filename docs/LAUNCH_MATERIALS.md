# Proofolio: Launch, Outreach & Onboarding Materials

---

## 1. Level 6: Step-by-Step Onboarding Script for 20 Users

Send this personal onboarding guide directly to each of the 20 preprod testers:

```text
Hello [Name],

Thanks for joining the early testing cohort for Proofolio: the zero-knowledge Proof-of-Reserves protocol on Midnight Network. Here is your quick 2-minute testing guide:

1. What to Install:
   - Install the Midnight Lace Wallet extension (Chrome/Brave/Edge): https://midnight.network
   - Open Lace Settings -> switch network to "Midnight Preprod".
   - (Optional faucet for free test tDU: https://faucet.preprod.midnight.network)

2. How to Test Proofolio on Preprod:
   - Visit the live dApp: https://shivam-1410.github.io/Proofolio/
   - Click "Connect Lace Wallet" (or click "Connect Demo Wallet" for instant test mode).
   - Under the Solvency Gate, select a preset scenario (e.g. Tier-1 Exchange or DeFi Vault).
   - Click "Generate ZK Proof & Submit to Preprod".
   - Watch the zero-knowledge proof generate right in your browser without exposing any private numbers.
   - View your confirmed on-chain transaction and click "View Verifiable Certificate".

3. How to Confirm Your Wallet Address:
   - Copy your Midnight Preprod wallet address from Lace (starts with mn_addr_preview...) and reply with it here so I can add you to our official LAUNCH_USERS.md registry on GitHub.

Looking forward to your verification notes and feedback.
```

---

## 2. Level 5: User Acquisition Materials

### a) Discord / Telegram Message (Under 100 words)
```text
Hello everyone: Just launched Proofolio on Midnight Preprod: a confidential Proof-of-Reserves dApp that mathematically certifies exchange/custodian solvency (reserves >= liabilities) without revealing balance sheets or customer numbers.

Looking for 50 builders to test it:
1. Connect Lace Wallet on Preprod: https://shivam-1410.github.io/Proofolio/
2. Run a ZK solvency proof in your browser in under 15 seconds.
3. Drop your wallet address & feedback below so I can add you to our verified testnet registry.

Let me know what you think.
```
*(Word count: 83 words)*

### b) X (Twitter) Post (Under 280 characters)
```text
Custodians need to prove 100% solvency without doxxing customer balances or balance sheets. 

Proofolio solves this with zero-knowledge on @MidnightNtwrk Preprod. 

Try the live dApp, generate a ZK proof in your browser & share feedback:
https://shivam-1410.github.io/Proofolio/
```

### c) Direct DM Template for College & Developer Contacts
```text
Hello [Name], hope you are doing well.

I just launched Proofolio: a zero-knowledge Proof-of-Reserves protocol built on the Midnight Network for the Midnight Builder Challenge.

It lets institutions mathematically prove that assets exceed customer liabilities without disclosing sensitive balance sheet data. All ZK proofs are computed directly in client-side WebAssembly memory via private witnesses.

Would love your quick feedback on the flow and UX:
- Live dApp: https://shivam-1410.github.io/Proofolio/
- GitHub: https://github.com/shivam-1410/Proofolio

If you have 2 minutes to test it out (works with Lace wallet or instant demo mode), let me know your wallet address so I can feature you in our official preprod tester registry. Thanks!
```

---

## 3. Level 4: X Profile Launch Posts (3 Ready-to-Post Tweets)

### Tweet 1: Product Overview & Why Midnight
```text
Announcing Proofolio: Confidential Solvency & Proof-of-Reserves built on @MidnightNtwrk.

Transparent chains force exchanges to choose between leaking sensitive balance sheets or relying on dated accounting audits.

Proofolio uses zero-knowledge to prove 100% backing without exposing numbers.
```

### Tweet 2: Technical Privacy Insight
```text
How does Proofolio achieve zero disclosure?

1. total_reserves & total_liabilities stay in browser memory as private witnesses.
2. Compact circuit asserts: reserves >= liabilities.
3. Selective disclosure only commits: solvency_status = true & 32-byte audit hash.

Proved without revealing your input.
```

### Tweet 3: Call to Try the Preprod Demo
```text
Proofolio is LIVE on Midnight Preprod.

Experience client-side zero-knowledge proof generation in your browser:
- Connect Lace Wallet
- Execute ZK Solvency Gate
- Verify confirmed on-chain certification

Try the live dApp: https://shivam-1410.github.io/Proofolio/

Contract: 25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d
```

