import React, { useState, useMemo } from 'react';

interface ScenarioPreset {
  id: string;
  name: string;
  category: string;
  tag: string;
  reserves: number;
  liabilities: number;
  description: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'custodian',
    name: 'Tier-1 Crypto Custodian',
    category: 'Institutional',
    tag: '[CUSTODY]',
    reserves: 1250000000,
    liabilities: 1050000000,
    description: 'Conservative institutional reserve holding $200M surplus safety buffer.',
  },
  {
    id: 'stablecoin',
    name: 'Decentralized Stablecoin Backing',
    category: 'DeFi Protocol',
    tag: '[STABLECOIN]',
    reserves: 480000000,
    liabilities: 475000000,
    description: 'Tight collateralization margin (101.1%) backing circulating synthetic tokens.',
  },
  {
    id: 'insolvent',
    name: 'Under-Collateralized Risk (FTX Case)',
    category: 'High Risk Alert',
    tag: '[INSOLVENT]',
    reserves: 350000000,
    liabilities: 820000000,
    description: 'Critical insolvency scenario: Liabilities exceed reserves by $470M. Circuit REVERTS.',
  },
];

export const SolvencySimulator: React.FC = () => {
  const [reserves, setReserves] = useState<number>(1250000000);
  const [liabilities, setLiabilities] = useState<number>(1050000000);
  const [saltEntropy, setSaltEntropy] = useState<string>('9fa8c2e174b091f3a5e8c71b62d04a9e');

  const isSolvent = reserves >= liabilities;
  const surplus = reserves - liabilities;
  const ratio = liabilities > 0 ? ((reserves / liabilities) * 100).toFixed(1) : '100.0';

  // Compute deterministic simulated commitment hash in browser
  const simulatedCommitment = useMemo(() => {
    let str = `${reserves}-${liabilities}-${saltEntropy}`;
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `0x${hex}${saltEntropy.slice(0, 24)}...${hex}`;
  }, [reserves, liabilities, saltEntropy]);

  const handleRegenerateSalt = () => {
    const chars = '0123456789abcdef';
    let res = '';
    for (let i = 0; i < 32; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setSaltEntropy(res);
  };

  const applyPreset = (preset: ScenarioPreset) => {
    setReserves(preset.reserves);
    setLiabilities(preset.liabilities);
    handleRegenerateSalt();
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="simulator-card">
      <div className="simulator-header">
        <div className="flex items-center gap-3">
          <div className="icon-badge">
            <span className="font-mono text-xs text-blue-400 font-bold">[SIM]</span>
          </div>
          <div>
            <h3 className="simulator-title">Zero-Knowledge Solvency Sandbox</h3>
            <p className="simulator-sub">
              Interactive simulation of browser witness evaluation versus public Midnight consensus state.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-pill">
            <span className="font-mono text-xs text-slate-300">[CLIENT PROVER]</span>
          </span>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="preset-buttons-row">
        <span className="preset-label">Financial Scenarios:</span>
        <div className="preset-group">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className="preset-btn"
              title={p.description}
            >
              <span className="font-mono text-[10px] text-slate-400">{p.tag}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Live Ledger Contrast Grid */}
      <div className="simulator-grid">
        {/* Left Side: Client-Side Input & Secret Witnesses */}
        <div className="simulator-col simulator-col-private">
          <div className="col-header text-slate-200">
            <div className="flex items-center gap-2">
              <span className="col-title font-mono">[CONFIDENTIAL] Client Witness Memory</span>
            </div>
            <span className="badge-shield font-mono">[LOCAL ONLY]</span>
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="reserves-range">Total Reserve Assets (Private Witness):</label>
              <span className="control-val font-mono text-slate-100">{formatUSD(reserves)}</span>
            </div>
            <input
              id="reserves-range"
              type="range"
              min={100000000}
              max={2000000000}
              step={25000000}
              value={reserves}
              onChange={(e) => setReserves(Number(e.target.value))}
              className="slider-input slider-slate"
            />
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="liabilities-range">Customer Liabilities (Private Witness):</label>
              <span className="control-val font-mono text-slate-100">{formatUSD(liabilities)}</span>
            </div>
            <input
              id="liabilities-range"
              type="range"
              min={100000000}
              max={2000000000}
              step={25000000}
              value={liabilities}
              onChange={(e) => setLiabilities(Number(e.target.value))}
              className="slider-input slider-slate"
            />
          </div>

          <div className="salt-display-box">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Private Blinding Salt (Entropy):</span>
              <button
                onClick={handleRegenerateSalt}
                className="regen-salt-btn"
                title="Generate new blinding salt"
              >
                <span className="font-mono text-xs mr-1">[REROLL]</span>
                <span>Reroll Salt</span>
              </button>
            </div>
            <code className="salt-code truncate font-mono text-xs text-slate-300">
              0x{saltEntropy}
            </code>
          </div>

          <div className="internal-math-card">
            <div className="math-row">
              <span>Internal Reserve Ratio:</span>
              <span className={`font-bold font-mono ${isSolvent ? 'text-emerald-400' : 'text-rose-400'}`}>
                {ratio}%
              </span>
            </div>
            <div className="math-row">
              <span>Internal Delta / Surplus:</span>
              <span className={`font-mono ${isSolvent ? 'text-emerald-400' : 'text-rose-400'}`}>
                {surplus >= 0 ? `+${formatUSD(surplus)}` : `-${formatUSD(Math.abs(surplus))}`}
              </span>
            </div>
            <p className="math-hint font-mono text-[11px]">
              [PRIVACY INVARIANT] Neither the reserve ratio ({ratio}%) nor the exact surplus figure is ever revealed to on-chain observers.
            </p>
          </div>
        </div>

        {/* Right Side: What Midnight Public Blockchain Sees */}
        <div className="simulator-col simulator-col-public">
          <div className="col-header text-slate-200">
            <div className="flex items-center gap-2">
              <span className="col-title font-mono">[PUBLIC RECORD] On-Chain Ledger State</span>
            </div>
            <span className="badge-public font-mono">[CONSENSUS BOUND]</span>
          </div>

          <div className="circuit-evaluation-box">
            <div className="eval-status-row">
              <span className="eval-label">Compact Circuit Constraint:</span>
              <code className="eval-constraint">assert(reserves &gt;= liabilities)</code>
            </div>

            <div className={`eval-banner ${isSolvent ? 'eval-solvent' : 'eval-insolvent'}`}>
              {isSolvent ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">[PASS]</span>
                  <div>
                    <div className="font-bold text-emerald-300 text-sm font-mono">[CIRCUIT PASSED: SOLVENT]</div>
                    <div className="text-xs text-slate-300">
                      Zero-knowledge proof satisfies all polynomial constraints. State transition authorized.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400">[REVERT]</span>
                  <div>
                    <div className="font-bold text-rose-300 text-sm font-mono">[CIRCUIT REVERTED: INSOLVENT]</div>
                    <div className="text-xs text-slate-300">
                      Assertion violated: Reserves do not cover liabilities. Proof cannot be forged.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="public-ledger-fields">
            <div className="ledger-field-item">
              <span className="field-key">solvency_status (Public Ledger):</span>
              <span className={`field-value font-mono font-bold ${isSolvent ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSolvent ? 'true [PASS]' : 'false [REVERT]'}
              </span>
            </div>

            <div className="ledger-field-item">
              <span className="field-key">commitment_hash (Audit Anchor):</span>
              <span className="field-value font-mono text-slate-200 text-xs truncate" title={simulatedCommitment}>
                {simulatedCommitment}
              </span>
            </div>

            <div className="ledger-field-item">
              <span className="field-key">total_reserves on-chain:</span>
              <span className="field-value font-mono text-slate-400">
                [NOT PUBLISHED | ZERO KNOWLEDGE]
              </span>
            </div>

            <div className="ledger-field-item">
              <span className="field-key">total_liabilities on-chain:</span>
              <span className="field-value font-mono text-slate-400">
                [NOT PUBLISHED | ZERO KNOWLEDGE]
              </span>
            </div>
          </div>

          <div className="audit-guarantee-note">
            <span className="font-mono text-xs text-emerald-400 mr-1">[GUARANTEE]</span>
            <span className="text-xs text-slate-300 font-mono">
              [OBSERVER GUARANTEE] Even continuous ledger inspection reveals only the binary verification status and commitment digest.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvencySimulator;
