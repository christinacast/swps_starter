<template>
  <div class="calendar-page">
    <h1>Hier ist dein Kalender!</h1>

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
    };
  },
  async mounted() {
    await this.fetchEvents();
  },
  methods: {
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
