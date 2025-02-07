<template>
  <div class="calendar-page">
    <h1>Hier ist dein Kalender!</h1>

    <!-- Hilfe-Knopf -->
    <button @click="showHelp" class="help-button">Hilfe</button>
    <p v-if="showHelpText" class="help-text">
      Hier werden dir deine Fahrten angezeigt. Wenn du willst, kannst du hier mithilfe des Formulars unter dem Kalender Termine (bspw. Vorlesungen, Arbeit, etc.) hinzufügen. Wenn du auf einen Termin klickst, siehst du weitere Details und kannst ihn dort auch wieder löschen.
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
.help-button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #009260;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px /* Um etwas Platz nach unten zu haben */;
  margin-left: 10px /* Um etwas Platz nach links zu haben */
}

.help-button:hover {
  background-color: #3b7b5b;
}

.help-text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
  margin-left: 10px /* Um etwas Platz nach links zu haben */
}

.form-section {
  margin: 30px auto; /* Zentriert das Formular und gibt oben/unten Platz */
  padding: 20px; /* Innenabstand innerhalb des Formulars */
  max-width: 500px; /* Breite des Formulars begrenzen */
}
</style>