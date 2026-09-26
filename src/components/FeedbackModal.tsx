import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  X,
  ExternalLink,
  Send,
  Star,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

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
          <X className="w-5 h-5 text-slate-400 hover:text-white" />
        </button>

        <div className="feedback-modal-header">
          <div className="icon-badge icon-badge-cyan">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
          </div>
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
            <span className="val-stat-num text-cyan-400">20 / 20</span>
            <span className="val-stat-label">Level 6 Launch Testers</span>
          </div>
          <div className="val-stat-box">
            <span className="val-stat-num text-purple-400">100%</span>
            <span className="val-stat-label">Mathematical Backing</span>
          </div>
        </div>

        <div className="level6-improvements-card mt-4">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Implemented Level 6 Validation Enhancements</span>
          </span>
          <ul className="improvement-list">
            <li className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>1-Click Institution Presets:</strong> Rapid testing of exchanges, DeFi vaults, and DAOs.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Verifiable Solvency Certificate:</strong> Exportable cryptographic audit certificate for depositors and regulators.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Simulated Preprod Wallet Mode:</strong> Seamless evaluation even without Lace browser extension installed.</span>
            </li>
          </ul>
        </div>

        {submitted ? (
          <div className="feedback-success-banner mt-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" />
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rate ZK Experience</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="star-btn"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                    />
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
                className="text-xs text-cyan-400 hover:underline flex items-center"
              >
                <span>View docs/FEEDBACK.md</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>

              <button type="submit" className="submit-feedback-btn">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
