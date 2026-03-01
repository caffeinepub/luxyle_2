import { useState } from 'react';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAdminLogin } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const adminLogin = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      await adminLogin.mutateAsync({ username: username.trim(), password });
      onSuccess();
    } catch {
      setErrorMsg('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-sm space-y-8">
        {/* Icon + Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center">
              <ShieldCheck size={32} className="text-gold" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-royal-blue">Admin Login</h2>
          <p className="font-sans-luxe text-sm text-foreground/55 font-medium">
            Enter your credentials to access the dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="admin-username" className="font-sans-luxe text-xs tracking-widest uppercase font-semibold text-foreground/70">
              Username
            </Label>
            <Input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              disabled={adminLogin.isPending}
              className="bg-cream border-gold/30 focus-visible:ring-gold/40 font-sans-luxe text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-password" className="font-sans-luxe text-xs tracking-widest uppercase font-semibold text-foreground/70">
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={adminLogin.isPending}
                className="bg-cream border-gold/30 focus-visible:ring-gold/40 font-sans-luxe text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="font-sans-luxe text-xs text-red-600 font-medium bg-red-50 border border-red-200 px-3 py-2">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            disabled={adminLogin.isPending}
            className="w-full bg-gold hover:bg-gold-dark text-foreground font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold py-5 rounded-none transition-colors disabled:opacity-60"
          >
            {adminLogin.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Verifying...
              </span>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
