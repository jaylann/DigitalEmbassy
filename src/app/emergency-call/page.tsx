// src/app/emergency-call/page.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import MobileLayout from '../../components/MobileLayout';
import { cn } from '@/lib/utils';

type CallStatus = 'idle' | 'holding' | 'dialing' | 'connected';

/**
 * A critical action page for making an emergency call, meticulously styled
 * to be a pixel-perfect match of the design target. It uses a "press and hold"
 * interaction model with a clean, circular progress indicator to ensure
 * user intent and provide clear, reassuring feedback.
 *
 * @returns {React.ReactElement} The rendered EmergencyCallPage.
 */
export default function EmergencyCallPage(): React.ReactElement {
  const [status, setStatus] = useState<CallStatus>('idle');
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 2000; // 2 seconds

  useEffect(() => {
    let dialingTimeout: NodeJS.Timeout;
    if (status === 'dialing') {
      dialingTimeout = setTimeout(() => setStatus('connected'), 3000);
    }
    return () => clearTimeout(dialingTimeout);
  }, [status]);

  const handlePressStart = () => {
    if (status !== 'idle') return;
    setStatus('holding');
    holdTimeoutRef.current = setTimeout(() => {
      setStatus('dialing');
    }, HOLD_DURATION);
  };

  const handlePressEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    if (status === 'holding') {
      setStatus('idle');
    }
  };

  const statusMap = {
    idle: { text: "Press and hold to call", color: "text-slate-400" },
    holding: { text: "Keep holding...", color: "text-red-400 animate-pulse" },
    dialing: { text: "Dialing...", color: "text-red-400" },
    connected: { text: "Connected. Stay on the line.", color: "text-green-500" },
  };

  const buttonColor = status === 'connected' ? "#22c55e" : "#ef4444"; // Hex for green-500 and red-500

  return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#111827] p-4 overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-16 text-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight text-slate-50"
            >
              Emergency Call
            </motion.h1>

            <div className="relative flex items-center justify-center w-60 h-60">
              {/* Progress Ring Track */}
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" className="stroke-[#374151]" strokeWidth="8" fill="transparent"/>
              </svg>

              {/* Red Dot / Handle */}
              <motion.div
                  className="absolute w-full h-full"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: status === 'holding' ? 270 : -90 }}
                  transition={{ duration: HOLD_DURATION / 1000, ease: 'linear' }}
              >
                <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-4 h-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                </div>
              </motion.div>

              {/* Central Button */}
              <motion.div
                  onMouseDown={handlePressStart}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  onTouchStart={handlePressStart}
                  onTouchEnd={handlePressEnd}
                  aria-label="Call emergency services"
                  className='relative z-10 flex items-center justify-center w-[184px] h-[184px] rounded-full cursor-pointer'
                  animate={{ backgroundColor: buttonColor }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Phone className="w-10 h-10 text-slate-50" />
              </motion.div>
            </div>

            <div className="h-7">
              <AnimatePresence mode="wait">
                <motion.p
                    key={status}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={cn("text-xl font-medium", statusMap[status].color)}
                >
                  {statusMap[status].text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </MobileLayout>
  );
}