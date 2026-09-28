import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';

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
    try {
      const existing = JSON.parse(localStorage.getItem('proofolio_user_feedback') || '[]');
      existing.unshift({
        role: userRole,
        rating,
        comment,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('proofolio_user_feedback', JSON.stringify(existing.slice(0, 20)));
    } catch (err) {
      console.warn('Could not save feedback to localStorage:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <button onClick={onClose} className="modal-close" aria-label="Close feedback modal">
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
            }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              Feedback &amp; Validation Hub
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Preprod Tester Validation &bull; Level 5 &amp; Level 6
            </p>
          </div>
        </div>

        {submitted ? (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#34d399',
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Thank you! Your feedback has been recorded in the preprod tester registry.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Your Stakeholder Role
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setUserRole('depositor')}
                  className={`preset-chip ${userRole === 'depositor' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  Depositor
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('auditor')}
                  className={`preset-chip ${userRole === 'auditor' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  Auditor
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('developer')}
                  className={`preset-chip ${userRole === 'developer' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  DeFi Dev
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Rate ZK Proving Experience (1 to 5 Score)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRating(score)}
                    className={`preset-chip ${rating === score ? 'active' : ''}`}
                    style={{ flex: 1, padding: '0.4rem 0', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                  >
                    {score}/5
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Suggestions &amp; Notes
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on browser proof generation, performance, or UX improvements..."
                required
                style={{
                  width: '100%',
                  background: '#0b1120',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.85rem',
                  color: '#f8fafc',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href="https://github.com/shivam-1410/Proofolio/blob/main/docs/FEEDBACK.md"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none' }}
              >
                View docs/FEEDBACK.md &rarr;
              </a>

              <button
                type="submit"
                className="cta-button cta-button-primary"
                style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default FeedbackModal;
