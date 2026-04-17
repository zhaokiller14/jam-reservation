import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resendTicket } from '@/lib/reservations';
import EventHeader from '@/components/EventHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Resend = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await resendTicket(email);
      setMessage('If this email is registered, a ticket has been sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend ticket right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <EventHeader />

        <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold text-center text-foreground">
            Find My Ticket
          </h2>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm">Email used for reservation</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold tracking-wide hover:opacity-90 transition-opacity glow-rose"
          >
            {loading ? 'Sending...' : 'Resend Ticket'}
          </button>
        </form>

        {message && (
          <p className="text-center text-muted-foreground text-sm">{message}</p>
        )}

        {error && (
          <p className="text-center text-destructive text-sm">{error}</p>
        )}

        <div className="text-center">
          <Link to="/" className="text-sm text-primary underline underline-offset-4">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Resend;
