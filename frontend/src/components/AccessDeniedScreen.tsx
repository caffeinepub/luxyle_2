import { useNavigate } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <ShieldX size={48} className="text-gold mx-auto mb-6" />
        <h2 className="font-heading text-4xl text-royal-blue font-light mb-4">Access Denied</h2>
        <div className="gold-divider mb-6" />
        <p className="font-body text-charcoal/70 mb-8">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="font-body text-sm tracking-widest uppercase text-royal-blue border-b border-gold pb-1 hover:text-gold transition-colors font-semibold"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
