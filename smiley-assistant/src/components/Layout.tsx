import { NavLink, Outlet } from 'react-router-dom';
import { Home, MessageCircleHeart, StickyNote, CalendarHeart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

export default function Layout() {
  const { profile } = useAuth();
  const isHomeMode = profile?.is_home_mode;

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircleHeart, label: 'Chat', path: '/chat' },
    { icon: StickyNote, label: 'Notes', path: '/notes' },
    { icon: CalendarHeart, label: 'Dates', path: '/dates' },
    // { icon: User, label: 'Profile', path: '/profile' } // Optional
  ];

  return (
    <div className={clsx(
      "min-h-screen flex flex-col transition-colors duration-500",
      isHomeMode
        ? "bg-slate-50" // Neutral background for Home Mode
        : "bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue" // Romantic gradient
    )}>
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-lg pb-safe">
        <div className="flex justify-around items-center p-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => clsx(
                "flex flex-col items-center p-2 rounded-xl transition-all",
                isActive
                  ? (isHomeMode ? "text-slate-600 bg-slate-100" : "text-pink-500 bg-pink-50")
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <tab.icon size={24} strokeWidth={isHomeMode ? 1.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
