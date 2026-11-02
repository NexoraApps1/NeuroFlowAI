import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ВСТАВЬ СВОИ ДАННЫЕ (Supabase → Settings → API Keys)
const SUPABASE_URL = 'https://ТВОЙ-ПРОЕКТ.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ТВОЙ_КЛЮЧ'; // только publishable, НЕ secret!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Возвращает { user, profile } или null, если не вошёл
export async function getSession() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single();
  if (profile?.blocked) { await supabase.auth.signOut(); return null; }
  return { user, profile };
}
