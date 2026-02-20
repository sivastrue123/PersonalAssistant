import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Minus, Droplets } from 'lucide-react';
import { format } from 'date-fns';

export default function WaterTracker() {
  const { user } = useAuth();
  const [glasses, setGlasses] = useState(0);
  const [loading, setLoading] = useState(true);
  const goal = 8;
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) return;

    const fetchWater = async () => {
      const { data, error } = await supabase
        .from('water_logs')
        .select('glasses')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (!error && data) {
        setGlasses(data.glasses);
      } else if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching water log:', error);
      }
      setLoading(false);
    };

    fetchWater();
  }, [user, today]);

  const updateWater = async (newCount: number) => {
    if (!user) return;
    setGlasses(newCount); // Optimistic update

    const { error } = await supabase
      .from('water_logs')
      .upsert({
        user_id: user.id,
        date: today,
        glasses: newCount
      }, { onConflict: 'user_id, date' });

    if (error) {
      console.error('Error updating water:', error);
      // Revert if error?
    }
  };

  if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-xl"></div>;

  const progress = Math.min((glasses / goal) * 100, 100);

  return (
    <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 w-full max-w-sm mx-auto mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-semibold flex items-center gap-2">
          <Droplets className="text-blue-400" size={18} /> Hydration
        </h3>
        <span className="text-sm text-gray-500">{glasses} / {goal} glasses</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-100 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="bg-blue-400 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => updateWater(Math.max(0, glasses - 1))}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <Minus size={20} />
        </button>
        <button
          onClick={() => updateWater(glasses + 1)}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
