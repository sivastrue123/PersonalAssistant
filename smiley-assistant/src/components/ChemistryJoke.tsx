import { useState, useEffect } from 'react';
import { FlaskConical, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JOKES = [
  "Why did the chemist break up? Because there was no reaction... but too many attractions!",
  "I think I lost an electron. Are you positive?",
  "What do you do with a sick chemist? If you can't helium, and you can't curium, you might as well barium.",
  "Silver walks up to Gold in a bar and says, 'AU, get out of here!'",
  "I heard that Oxygen and Magnesium were going out and I was like OMg!",
  "Anyone know any jokes about sodium? Na",
  "The optimist sees the glass half full. The pessimist sees the glass half empty. The chemist sees the glass completely full, half in the liquid state and half in the vapor state.",
  "H2O is water and H2O2 is hydrogen peroxide. What is H2O4? Drinking, bathing, and mixing with scotch.",
  "Why are chemists great for solving problems? They have all the solutions."
];

export default function ChemistryJoke() {
  const [index, setIndex] = useState(0);

  const nextJoke = () => {
    setIndex((prev) => (prev + 1) % JOKES.length);
  };

  useEffect(() => {
    // Rotate every 45 mins? For demo, maybe every 30 seconds
    const interval = setInterval(nextJoke, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto mt-6 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl shadow-sm border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <FlaskConical size={64} />
      </div>

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-purple-800 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <FlaskConical size={16} /> Chemistry Joke
        </h3>
        <button onClick={nextJoke} className="text-purple-400 hover:text-purple-600 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-gray-700 font-medium italic text-sm leading-relaxed relative z-10"
        >
          "{JOKES[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
