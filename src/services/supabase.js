// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmzoqjrgyjpiqtigneeu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtem9xanJneWpwaXF0aWduZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjA2MTEsImV4cCI6MjA0NjczNjYxMX0.mXGN4aQyo7hz93ivy9JPhomXCDXC9gz7mc58AHKZmLc';

export const supabase = createClient(supabaseUrl, supabaseKey);