<template>
  <div class="form-container">
    <h2 class="form-title">Termin erstellen</h2>
    <form @submit.prevent="addTerm">
      <div class="form-group">
        <label for="name">Terminname:</label>
        <input
          id="name"
          v-model="name"
          placeholder="Geben Sie den Namen des Termins ein"
          required
        />
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
        <input
          id="address"
          v-model="address"
          placeholder="Adresse eingeben"
          required
        />
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
import { supabase } from "@/services/supabase.js";

export default {
  data() {
    return {
      name: "",
      start: "",
      end: "",
      address: "",
      repeatPattern: "none", // Behalten der Logik für das Frontend
    };
  },
  methods: {
    async addTerm() {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        alert("Sie müssen eingeloggt sein, um Termine hinzuzufügen.");
        return;
      }

      try {
        // Berechne alle Termine basierend auf dem Wiederholungsmuster
        const dates = this.calculateDates();

        // Erstelle die Terminobjekte für die Supabase
        const events = dates.map((date) => ({
          name: this.name,
          start: date.start,
          ende: date.end,
          adresse: this.address,
          profil_id: user.id,
        }));

        // Speichere die Termine in der Supabase
        const { error } = await supabase.from("termine").insert(events);

        if (error) {
          console.error("Fehler beim Speichern der Termine:", error.message);
          alert("Fehler beim Hinzufügen der Termine: " + error.message);
        } else {
          alert("Termine erfolgreich hinzugefügt!");
          this.$emit("term-added");
          this.resetForm();
        }
      } catch (err) {
        console.error("Unerwarteter Fehler:", err);
      }
    },
    calculateDates() {
      const dates = [];
      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      // Dauer zwischen Start und Ende des Termins
      const duration = endDate - startDate;

      // Anzahl der Wiederholungen (1 bei "none", 27 bei Wiederholung)
      const iterations = this.repeatPattern === "none" ? 1 : 27;

      // Intervall in Millisekunden (je nach Wiederholungsmuster)
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

      // Berechne die Termine
      for (let i = 0; i < iterations; i++) {
        const currentStart = new Date(startDate.getTime() + i * interval);
        const currentEnd = new Date(currentStart.getTime() + duration);

        dates.push({
          start: currentStart.toISOString(),
          end: currentEnd.toISOString(),
        });
      }

      return dates;
    },
    resetForm() {
      this.name = "";
      this.start = "";
      this.end = "";
      this.address = "";
      this.repeatPattern = "none";
    },
  },
};
</script>

  
  <style scoped>
  /* Styling für das Formular */
  .form-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 100px /* Um etwas Platz nach unten zu haben */
  }
  
  .form-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8em;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #444;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: border-color 0.3s;
  }
  
  input:focus,
  select:focus {
    border-color: #007BFF;
    outline: none;
  }
  
  .submit-button {
    width: 100%;
    padding: 10px;
    font-size: 1.2em;
    background-color: #009260;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover {
    background-color: #3b7b5b;
  }
  </style>
  