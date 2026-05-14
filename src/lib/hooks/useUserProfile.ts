'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserProfileContact {
  displayName: string;
  phone: string;
  email: string;
  loading: boolean;
}

/**
 * Hook to fetch the authenticated user's profile contact data
 * (display_name, phone from profiles table; email from auth user).
 * Used to pre-populate and lock contact fields in the listing wizard.
 */
export function useUserProfile(user: User | null): UserProfileContact {
  const [profile, setProfile] = useState<UserProfileContact>({
    displayName: '',
    phone: '',
    email: '',
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setProfile({ displayName: '', phone: '', email: '', loading: false });
      return;
    }

    const loadProfile = async () => {
      const supabase = createClient();
      const { data, error: _error } = await supabase
        .from('profiles')
        .select('display_name, phone')
        .eq('id', user.id)
        .single();

      // Fall back to user_metadata if profile row is missing or fields are null
      const displayName = data?.display_name || user.user_metadata?.display_name || '';
      const phone = data?.phone || user.user_metadata?.phone || '';
      const email = user.email || '';

      setProfile({ displayName, phone, email, loading: false });
    };

    loadProfile();
  }, [user?.id, user?.email]);

  return profile;
}