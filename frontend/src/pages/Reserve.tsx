import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createReservation } from '@/lib/reservations';
import EventHeader from '@/components/EventHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Reserve = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', university: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reservation = await createReservation(form);
      navigate(`/confirmation/${reservation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation.');
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

        <form onSubmit={handleSubmit} className="space-y-5 bg-gradient-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold text-center text-foreground">
            Reserve Your Spot
          </h2>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-muted-foreground text-sm">Full Name</Label>
            <Input
              id="fullName"
              required
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Your full name"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="university" className="text-muted-foreground text-sm">University</Label>
            <Input
              id="university"
              required
              value={form.university}
              onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
              placeholder="e.g. INSAT"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 glow-rose"
          >
            {loading ? 'Reserving...' : 'Confirm Reservation'}
          </button>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Reserve;
