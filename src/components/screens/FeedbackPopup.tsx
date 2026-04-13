import { useState } from 'react';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function FeedbackPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-am-bg-primary/80">
      <div className="card-surface p-6 mx-4 max-w-[360px] screen-enter">
        <p className="text-body text-am-text-primary">
          You've been using Awareness Mirror for a week. 3 questions. 2 minutes.
        </p>
        <button className="btn-primary btn-teal mt-6" aria-label="Answer 3 questions">
          ANSWER 3 QUESTIONS →
        </button>
        <button onClick={onClose} className="ghost-link block mx-auto mt-3">
          Not now →
        </button>
      </div>
    </div>
  );
}
