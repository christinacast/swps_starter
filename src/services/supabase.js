// Importiert die Funktion zum Erstellen eines Supabase-Clients
import { createClient } from '@supabase/supabase-js';

// Basis-URL des Supabase-Projekts
const supabaseUrl = 'https://qmzoqjrgyjpiqtigneeu.supabase.co';

// API-Schlüssel für den Zugriff auf die Supabase-Datenbank
// ⚠️ Wichtiger Hinweis: Dieser Schlüssel ist ein anonymer öffentlicher Schlüssel.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtem9xanJneWpwaXF0aWduZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjA2MTEsImV4cCI6MjA0NjczNjYxMX0.mXGN4aQyo7hz93ivy9JPhomXCDXC9gz7mc58AHKZmLc';

// Erstellt eine Supabase-Client-Instanz für den Datenaustausch
export const supabase = createClient(supabaseUrl, supabaseKey);

/*
Wichtige Hinweise:
1. Diese Datei stellt eine zentrale Anlaufstelle für den Austausch von Daten mit der Supabase-Datenbank dar.
3. Supabase wird in mehreren Seiten und Services genutzt, z. B. für Benutzerauthentifizierung, CRUD-Operationen und Datenabfragen.

Verwendung:
- Importiere den `supabase` Client in beliebige Module, um Datenbank-Operationen durchzuführen.
- Beispiel:
  ```javascript
  import { supabase } from '@/services/supabase';

  async function fetchData() {
    const { data, error } = await supabase
      .from('table_name')
      .select('*');
    if (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
    return data;
  }
*/
