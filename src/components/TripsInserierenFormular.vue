<template>
  <div class="trips-inserieren-form">
    <div class="content">

      <!-- Formular für die Eingabe einer neuen Fahrt -->
      <section class="add-ride">
        <form @submit.prevent="handleSubmit" class="form-container">
          <h1>Du suchst noch Mitfahrer für dein Fahrtziel?</h1>
          <h2>Super, inseriere hier eine Fahrt</h2>

          <!-- Startadresse -->
          <fieldset>
            <legend>Startpunkt</legend>
            <div class="form-group">
              <label for="street-start">Straße</label>
              <input type="text" id="street-start" placeholder="Beispielstraße" v-model="streetStart" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="houseNumber-start">Haus Nr.</label>
                <input type="text" id="houseNumber-start" placeholder="123" v-model="houseNumberStart" required />
              </div>
              <div class="form-group">
                <label for="postalCode-start">Postleitzahl</label>
                <input type="text" id="postalCode-start" placeholder="12345" v-model="postalCodeStart" required />
              </div>
            </div>
            <div class="form-group">
              <label for="city-start">Stadt</label>
              <input type="text" id="city-start" placeholder="Musterstadt" v-model="cityStart" required />
            </div>
          </fieldset>

          <!-- Zieladresse -->
          <fieldset>
            <legend>Ziel</legend>
            <div class="form-group">
              <label for="street-dest">Straße</label>
              <input type="text" id="street-dest" placeholder="Beispielstraße" v-model="streetDest" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="houseNumber-dest">Haus Nr.</label>
                <input type="text" id="houseNumber-dest" placeholder="123" v-model="houseNumberDest" required />
              </div>
              <div class="form-group">
                <label for="postalCode-dest">Postleitzahl</label>
                <input type="text" id="postalCode-dest" placeholder="12345" v-model="postalCodeDest" required />
              </div>
            </div>
            <div class="form-group">
              <label for="city-dest">Stadt</label>
              <input type="text" id="city-dest" placeholder="Musterstadt" v-model="cityDest" required />
            </div>
          </fieldset>

          <!-- Datum und Uhrzeit -->
          <div class="form-row">
            <div class="form-group">
              <label for="date-add">Datum</label>
              <input type="date" id="date-add" v-model="date" required />
            </div>
            <div class="form-group">
              <label for="time-add">Uhrzeit</label>
              <input type="time" id="time-add" v-model="time" required />
            </div>
          </div>

          <!-- Submit-Button -->
          <button type="submit" class="btn-submit" :disabled="isInserting">
            {{ isInserting ? "Wird inseriert..." : "Inserieren" }}
          </button>

          <!-- Erfolg- und Fehlermeldungen -->
          <p v-if="successMessage" class="status-message success">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="status-message error">
            {{ errorMessage }}
          </p>
        </form>
      </section>

      <!-- Debug-Logs für Entwicklungszwecke -->
      <!--
      <section class="debug-logs" v-if="debugMessages.length">
        <h3>Debug Logs:</h3>
        <ul>
          <li v-for="(message, index) in debugMessages" :key="index">
            {{ message }}
          </li>
        </ul>
      -->

    </div>
  </div>
</template>

<script>
/**
 * Import von Supabase für Datenbank-Interaktionen
 * und einer Hilfsfunktion für die Konvertierung von Adressen in GeoJSON.
 */
import { supabase } from "@/services/supabase.js";
import { convertToGeoJSON } from "@/services/geoUtils.js";

export default {
  name: "TripsInserierenFormular", // Name der Komponente für Debugging und Wiederverwendung

  data() {
    return {
      // Daten des eingeloggten Benutzers
      user: null,

      // Formularfelder für Start- und Zieladresse
      streetStart: "",
      houseNumberStart: "",
      postalCodeStart: "",
      cityStart: "",

      streetDest: "",
      houseNumberDest: "",
      postalCodeDest: "",
      cityDest: "",

      // Datum und Uhrzeit der Fahrt
      date: "",
      time: "",

      // Feedback und Debugging
      debugMessages: [], // Liste von Debugging-Nachrichten für die Entwicklung
      successMessage: "", // Nachricht bei erfolgreicher Fahrtinserierung
      errorMessage: "", // Fehlernachricht bei Problemen
      isInserting: false, // Zustand, ob eine Fahrt gerade inseriert wird (UI-Feedback)
    };
  },

  methods: {
    /**
     * Wird beim Klick auf den "Inserieren"-Button ausgelöst.
     * Der Ablauf umfasst:
     * 1. Authentifizierung des Benutzers prüfen.
     * 2. Adressen in GeoJSON konvertieren.
     * 3. Route zwischen Start- und Zielpunkt als GeoJSON erstellen.
     * 4. Fahrt in der Datenbank speichern.
     * 5. Erfolg oder Fehler anzeigen.
     */
    async handleSubmit() {
      this.clearFeedback(); // Alte Nachrichten löschen
      this.isInserting = true; // Ladeindikator aktivieren

      // Benutzer authentifizieren
      await this.fetchUser();

      if (!this.user) {
        this.errorMessage = "Kein Benutzer eingeloggt. Bitte loggen Sie sich ein.";
        this.debugMessages.push("Kein Benutzer gefunden. Abbruch des Prozesses.");
        this.isInserting = false;
        return;
      }

      try {
        // Adressen erstellen
        const startAddressString = `${this.streetStart} ${this.houseNumberStart}, ${this.postalCodeStart} ${this.cityStart}, Germany`;
        const destAddressString = `${this.streetDest} ${this.houseNumberDest}, ${this.postalCodeDest} ${this.cityDest}, Germany`;

        this.debugMessages.push(`Startadresse: ${startAddressString}`);
        this.debugMessages.push(`Zieladresse: ${destAddressString}`);

        // Adressen in GeoJSON umwandeln
        const startAddressGeoJSON = await this.convertAddressToGeoJSON(startAddressString);
        const destAddressGeoJSON = await this.convertAddressToGeoJSON(destAddressString);

        // Route als GeoJSON LineString erstellen
        const geoJSONRoute = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              startAddressGeoJSON.geometry.coordinates,
              destAddressGeoJSON.geometry.coordinates,
            ],
          },
          properties: {
            start: startAddressString,
            destination: destAddressString,
          },
        };

        this.debugMessages.push("Route als GeoJSON erstellt:");
        this.debugMessages.push(JSON.stringify(geoJSONRoute, null, 2));

        // Daten in der Datenbank speichern
        await this.insertToDatabase(
          startAddressGeoJSON,
          destAddressGeoJSON,
          geoJSONRoute.geometry,
          startAddressString,
          destAddressString
        );

        // Erfolgsmeldung anzeigen und Formular zurücksetzen
        this.successMessage = "Fahrt erfolgreich inseriert!";
        this.debugMessages.push("Fahrt erfolgreich gespeichert.");
        this.resetForm();
      } catch (err) {
        this.errorMessage = `Fehler beim Inserieren: ${err.message}`;
        this.debugMessages.push(`Fehler: ${err.message}`);
        console.error("Fehler beim Einfügen:", err);
      } finally {
        this.isInserting = false; // Ladeindikator deaktivieren
      }
    },

    /**
     * Konvertiert eine Adresse in ein GeoJSON-Objekt.
     * @param {String} address - Die zu konvertierende Adresse.
     * @returns {Object} GeoJSON-Daten
     */
    async convertAddressToGeoJSON(address) {
      this.debugMessages.push(`Konvertiere "${address}" in GeoJSON...`);
      const geoJSON = await convertToGeoJSON(address);

      if (!geoJSON || !geoJSON.geometry) {
        this.debugMessages.push(`Fehler bei der Konvertierung von "${address}" in GeoJSON.`);
        throw new Error("Ungültige GeoJSON-Daten erhalten");
      }

      this.debugMessages.push(`GeoJSON erfolgreich erstellt: ${JSON.stringify(geoJSON)}`);
      return geoJSON;
    },

    /**
     * Fügt die Fahrtdaten in die Datenbank ein.
     * @param {Object} startGeoJSON - GeoJSON-Daten des Startpunkts.
     * @param {Object} endGeoJSON - GeoJSON-Daten des Zielpunkts.
     * @param {Object} routeGeoJSON - GeoJSON-Objekt der Route.
     * @param {String} startString - String der Startadresse.
     * @param {String} destString - String der Zieladresse.
     */
    async insertToDatabase(startGeoJSON, endGeoJSON, routeGeoJSON, startString, destString) {
      try {
        this.debugMessages.push("Speichern der Fahrt in der Datenbank...");

        const { error } = await supabase.from("rides").insert({
          user_id: this.user.id,
          start_point: startGeoJSON.geometry,
          end_point: endGeoJSON.geometry,
          route: routeGeoJSON,
          status: "Offen für Mitfahrer",
          available_seats: 5,
          ride_date: this.date,
          ride_time: this.time,
          start_string: startString,
          end_string: destString,
          participants: [this.user.id],
        });

        if (error) {
          this.debugMessages.push(`Fehler beim Speichern: ${error.message}`);
          throw new Error(error.message);
        }

        this.debugMessages.push("Fahrt erfolgreich in der Datenbank gespeichert.");
      } catch (err) {
        console.error("Fehler beim Speichern:", err);
        throw err;
      }
    },

    /**
     * Ruft den aktuell eingeloggten Benutzer ab.
     */
    async fetchUser() {
      this.debugMessages.push("Abrufen des aktuell eingeloggten Benutzers...");

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        this.debugMessages.push(`Fehler beim Abrufen des Benutzers: ${error.message}`);
        console.error("Fehler beim Abrufen des Benutzers:", error);
        return;
      }

      if (data && data.user) {
        this.debugMessages.push(`Benutzer gefunden: ${data.user.id}`);
        this.user = data.user;
      } else {
        this.debugMessages.push("Kein Benutzer eingeloggt.");
      }
    },

    /**
     * Setzt alle Formularfelder zurück.
     */
    resetForm() {
      this.streetStart = "";
      this.houseNumberStart = "";
      this.postalCodeStart = "";
      this.cityStart = "";
      this.streetDest = "";
      this.houseNumberDest = "";
      this.postalCodeDest = "";
      this.cityDest = "";
      this.date = "";
      this.time = "";
    },

    /**
     * Löscht alle Feedback-Nachrichten.
     */
    clearFeedback() {
      this.debugMessages = [];
      this.successMessage = "";
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/components/TripsInserierenFormular.css';
</style>