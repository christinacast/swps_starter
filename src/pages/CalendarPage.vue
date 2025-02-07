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
import CalendarComponent from "@/components/CalendarComponent.vue";
import ErstelleTermin from "@/components/ErstelleTermin.vue";
import { supabase } from "@/services/supabase.js";

export default {
  components: {
    CalendarComponent,
    ErstelleTermin,
  },
  data() {
    return {
      events: [],
      showHelpText: false, // Zustand für die Anzeige des Hilfetexts
    };
  },
  async mounted() {
    await this.fetchEvents();
  },
  methods: {
    // Anzeigen oder Nicht-Anzeigen des Hilfetextes
    showHelp() {
      this.showHelpText = !this.showHelpText;
    },

    // Events aus Supabase laden
    async fetchEvents() {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        console.error("Kein Benutzer eingeloggt.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("termine")
          .select("*")
          .eq("profil_id", user.id);

        if (error) {
          console.error("Fehler beim Laden der Termine:", error.message);
          return;
        }

        this.events = data.map((event) => ({
          id: event.id,
          title: event.name,
          start: event.start,
          end: event.ende,
          adresse: event.adresse,
        }));
      } catch (err) {
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