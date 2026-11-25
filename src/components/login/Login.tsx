import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

export function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim().includes('@')) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (isRegister && username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isRegister) {
        await register({
          username: username.trim(),
          email: email.trim(),
          password,
        });
      } else {
        await login({
          email: email.trim(),
          password,
        });
      }
      navigate('/');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#181818] border border-zinc-800 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-md bg-red-600 text-white font-bold text-sm tracking-wide mb-3">
            YouNoob
          </span>
          <h1 className="text-2xl font-semibold">
            {isRegister ? 'Create your account' : 'Sign in'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isRegister
              ? 'Save playlists, subscribe to channels, and comment'
              : 'Continue to YouNoob'}
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3.5 py-2.5 text-sm text-red-400"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isRegister && (
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ngquang7"
                className="w-full rounded-lg bg-[#0f0f0f] border border-zinc-700 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg bg-[#0f0f0f] border border-zinc-700 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-[#0f0f0f] border border-zinc-700 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-2.5 text-sm font-medium text-white transition cursor-pointer"
          >
            {isSubmitting
              ? 'Loading...'
              : isRegister
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          {isRegister ? 'Already have an account?' : 'New to YouNoob?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-400 hover:underline font-medium cursor-pointer"
          >
            {isRegister ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;