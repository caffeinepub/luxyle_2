import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAdminLogin } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { actor, isFetching: actorLoading } = useActor();
  const adminLogin = useAdminLogin();

  // Clear error when inputs change
  useEffect(() => {
    setErrorMsg('');
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      await adminLogin.mutateAsync({ username, password });
      onSuccess();
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes('Invalid credentials')) {
        setErrorMsg('Invalid username or password. Please try again.');
      } else if (msg.includes('Actor not available') || msg.includes('network')) {
        setErrorMsg('Network error. Please check your connection and try again.');
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    }
  };

  const isLoading = adminLogin.isPending;
  const isActorReady = !!actor && !actorLoading;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-luxury p-8">
          {/* Icon + Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-gold" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium text-center">
              Sign in to manage appointments and feedback
            </p>
          </div>

          {/* Actor status */}
          {!isActorReady && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting to backend…</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                disabled={isLoading || !isActorReady}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={isLoading || !isActorReady}
                  className="w-full border border-border rounded-lg px-4 py-2.5 pr-11 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !isActorReady}
              className="w-full bg-gold text-ivory font-semibold py-2.5 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
