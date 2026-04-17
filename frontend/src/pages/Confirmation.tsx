import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getReservationById } from '@/lib/reservations';
import type { Reservation } from '@/lib/reservations';
import TicketCard from '@/components/TicketCard';

const Confirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const loadReservation = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const found = await getReservationById(id);
      if (mounted) {
        setReservation(found);
        setLoading(false);
      }
    };

    void loadReservation();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <p className="text-muted-foreground">Loading ticket...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl text-foreground">Reservation Not Found</h1>
          <p className="text-muted-foreground">This reservation ID doesn't exist.</p>
          <Link to="/" className="text-primary underline underline-offset-4">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="space-y-8 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-2">
{/*           <motion.div
            className="text-4xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            🎸
          </motion.div> */}
          <h1 className="font-display text-2xl font-bold text-foreground">You're In!</h1>
          <p className="text-muted-foreground text-sm">
            Show this QR code at the entrance
          </p>
        </div>

        <TicketCard reservation={reservation} />

        <div className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Screenshot this ticket or check your email
          </p>
          <Link
            to="/"
            className="text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;
