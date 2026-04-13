import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';

const CONTEXT_TAGS = ['Investor Meeting', 'Team Decision', 'Client Call', 'Strategic Planning', 'Financial Decision', 'Personal', 'Other'];

export default function StateCapture() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const canSubmit = wordCount >= 10 && tags.length >= 1;

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      if (tags.length >= 2) {
        setTags([tags[1], tag]);
      } else {
        setTags([...tags, tag]);
      }
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    // Store session data in context and navigate to loading
    dispatch({
      type: 'START_SESSION',
      payload: { type: 'state_capture', rawText: text, contextTags: tags },
    });
    navigate('/classification-loading');
  };

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="text-label mt-2">STATE CAPTURE</div>
      <h1 className="font-mono-display text-[22px] text-am-text-primary mt-4 leading-tight">
        What is on your mind right now?
      </h1>

      <textarea
        className="textarea-am mt-6"
        style={{ minHeight: 160 }}
        placeholder="Write freely. Minimum 10 words."
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 1800))}
        maxLength={1800}
        aria-label="State capture input"
      />
      <div className={`text-micro text-right mt-1 ${wordCount >= 10 ? 'text-am-teal' : wordCount >= 230 ? 'text-am-red' : ''}`}>
        {wordCount} / 250
      </div>

      <div className="mt-6">
        <div className="text-label">CONTEXT</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {CONTEXT_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`chip ${tags.includes(tag) ? 'chip-selected' : ''}`}
              aria-label={`Context: ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="divider mt-6" />

      <div className="flex items-center justify-between mt-6 pb-8">
        <button onClick={() => navigate('/decision-capture')} className="ghost-link">
          I have a decision to make
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="btn-primary btn-teal mb-8"
        aria-label="Analyse"
      >
        ANALYSE →
      </button>
    </ScreenWrapper>
  );
}
