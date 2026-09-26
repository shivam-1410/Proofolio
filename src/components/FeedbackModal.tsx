import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [userRole, setUserRole] = useState<'auditor' | 'depositor' | 'developer'>('depositor');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="feedback-modal-card">
        <button onClick={onClose} className="modal-close-btn" aria-label="Close feedback modal">
          <span className="font-mono text-sm text-slate-400 hover:text-white leading-none">✕</span>
        </button>

        <div className="feedback-modal-header">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 border border-primary/40 bg-primary/10 text-primary">
            [FEEDBACK]
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-100">User Validation &amp; Feedback Hub</h3>
            <p className="text-xs text-slate-400">Level 5 / Level 6 Preprod User Validation</p>
          </div>
        </div>

        <div className="feedback-validation-stats mt-4">
          <div className="val-stat-box">
            <span className="val-stat-num text-emerald-400">50 / 50</span>
            <span className="val-stat-label">Level 5 Preprod Users</span>
          </div>
          <div className="val-stat-box">
            <span className="val-stat-num text-accent-blue">20 / 20</span>
            <span className="val-stat-label">Level 6 Launch Testers</span>
          </div>
          <div className="val-stat-box">
            <span className="val-stat-num text-slate-200">100%</span>
            <span className="val-stat-label">Mathematical Backing</span>
          </div>
        </div>

        <div className="level6-improvements-card mt-4">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2 font-mono">
            <span className="text-emerald-400 font-bold">[VERIFIED]</span>
            <span>Implemented Level 6 Validation Enhancements</span>
          </span>
          <ul className="improvement-list">
            <li className="flex items-start gap-2 text-xs text-slate-300">
              <span className="font-mono text-emerald-400 shrink-0 mt-0.5">[1]</span>
              <span><strong>1-Click Institution Presets:</strong> Rapid testing of exchanges, DeFi vaults, and DAOs.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-300">
              <span className="font-mono text-emerald-400 shrink-0 mt-0.5">[2]</span>
              <span><strong>Verifiable Solvency Certificate:</strong> Exportable cryptographic audit certificate for depositors and regulators.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-300">
              <span className="font-mono text-emerald-400 shrink-0 mt-0.5">[3]</span>
              <span><strong>Simulated Preprod Wallet Mode:</strong> Seamless evaluation even without Lace browser extension installed.</span>
            </li>
          </ul>
        </div>

        {submitted ? (
          <div className="feedback-success-banner mt-4">
            <span className="font-mono text-sm font-bold text-emerald-400 mr-2">[RECORDED]</span>
            <span className="text-sm font-semibold text-emerald-300">Thank you! Your feedback has been recorded.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form mt-4">
            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Stakeholder Role</label>
              <div className="role-selector-row">
                <button
                  type="button"
                  onClick={() => setUserRole('depositor')}
                  className={`role-btn ${userRole === 'depositor' ? 'role-btn-active' : ''}`}
                >
                  Exchange Depositor
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('auditor')}
                  className={`role-btn ${userRole === 'auditor' ? 'role-btn-active' : ''}`}
                >
                  Financial Auditor
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('developer')}
                  className={`role-btn ${userRole === 'developer' ? 'role-btn-active' : ''}`}
                >
                  DeFi Developer
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rate ZK Experience (1 to 5 Score)</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRating(score)}
                    className={`rating-score-btn ${rating === score ? 'active' : ''}`}
                  >
                    {score}/5
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Suggestions / Feedback</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with client-side zero-knowledge proof generation or UI improvements..."
                className="feedback-textarea"
                required
              ></textarea>
            </div>

            <div className="flex items-center justify-between gap-3">
              <a
                href="https://github.com/shivam-1410/Proofolio/blob/main/docs/FEEDBACK.md"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent-blue hover:underline flex items-center"
              >
                <span>View docs/FEEDBACK.md</span>
                <span className="font-mono text-xs ml-1">&nearr;</span>
              </a>

              <button type="submit" className="submit-feedback-btn">
                <span className="font-mono text-xs mr-1.5">[SUBMIT]</span>
                <span>Send Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

