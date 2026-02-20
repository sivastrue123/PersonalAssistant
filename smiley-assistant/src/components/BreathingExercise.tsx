import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BREATH_PHASES = [
  { text: "Breathe In 🌿", duration: 4, scale: 1.5 },
  { text: "Hold 🌸", duration: 4, scale: 1.5 },
  { text: "Breathe Out 💨", duration: 4, scale: 1 }
];

export default function BreathingExercise() {
  const [isOpen, setIsOpen] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (isActive) {
      const currentPhase = BREATH_PHASES[phaseIndex];
      interval = setTimeout(() => {
        setPhaseIndex((prev) => (prev + 1) % BREATH_PHASES.length);
      }, currentPhase.duration * 1000);
    }
    return () => clearTimeout(interval);
  }, [isActive, phaseIndex]);

  const currentPhase = BREATH_PHASES[phaseIndex];

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setIsActive(true); }}
        className="fixed bottom-24 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-pink-100 text-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-all z-20"
      >
        <span className="text-xs font-semibold mr-1">Breathe</span> 🌿
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="relative flex flex-col items-center">
              <button
                onClick={() => { setIsOpen(false); setIsActive(false); setPhaseIndex(0); }}
                className="absolute -top-16 right-0 text-white hover:text-gray-200"
              >
                <X size={32} />
              </button>

              <motion.div
                animate={{ scale: currentPhase.scale }}
                transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-pastel-green to-teal-200 shadow-[0_0_60px_rgba(167,243,208,0.6)] flex items-center justify-center mb-8"
              >
                <span className="text-2xl font-bold text-teal-800 drop-shadow-sm">
                  {currentPhase.text}
                </span>
              </motion.div>

              <p className="text-white text-lg font-medium text-center max-w-xs mt-4">
                Relax your mind... Focus on your breath...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
