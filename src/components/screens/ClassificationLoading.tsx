import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function ClassificationLoading() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const session = state.activeSession;
    if (!session) {
      navigate('/', { replace: true });
      return;
    }

    const startTime = Date.now();

    const classify = async () => {
      try {
        const { data: { session: authSession } } = await supabase.auth.getSession();
        if (!authSession) {
          navigate('/auth', { replace: true });
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-state`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authSession.access_token}`,
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              text: session.rawText,
              context_tags: session.contextTags,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`Classification failed: ${res.status}`);
        }

        const result = await res.json();

        // Enforce minimum 1500ms display time per spec
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1500 - elapsed);

        setTimeout(() => {
          dispatch({ type: 'SET_CLASSIFICATION', payload: result });
          navigate('/state-display', { replace: true });
        }, remaining);
      } catch (err) {
        console.error('Classification error:', err);
        // On error, still navigate but without classification
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1500 - elapsed);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, remaining);
      }
    };

    classify();
  }, []);

  return (
    <ScreenWrapper padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="font-mono font-medium text-[12px] tracking-[0.08em] uppercase text-am-text-secondary loading-dots">
          READING YOUR SYSTEM
        </div>
      </div>
    </ScreenWrapper>
  );
}
