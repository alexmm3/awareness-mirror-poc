import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError('');
    setLoading(true);

    const { error: authError } = mode === 'signup'
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    // Auth state change listener in AuthContext will handle profile fetch.
    // Navigate based on onboarding status.
    // For signup: always go to onboarding.
    // For signin: AuthContext + ProtectedRoutes will redirect appropriately.
    if (mode === 'signup') {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  return (
    <ScreenWrapper showBack backPath="/privacy" padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="font-mono-display text-[22px] text-am-text-primary">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h1>

        <div className="w-full max-w-[320px] mt-8 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="textarea-am h-10 !min-h-0 !p-3 text-[14px]"
            aria-label="Email address"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="textarea-am h-10 !min-h-0 !p-3 text-[14px]"
            aria-label="Password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          {error && (
            <div className="text-[12px] text-am-red font-mono">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary btn-teal btn-40"
            aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}
          >
            {loading ? 'LOADING...' : (mode === 'signin' ? 'SIGN IN →' : 'CREATE ACCOUNT →')}
          </button>
        </div>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError('');
          }}
          className="ghost-link mt-4"
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </ScreenWrapper>
  );
}
