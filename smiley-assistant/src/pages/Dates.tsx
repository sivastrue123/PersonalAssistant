import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Calendar as CalendarIcon, MapPin, Loader2, PartyPopper } from 'lucide-react';
import clsx from 'clsx';
import { format, isPast, isToday } from 'date-fns';

interface DateItem {
  id: string;
  user_id: string;
  title: string;
  date: string;
  type: 'exam' | 'leave' | 'travel' | 'anniversary' | 'other';
  is_shared: boolean;
  created_at: string;
}

export default function Dates() {
  const { user } = useAuth();
  const [dates, setDates] = useState<DateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<DateItem['type']>('other');

  useEffect(() => {
    if (!user) return;
    fetchDates();
  }, [user]);

  const fetchDates = async () => {
    // RLS policy: "Authenticated users can read all dates." (assuming shared calendar)
    const { data, error } = await supabase
      .from('important_dates')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) {
      setDates(data);
    }
    setLoading(false);
  };

  const handleAddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('important_dates').insert({
      user_id: user.id,
      title,
      date,
      type,
      is_shared: true // Default to shared for dates
    });

    if (!error) {
      setShowForm(false);
      setTitle('');
      setDate('');
      setType('other');
      fetchDates();
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="p-4 pb-24 min-h-screen">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10">
        <h2 className="text-2xl font-bold text-gray-800">Important Dates 📅</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-100 text-purple-600 p-2 rounded-full hover:bg-purple-200 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddDate} className="bg-white p-4 rounded-xl shadow-md mb-6 border border-purple-100 animate-in fade-in slide-in-from-top-4">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-lg font-bold mb-4 outline-none placeholder-gray-300 border-b border-gray-100 pb-2"
            required
          />

          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-200 outline-none"
              required
            />
            <select
              value={type}
              onChange={e => setType(e.target.value as DateItem['type'])}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-200 outline-none"
            >
              <option value="exam">Exam 📝</option>
              <option value="leave">Leave 🏖️</option>
              <option value="travel">Travel ✈️</option>
              <option value="anniversary">Anniversary ❤️</option>
              <option value="other">Other 📌</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-purple-600 transition-colors"
          >
            Add Date
          </button>
        </form>
      )}

      <div className="space-y-3">
        {dates.map((item) => {
          const isPastDate = isPast(new Date(item.date)) && !isToday(new Date(item.date));
          return (
            <div
              key={item.id}
              className={clsx(
                "flex items-center gap-4 p-4 rounded-xl shadow-sm border transition-all hover:scale-[1.01]",
                isPastDate ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-purple-50",
                item.type === 'exam' && !isPastDate && "border-l-4 border-l-red-400",
                item.type === 'leave' && !isPastDate && "border-l-4 border-l-green-400",
                item.type === 'travel' && !isPastDate && "border-l-4 border-l-blue-400",
                item.type === 'anniversary' && !isPastDate && "border-l-4 border-l-pink-400"
              )}
            >
              <div className={clsx(
                "flex flex-col items-center justify-center w-12 h-12 rounded-lg font-bold text-xs uppercase",
                isPastDate ? "bg-gray-200 text-gray-500" : "bg-purple-100 text-purple-600"
              )}>
                <span className="text-[10px]">{format(new Date(item.date), 'MMM')}</span>
                <span className="text-lg">{format(new Date(item.date), 'dd')}</span>
              </div>

              <div className="flex-1">
                <h3 className={clsx("font-semibold", isPastDate ? "text-gray-500 line-through" : "text-gray-800")}>
                  {item.title}
                </h3>
                <span className="text-xs text-gray-400 capitalize flex items-center gap-1">
                  {item.type === 'travel' && <MapPin size={10} />}
                  {item.type === 'anniversary' && <PartyPopper size={10} />}
                  {item.type}
                </span>
              </div>
            </div>
          );
        })}

        {dates.length === 0 && !showForm && (
          <div className="text-center text-gray-400 py-10">
            <CalendarIcon size={48} className="mx-auto mb-2 opacity-20" />
            <p>No upcoming dates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
