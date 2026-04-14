import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function FeedbackButton() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await supabase.from('feedback').insert({
      user_id: user.id,
      screen_path: location.pathname,
      feedback_text: text.trim(),
    });
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setText('');
      setSent(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating feedback button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 h-11 px-4 flex items-center gap-2 rounded-full bg-am-bg-tertiary border border-am-border-active text-am-text-secondary hover:text-am-text-primary hover:bg-am-bg-secondary transition-colors shadow-lg"
        aria-label="Send feedback"
        title="Send feedback"
      >
        <MessageSquare size={14} strokeWidth={1.75} />
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase">Feedback</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-am-bg-primary/80">
          <div className="card-surface p-6 mx-4 max-w-[400px] w-full screen-enter">
            {sent ? (
              <div className="text-center py-4">
                <p className="font-mono text-[14px] text-am-teal">Thank you for your feedback.</p>
              </div>
            ) : (
              <>
                <div className="text-label">FEEDBACK</div>
                <p className="text-small mt-2">Help us improve. Your response is anonymous.</p>
                <textarea
                  className="textarea-am mt-4"
                  style={{ minHeight: 100 }}
                  placeholder="What's on your mind?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoFocus
                  aria-label="Feedback text"
                />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => { setOpen(false); setText(''); }} className="btn-primary btn-ghost btn-40">
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || sending}
                    className="btn-primary btn-teal btn-40"
                  >
                    {sending ? 'SENDING...' : 'SUBMIT'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
