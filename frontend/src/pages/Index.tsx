import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventHeader from '@/components/EventHeader';
import poster from '@/assets/poster.jpg';

const Landing = () => (
  <div className="min-h-screen bg-gradient-hero flex flex-col">
    {/* Hero */}
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background poster overlay */}
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      <div className="absolute inset-0 bg-background/70" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <EventHeader />

        <p className="text-muted-foreground max-w-md leading-relaxed">
          An unforgettable night of live music, art, and creative energy.
          Reserve your free spot now.
        </p>

        <Link
          to="/reserve"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg tracking-wide hover:opacity-90 transition-opacity glow-rose"
        >
          Reserve Your Spot
        </Link>

        <Link
          to="/resend"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Already reserved? Resend my ticket
        </Link>
      </motion.div>
    </div>
  </div>
);

export default Landing;
