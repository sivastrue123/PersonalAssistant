import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, StickyNote, Share2, Lock, Trash2, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_shared: boolean;
  created_at: string;
}

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    // RLS policy: "Users can read own or shared notes."
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('notes').insert({
      user_id: user.id,
      title,
      content,
      is_shared: isShared
    });

    if (!error) {
      setShowForm(false);
      setTitle('');
      setContent('');
      setIsShared(false);
      fetchNotes();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="p-4 pb-24 min-h-screen">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10">
        <h2 className="text-2xl font-bold text-gray-800">Notes 📒</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-100 text-yellow-600 p-2 rounded-full hover:bg-yellow-200 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddNote} className="bg-white p-4 rounded-xl shadow-md mb-6 border border-yellow-100 animate-in fade-in slide-in-from-top-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-lg font-bold mb-2 outline-none placeholder-gray-300"
            required
          />
          <textarea
            placeholder="Write something..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full min-h-[100px] mb-4 outline-none resize-none placeholder-gray-300 text-gray-600"
            required
          />
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsShared(!isShared)}
              className={clsx(
                "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                isShared ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              )}
            >
              {isShared ? <Share2 size={12} /> : <Lock size={12} />}
              {isShared ? "Shared with Partner" : "Private"}
            </button>
            <button
              type="submit"
              className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-yellow-500"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {notes.map(note => (
          <div key={note.id} className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100 relative group">
            <h3 className="font-bold text-gray-800 mb-1 pr-6">{note.title}</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>

            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
              <span>{format(new Date(note.created_at), 'MMM d, yyyy')}</span>
              {note.is_shared && <Share2 size={12} className="text-green-400" />}
            </div>

            {note.user_id === user?.id && (
              <button
                onClick={() => handleDelete(note.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        {notes.length === 0 && !showForm && (
          <div className="text-center text-gray-400 py-10 col-span-full">
            <StickyNote size={48} className="mx-auto mb-2 opacity-20" />
            <p>No notes yet. Start writing!</p>
          </div>
        )}
      </div>
    </div>
  );
}
