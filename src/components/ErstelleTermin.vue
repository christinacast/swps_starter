<template>
  <div class="form-container">
    <h2 class="form-title">Termin erstellen</h2>
    <form @submit.prevent="addTerm">
      <div class="form-group">
        <label for="name">Terminname:</label>
        <input id="name" v-model="name" placeholder="Geben Sie den Namen des Termins ein" required />
      </div>

      <div class="form-group">
        <label for="start">Startzeit:</label>
        <input type="datetime-local" id="start" v-model="start" required />
      </div>

      <div class="form-group">
        <label for="end">Endzeit:</label>
        <input type="datetime-local" id="end" v-model="end" required />
      </div>

      <div class="form-group">
        <label for="address">Adresse:</label>
        <input id="address" v-model="address" placeholder="Adresse eingeben" required />
      </div>

      <div class="form-group">
        <label for="repeat">Wiederholungsmuster:</label>
        <select id="repeat" v-model="repeatPattern">
          <option value="none">Keine Wiederholung</option>
          <option value="weekly">Wöchentlich</option>
          <option value="biweekly">2-Wochenrhythmus</option>
          <option value="monthly">Monatlich</option>
          <option value="yearly">Jährlich</option>
        </select>
      </div>

      <div class="form-group">
        <button type="submit" class="submit-button">Termin hinzufügen</button>
      </div>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase.js"; // Verbindung zur Supabase-Datenbank

export default {
  name: "ErstelleTermin", // Name der Komponente, wichtig für Debugging und Wiederverwendbarkeit

  data() {
    return {
      name: "", // Name des Termins
      start: "", // Startdatum und -uhrzeit des Termins
      end: "", // Enddatum und -uhrzeit des Termins
      address: "", // Adresse des Termins
      repeatPattern: "none", // Wiederholungsmuster (Standard: keine Wiederholung)
    };
  },

  methods: {
    /**
     * Fügt einen neuen Termin hinzu, basierend auf den eingegebenen Daten und dem Wiederholungsmuster.
     * - Berechnet Wiederholungen (falls erforderlich).
     * - Speichert die Termine in der Supabase-Datenbank.
     */
    async addTerm() {
      // Überprüft, ob der Benutzer eingeloggt ist
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        alert("Sie müssen eingeloggt sein, um Termine hinzuzufügen."); // Benutzerwarnung
        return;
      }

      try {
        // Berechnet die zu speichernden Termine basierend auf dem Wiederholungsmuster
        const dates = this.calculateDates();

        // Erstellt Terminobjekte für die Datenbank
        const events = dates.map((date) => ({
          name: this.name, // Name des Termins
          start: date.start, // Startzeitpunkt
          ende: date.end, // Endzeitpunkt
          adresse: this.address, // Adresse
          profil_id: user.id, // ID des aktuellen Benutzers
        }));

        // Speichert die Termine in der Tabelle "termine" in der Supabase
        const { error } = await supabase.from("termine").insert(events);

        if (error) {
          console.error("Fehler beim Speichern der Termine:", error.message); // Fehler in der Konsole
          alert("Fehler beim Hinzufügen der Termine: " + error.message); // Benutzerwarnung
        } else {
          alert("Termine erfolgreich hinzugefügt!"); // Erfolgsbenachrichtigung
          this.$emit("term-added"); // Benachrichtigt die übergeordnete Komponente
          this.resetForm(); // Zurücksetzen des Formulars
        }
      } catch (err) {
        console.error("Unerwarteter Fehler:", err.message); // Unerwartete Fehler behandeln
      }
    },

    /**
     * Berechnet alle Termine basierend auf dem ausgewählten Wiederholungsmuster.
     * @returns {Array} Array von Objekten mit Start- und Endzeitpunkten.
     */
    calculateDates() {
      const dates = [];
      const startDate = new Date(this.start); // Konvertierung des Startzeitpunkts in ein Date-Objekt
      const endDate = new Date(this.end); // Konvertierung des Endzeitpunkts in ein Date-Objekt

      const duration = endDate - startDate; // Dauer des Termins in Millisekunden

      // Anzahl der Wiederholungen (1 bei "none", 27 bei wiederkehrenden Terminen)
      const iterations = this.repeatPattern === "none" ? 1 : 27;

      // Zeitintervall für Wiederholungen in Millisekunden
      let interval = 0;
      if (this.repeatPattern === "weekly") {
        interval = 7 * 24 * 60 * 60 * 1000; // Eine Woche
      } else if (this.repeatPattern === "biweekly") {
        interval = 14 * 24 * 60 * 60 * 1000; // Zwei Wochen
      } else if (this.repeatPattern === "monthly") {
        interval = 30 * 24 * 60 * 60 * 1000; // Ein Monat (ca.)
      } else if (this.repeatPattern === "yearly") {
        interval = 365 * 24 * 60 * 60 * 1000; // Ein Jahr
      }

      // Berechnet Termine basierend auf dem Intervall
      for (let i = 0; i < iterations; i++) {
        const currentStart = new Date(startDate.getTime() + i * interval); // Startzeitpunkt der Wiederholung
        const currentEnd = new Date(currentStart.getTime() + duration); // Endzeitpunkt der Wiederholung

        dates.push({
          start: currentStart.toISOString(), // ISO-Format für die Datenbank
          end: currentEnd.toISOString(),
        });
      }

      return dates; // Rückgabe der berechneten Termine
    },

    /**
     * Setzt das Formular zurück, um alle Eingabefelder zu leeren.
     */
    resetForm() {
      this.name = ""; // Zurücksetzen des Namens
      this.start = ""; // Zurücksetzen der Startzeit
      this.end = ""; // Zurücksetzen der Endzeit
      this.address = ""; // Zurücksetzen der Adresse
      this.repeatPattern = "none"; // Zurücksetzen des Wiederholungsmusters
    },
  },
};
</script>


<style scoped>
@import "@/assets/css/components/ErstelleTermine.css";
</style>