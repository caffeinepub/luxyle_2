import { useState, FormEvent } from 'react';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess: (username: string) => void;
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setIsLoading(true);

    // Brief loading state for UX, then grant access to any non-empty credentials
    setTimeout(() => {
      onSuccess(username.trim());
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6 pt-20 pb-16">
      <div className="max-w-md w-full bg-ivory p-10 shadow-luxury-lg border-t-4 border-gold">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-royal-blue/10 rounded-full mb-4">
            <Lock size={24} className="text-royal-blue" />
          </div>
          <h1 className="font-heading text-4xl text-royal-blue font-light tracking-wide">Dashboard Portal</h1>
          <div className="gold-divider mt-3 mb-4" />
          <p className="font-body text-sm text-charcoal/50 tracking-wide">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="font-body text-xs tracking-widest uppercase text-charcoal/60">
              Username
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 border-b-2 border-beige-dark bg-transparent font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="font-body text-xs tracking-widest uppercase text-charcoal/60">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-3 border-b-2 border-beige-dark bg-transparent font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/70 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-royal-blue text-ivory font-body text-sm tracking-widest uppercase hover:bg-royal-blue-light transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
