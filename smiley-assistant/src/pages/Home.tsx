import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePartner } from '../hooks/usePartner';
import { Heart, Home as HomeIcon, Loader2, Moon, Sun, Bell } from 'lucide-react';
import clsx from 'clsx';
import WaterTracker from '../components/WaterTracker';
import BreathingExercise from '../components/BreathingExercise';
import ChemistryJoke from '../components/ChemistryJoke';
import { requestNotificationPermission, scheduleRecurringNotifications } from '../utils/notifications';

const MESSAGES = [
  "You’re stronger than you think",
  "PhD loading...",
  "My favorite scientist",
  "Genius chemist 🧪",
  "Keep smiling 😊",
  "Breathe in... Breathe out..."
];

export default function Home() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { partner } = usePartner();
  const [msgIndex, setMsgIndex] = useState(0);

  // Rotate messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleHomeMode = async () => {
    if (!profile) return;
    const newMode = !profile.is_home_mode;
    try {
      await updateProfile({ is_home_mode: newMode });
    } catch (err) {
      console.error("Failed to toggle home mode", err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pastel-pink" />
      </div>
    );
  }

  const isHomeMode = profile?.is_home_mode;

  return (
    <div className={clsx(
      "flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 transition-colors duration-500",
      isHomeMode ? "bg-slate-50" : "bg-transparent"
    )}>

      {/* Header / Status */}
      <div className="absolute top-4 w-full px-6 flex justify-between items-center text-sm font-medium text-gray-500">
        <div>
          {partner?.is_home_mode && (
            <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
              <HomeIcon size={12} /> Partner is Home
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isHomeMode ? <Moon size={14} /> : <Sun size={14} />}
          {isHomeMode ? "Home Mode" : "Romantic Mode"}
        </div>
      </div>

      {/* Heart Animation */}
      <div className="relative mt-12 mb-16 flex items-center justify-center w-64 h-64">
        {/* Background Circle / Glow */}
        {!isHomeMode && (
          <div className="absolute inset-0 bg-pastel-pink/30 rounded-full blur-3xl animate-pulse" />
        )}

        {/* The Heart */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 text-pastel-pink drop-shadow-xl filter"
        >
           {/* Using a large SVG Heart or Icon */}
           <Heart
             size={200}
             fill={isHomeMode ? "#cbd5e1" : "#fca5a5"}
             strokeWidth={0}
             className="transition-colors duration-500"
           />
        </motion.div>

        {/* Text inside the heart */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={clsx(
                "text-center font-bold px-8 text-shadow transition-colors duration-500",
                isHomeMode ? "text-slate-600" : "text-white"
              )}
            >
              {isHomeMode ? "Welcome Home 🏠" : MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Home Mode Toggle Button */}
      <button
        onClick={toggleHomeMode}
        className={clsx(
          "flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-all transform active:scale-95 mb-4",
          isHomeMode
            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
            : "bg-white text-pink-500 hover:bg-pink-50 ring-2 ring-pink-100"
        )}
      >
        <HomeIcon size={20} className={isHomeMode ? "fill-slate-700" : ""} />
        <span className="font-semibold">
          {isHomeMode ? "Disable Home Mode" : "I'm Home"}
        </span>
      </button>

      {/* Enable Notifications (Only visible if needed) */}
      {!isHomeMode && (
        <button
          onClick={async () => {
            const result = await requestNotificationPermission();
            if (result === 'granted' || (typeof result === 'object' && result.display === 'granted')) {
              await scheduleRecurringNotifications();
              alert("Reminders set! 💧🌿😂");
            } else {
              alert("Please enable notifications.");
            }
          }}
          className="text-xs text-pink-400 underline mb-8 hover:text-pink-600"
        >
          <Bell size={12} className="inline mr-1" />
          Enable Daily Reminders
        </button>
      )}

      {/* Wellness Section */}
      {!isHomeMode && (
        <div className="w-full max-w-sm px-4 space-y-4 pb-24">
          <WaterTracker />
          <ChemistryJoke />
        </div>
      )}

      {/* Breathing Exercise Button (Floating) */}
      {!isHomeMode && <BreathingExercise />}

      {/* Extra Info */}
      <div className="mt-8 text-center text-gray-400 text-xs px-8 pb-8">
        <p>
          {isHomeMode
            ? "Notifications are silenced. Relax and recharge."
            : "Sending you love and reminders throughout the day ❤️"}
        </p>
      </div>

    </div>
  );
}
