import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { checkIn } from '@/lib/reservations';

type ScanResult = {
  type: 'success' | 'already' | 'invalid';
  attendee?: {
    fullName: string;
    university: string;
    reservationId: string;
  };
  message: string;
};

const StaffScanner = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stoppingRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('staff-auth') !== 'true') {
      navigate('/staff');
    }
  }, [navigate]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    if (!scanner || stoppingRef.current) {
      return;
    }

    stoppingRef.current = true;

    // html5-qrcode can throw both sync and async errors when stop is called twice.
    try {
      await scanner.stop();
    } catch {
      // Ignore stop errors when the scanner is already stopped.
    }

    try {
      await scanner.clear();
    } catch {
      // Ignore clear errors during teardown.
    }

    scannerRef.current = null;
    stoppingRef.current = false;
  }, []);

  const startScanner = useCallback(() => {
    if (!containerRef.current || scannerRef.current || stoppingRef.current) {
      return false;
    }

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (text) => {
        await stopScanner();
        setScanning(false);

        const result = await checkIn(text);

        if ('attendee' in result) {
          setScanResult({ type: 'success', attendee: result.attendee, message: 'Welcome!' });
          return;
        }

        if (result.error === 'already') {
          setScanResult({ type: 'already', message: 'Already checked in' });
        } else {
          setScanResult({ type: 'invalid', message: 'Invalid QR code' });
        }
      },
      () => {}
    ).catch(() => {
      scannerRef.current = null;
    });

    return true;
  }, [stopScanner]);

  useEffect(() => {
    if (!scanning) {
      return;
    }

    if (startScanner()) {
      return;
    }

    const retryId = window.setInterval(() => {
      if (startScanner()) {
        window.clearInterval(retryId);
      }
    }, 150);

    return () => {
      window.clearInterval(retryId);
    };
  }, [scanning, startScanner]);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  const resetScan = () => {
    setScanResult(null);
    setScanning(true);
  };

  const resultColors = {
    success: 'border-success bg-success/10',
    already: 'border-secondary bg-secondary/10',
    invalid: 'border-destructive bg-destructive/10',
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">QR Scanner</h1>
          <Link to="/staff/dashboard" className="text-sm text-primary underline underline-offset-4">
            Dashboard
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl overflow-hidden border border-border"
            >
              <div id="qr-reader" ref={containerRef} className="w-full" />
            </motion.div>
          ) : scanResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`rounded-2xl border-2 p-8 text-center space-y-4 ${resultColors[scanResult.type]}`}
            >
              <div className="text-6xl">
                {scanResult.type === 'success' ? '✅' : scanResult.type === 'already' ? '⚠️' : '❌'}
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {scanResult.message}
              </h2>
              {scanResult.attendee && (
                <div className="space-y-1">
                  <p className="text-lg text-foreground font-medium">{scanResult.attendee.fullName}</p>
                  <p className="text-sm text-muted-foreground">{scanResult.attendee.university}</p>
                  <p className="text-xs text-muted-foreground font-mono">{scanResult.attendee.reservationId}</p>
                </div>
              )}
              <button
                onClick={resetScan}
                className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold tracking-wide hover:opacity-90 transition-opacity"
              >
                Scan Next
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StaffScanner;
