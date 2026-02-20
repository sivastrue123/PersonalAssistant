import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../contexts/AuthContext';

export function usePartner() {
  const { user } = useAuth(); // Depend on user object, as profile might update frequently
  const [partner, setPartner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch initial partner state
    async function fetchPartner() {
      if (!user) return;

      // Logic: In a 2-user app, the partner is simply "the other user".
      // We query for any profile that is NOT the current user.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(1)
        .single();

      if (!error && data) {
        setPartner(data);
      }
      setLoading(false);
    }

    fetchPartner();

    // Subscribe to ALL profile changes.
    // We filter in the callback.
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        const newProfile = payload.new as Profile;
        // If the updated profile is NOT me, update partner state.
        if (newProfile && user && newProfile.id !== user.id) {
          setPartner(newProfile);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { partner, loading };
}
