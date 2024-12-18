<template>
    <div class="form-container">
      <h2 class="form-title">Termin erstellen</h2>
      <form @submit.prevent="addTerm">
        <!-- Name -->
        <div class="form-group">
          <label for="name">Terminname:</label>
          <input
            id="name"
            v-model="name"
            placeholder="Geben Sie den Namen des Termins ein"
            required
          />
        </div>
  
        <!-- Startzeit -->
        <div class="form-group">
          <label for="start">Startzeit:</label>
          <input type="datetime-local" id="start" v-model="start" required />
        </div>
  
        <!-- Endzeit -->
        <div class="form-group">
          <label for="end">Endzeit:</label>
          <input type="datetime-local" id="end" v-model="end" required />
        </div>
  
        <!-- Adresse -->
        <div class="form-group">
          <label for="address">Adresse:</label>
          <input
            id="address"
            v-model="address"
            placeholder="Adresse eingeben"
            required
          />
        </div>
  
        <!-- Wiederholungsmuster -->
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
  
        <!-- Submit -->
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
        repeatPattern: "none",
      };
    },
    methods: {
      async addTerm() {
        // Benutzerinformationen abrufen
        const user = (await supabase.auth.getUser()).data.user;
  
        if (!user) {
          alert("Sie müssen eingeloggt sein, um Termine hinzuzufügen.");
          return;
        }
  
        try {
          // Neuen Termin in Supabase speichern
          const { error } = await supabase.from("termine").insert([
            {
              name: this.name,
              start: this.start,
              ende: this.end,
              adresse: this.address,
              wiederholungsmuster: this.repeatPattern,
              profil_id: user.id, // Verknüpfung mit eingeloggtem Benutzer
            },
          ]);
  
          if (error) {
            console.error("Fehler beim Speichern des Termins:", error.message);
            alert("Fehler beim Hinzufügen des Termins: " + error.message);
          } else {
            alert("Termin erfolgreich hinzugefügt!");
            this.$emit("term-added"); // Kalender aktualisieren
            this.resetForm();
          }
        } catch (err) {
          console.error("Unerwarteter Fehler:", err);
        }
      },
      resetForm() {
        // Formularfelder zurücksetzen
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
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-bottom: 30px /* Um etwas Platz nach unten zu haben */
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  </style>
  