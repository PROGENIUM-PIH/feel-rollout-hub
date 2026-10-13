import {defineConfig} from 'vite';
export default defineConfig({define:{__SUPABASE_URL__:JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL||''),__SUPABASE_ANON_KEY__:JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.SUPABASE_ANON_KEY||'')}});
