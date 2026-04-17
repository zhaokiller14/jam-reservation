import { QRCodeSVG } from 'qrcode.react';
import type { Reservation } from '@/lib/reservations';
import logoJam from '@/assets/logo-jam.png';

interface TicketCardProps {
  reservation: Reservation;
}

const TicketCard = ({ reservation }: TicketCardProps) => (
  <div className="relative w-full max-w-sm mx-auto">
    {/* Ticket shape */}
    <div className="bg-gradient-card border border-border rounded-2xl overflow-hidden glow-rose">
      {/* Top section */}
      <div className="p-6 pb-4 text-center border-b border-dashed border-border">
        <img src={logoJam} alt="Jam Session XV" className="w-20 h-auto mx-auto mb-3" />
        <h2 className="font-display text-lg font-bold text-foreground tracking-wide">
          Jam Session XV
        </h2>
        <p className="text-secondary font-accent italic text-sm">22 April — INSAT</p>
      </div>

      {/* QR section */}
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="bg-foreground p-3 rounded-xl">
          <QRCodeSVG
            value={reservation.id}
            size={180}
            bgColor="hsl(40, 30%, 90%)"
            fgColor="hsl(150, 30%, 8%)"
            level="H"
          />
        </div>
        <p className="font-mono text-sm text-muted-foreground tracking-widest">
          {reservation.id}
        </p>
      </div>

      {/* Info section */}
      <div className="px-6 pb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Name</span>
          <span className="text-foreground font-medium">{reservation.fullName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">University</span>
          <span className="text-foreground font-medium">{reservation.university}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Type</span>
          <span className="text-secondary font-accent italic">Free Entry</span>
        </div>
      </div>
    </div>
  </div>
);

export default TicketCard;
