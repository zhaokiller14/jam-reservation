import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import logoJam from '@/assets/logo-jam.png';
import { apiRequest } from '@/lib/api';

const StaffLogin = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await apiRequest('/api/dashboard/stats', {
        headers: { 'x-staff-password': pin },
      });

      sessionStorage.setItem('staff-auth', 'true');
      sessionStorage.setItem('staff-pin', pin);
      navigate('/staff/scanner');
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-6 bg-gradient-card border border-border rounded-2xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src={logoJam} alt="Jam Session XV" className="w-16 h-auto mx-auto" />
        <h2 className="font-display text-lg font-bold text-foreground">Staff Access</h2>

        <Input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="bg-muted border-border text-foreground text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:text-sm"
        />

        {error && (
          <p className="text-destructive text-sm">Wrong PIN</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold tracking-wide hover:opacity-90 transition-opacity"
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </motion.form>
    </div>
  );
};

export default StaffLogin;
