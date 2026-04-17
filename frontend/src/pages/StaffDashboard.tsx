import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStats, getAllReservations } from '@/lib/reservations';
import type { Reservation } from '@/lib/reservations';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, checkedIn: 0 });
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem('staff-auth') !== 'true') {
      navigate('/staff');
      return;
    }
    const update = async () => {
      try {
        const [newStats, newReservations] = await Promise.all([
          getStats(),
          getAllReservations(),
        ]);

        setStats(newStats);
        setReservations(newReservations);
      } catch {
        setStats({ total: 0, checkedIn: 0 });
        setReservations([]);
      }
    };

    void update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const pct = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Live Dashboard</h1>
          <Link to="/staff/scanner" className="text-sm text-primary underline underline-offset-4">
            Scanner
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-gradient-card border border-border rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-3xl font-display font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground mt-1">Reservations</p>
          </motion.div>
          <motion.div
            className="bg-gradient-card border border-border rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-3xl font-display font-bold text-success">{stats.checkedIn}</p>
            <p className="text-sm text-muted-foreground mt-1">Checked In</p>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">{pct}% attendance</p>

        {/* List */}
        <div className="bg-gradient-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-display text-sm font-semibold text-foreground">All Reservations</h3>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {reservations.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">No reservations yet</p>
            ) : (
              reservations.map(r => (
                <div key={r.id} className="p-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-foreground font-medium">{r.fullName}</p>
                    <p className="text-xs text-muted-foreground">{r.university}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    r.checkedIn
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {r.checkedIn ? 'Checked in' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
