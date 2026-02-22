import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!isSupabaseConfigured) {
      setMessage("Error: Supabase is not configured. Please check your .env file and restart the server.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Navigation will be handled by App.tsx observing session state
      }
    } catch (error: any) {
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Smiley's Assistant ❤️</h1>
          <p className="text-gray-600">Your personal wellness companion</p>
        </div>

        {!isSupabaseConfigured && (
           <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
             <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
             <div className="text-sm">
               <p className="font-semibold">Connection Error</p>
               <p>Supabase is not configured. Please:</p>
               <ol className="list-decimal list-inside mt-1 ml-1 space-y-1">
                 <li>Create a <code className="bg-red-100 px-1 rounded">.env</code> file in the project root.</li>
                 <li>Add <code className="bg-red-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-red-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>.</li>
                 <li><strong>Restart your development server.</strong></li>
               </ol>
             </div>
           </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              disabled={!isSupabaseConfigured}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              disabled={!isSupabaseConfigured}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('Check') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full bg-gradient-to-r from-pastel-pink to-pastel-lavender hover:from-pink-200 hover:to-purple-200 text-gray-800 font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={!isSupabaseConfigured}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
