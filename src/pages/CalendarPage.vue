<template>
  <div class="calendar-page">
    <h1>Hier ist dein Kalender!</h1>

    <!-- Hilfe-Knopf -->
    <button @click="showHelp" class="help-button">Hilfe</button>
    <p v-if="showHelpText" class="help-text">
      Hier werden dir deine Fahrten angezeigt. Wenn du willst, kannst du hier mithilfe des Formulars unter dem Kalender
      Termine (bspw. Vorlesungen, Arbeit, etc.) hinzufügen. Wenn du auf einen Termin klickst, siehst du weitere Details
      und kannst ihn dort auch wieder löschen.
    </p>

    <!-- FullCalendar-Komponente -->
    <div class="calendar-container">
      <CalendarComponent :events="events" :onDelete="fetchEvents" />
    </div>

    <!-- Formular zur Erstellung von Terminen -->
    <div class="form-section">
      <ErstelleTermin @term-added="fetchEvents" />
    </div>
  </div>
</template>

<script>
import CalendarComponent from "@/components/CalendarComponent.vue"; // Kalender-Komponente für die Anzeige der Events
import ErstelleTermin from "@/components/ErstelleTermin.vue"; // Formular-Komponente zur Erstellung neuer Termine
import { supabase } from "@/services/supabase.js"; // Verbindung zur Supabase-Datenbank

export default {
  components: {
    CalendarComponent,
    ErstelleTermin,
  },
  data() {
    return {
      events: [], // Liste der Termine, die im Kalender angezeigt werden
      showHelpText: false, // Kontrolliert, ob der Hilfetext angezeigt wird
    };
  },
  async mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente in den DOM eingefügt wurde.
     * Hier werden die Events aus der Datenbank geladen, damit sie direkt im Kalender angezeigt werden.
     */
    await this.fetchEvents();
  },
  methods: {
    /**
     * Wechselt den Zustand der Anzeige des Hilfetexts.
     * Wenn der Benutzer auf den Hilfe-Button klickt, wird der Text ein- oder ausgeblendet.
     */
    showHelp() {
      this.showHelpText = !this.showHelpText; // Invertiert den aktuellen Zustand
    },

    /**
     * Lädt alle Termine aus der Supabase-Datenbank, die dem aktuellen Benutzer zugeordnet sind.
     * - Prüft zuerst, ob der Benutzer eingeloggt ist.
     * - Ruft die Daten aus der Tabelle "termine" ab, die zur Benutzer-ID passen.
     * - Transformiert die geladenen Daten in das richtige Format für die Anzeige im Kalender.
     */
    async fetchEvents() {
      // Abrufen der Benutzerinformationen (über die Authentifizierung)
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        // Fehlerbehandlung, wenn kein Benutzer eingeloggt ist
        console.error("Kein Benutzer eingeloggt.");
        return;
      }

      try {
        // Abfrage der Termine aus der Tabelle "termine" basierend auf der Benutzer-ID
        const { data, error } = await supabase
          .from("termine") // Tabelle in der Datenbank
          .select("*") // Alle Spalten abrufen
          .eq("profil_id", user.id); // Filter: Nur Termine des aktuellen Benutzers

        if (error) {
          // Fehlerbehandlung, wenn die Abfrage fehlschlägt
          console.error("Fehler beim Laden der Termine:", error.message);
          return;
        }

        // Transformieren der Daten in ein Format, das der Kalender versteht
        // Erwartetes Format: [{ id, title, start, end, ... }]
        this.events = data.map((event) => ({
          id: event.id, // Eindeutige ID des Events
          title: event.name, // Titel oder Name des Termins
          start: event.start, // Startdatum und -uhrzeit
          end: event.ende, // Enddatum und -uhrzeit
          adresse: event.adresse, // (Optional) Adresse oder Ort des Termins
        }));
      } catch (err) {
        // Allgemeine Fehlerbehandlung für unerwartete Fehler
        console.error("Fehler beim Laden der Events:", err.message);
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';

@import '@/assets/css/pages/CalendarPage.css';
</style>