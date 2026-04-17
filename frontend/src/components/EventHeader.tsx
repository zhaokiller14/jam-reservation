import logoJam from '@/assets/logo-jam.png';

const EventHeader = () => (
  <div className="flex flex-col items-center gap-4">
    <img src={logoJam} alt="Jam Session XV" className="w-32 h-auto md:w-40" />
    <div className="text-center space-y-1">
      <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-display">
        15th Edition
      </p>
      <h1 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-foreground">
        Music Festival
      </h1>
      <p className="text-secondary font-accent text-lg italic">
        22 April — INSAT
      </p>
    </div>
  </div>
);

export default EventHeader;
