import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('Using', { url: !!url, key: !!key });

const supabase = createClient(url, key, { global: { fetch } });

(async () => {
  try {
    const { data, error } = await supabase.from('subjects').select('*').limit(1);
    console.log('result:', { data, error });
  } catch (err) {
    console.error('exception', err);
  }
})();
