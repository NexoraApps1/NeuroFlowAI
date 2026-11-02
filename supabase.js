import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ngpgteekxgyuoajfhmcw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ayCI9IpudxfMQBGxlqem_g_ruhXxSn8'; // только publishable, НЕ secret!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Возвращает { user, profile } или null, если не вошёл / заблокирован
export async function getSession() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single();
  if (profile?.blocked) { await supabase.auth.signOut(); return null; }
  return { user, profile };
}
