import { ShieldX } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <ShieldX size={56} className="text-gold/60" />
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-semibold text-royal-blue">Access Restricted</h2>
        <p className="font-sans-luxe text-sm text-foreground/60 font-medium max-w-sm">
          You do not have permission to view this page. Please log in with an admin account.
        </p>
      </div>
      <Link
        to="/"
        className="font-sans-luxe text-xs tracking-widest uppercase font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/40 hover:border-gold-dark pb-0.5"
      >
        Return Home
      </Link>
    </div>
  );
}
