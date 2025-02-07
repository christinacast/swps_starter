<template>
  <div class="forum-page">
    <h1>Forum</h1>
    <!-- Forum-Container: Hier werden alle Nachrichten des Forums angezeigt -->
    <div class="forum-container">
      <div v-for="message in messages" :key="message.id" class="message">
        <!-- Nachrichten anzeigen -->
        <p>{{ message.inhalt }}</p> <!-- Inhalt der Nachricht anzeigen -->
        <small class="timestamp"> <!-- Zeitstempel der Nachricht in klein anzeigen -->
          {{ formatTimestamp(message.zeitstempel) }}
        </small>

        <!-- Antworten anzeigen/verbergen mittels eines Buttons, der auch die Anzahl an Antworten auf eine Nachricht anzeigt -->
        <button @click="toggleReplies(message.id)" class="toggle-replies-button">
          {{ message.replies.length }} Antworten {{ showReplies[message.id] ? "verbergen" : "anzeigen" }}
        </button>

        <!-- Antworten nur sichtbar, wenn showReplies[messages.id] wahr ist -->
        <div v-if="showReplies[message.id]" class="replies">
          <div v-for="reply in message.replies" :key="reply.id" class="reply">
            <p>{{ reply.inhalt }}</p> <!-- Zeigt Inhalt der Antwort an -->
            <small class="timestamp">
              {{ formatTimestamp(reply.zeitstempel) }} <!-- Zeitstempel der Antwort -->
            </small>
          </div>
        </div>

        <!-- Antwort schreiben -->
        <button @click="toggleReplyForm(message.id)">
          <!-- Knopf zum Anzeigen und Verstecken (durch Abbrechen) des Antwortfeldes -->
          {{ showReplyForm[message.id] ? "Abbrechen" : "Antworten" }}
        </button>
        <div v-if="showReplyForm[message.id]" class="reply-form">
          <textarea v-model="newReplies[message.id]" placeholder="Antwort schreiben..." required></textarea>
          <button @click="submitReply(message.id)">Senden</button> <!-- Knopf zum absenden der Antwort -->
        </div>
      </div>
    </div>

    <!-- Nachricht schreiben-->
    <form @submit.prevent="submitMessage" class="new-message-form">
      <textarea v-model="newMessage" placeholder="Nachricht schreiben..." required></textarea>
      <button type="submit">Senden</button> <!-- Knopf zum Absenden der Nachricht  -->
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { supabase } from "@/services/supabase.js"; // Import der Supabase-Verbindung

export default {
  data() {
    return {
      messages: [], // Liste aller Hauptnachrichten mit zugehörigen Antworten
      newMessage: "", // Inhalt der neuen Nachricht, die der Benutzer erstellt
      newReplies: {}, // Temporäre Speicherung von Antworten für spezifische Nachrichten (Schlüssel: Nachricht-ID)
      showReplyForm: reactive({}), // Steuert die Sichtbarkeit des Antwortformulars für jede Nachricht
      showReplies: reactive({}), // Steuert die Sichtbarkeit der Antworten für jede Nachricht
      userFirstName: "", // Vorname des aktuell eingeloggten Nutzers
    };
  },
  async mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente gerendert wurde.
     * Aktionen:
     * 1. Nachrichten aus der Datenbank laden.
     * 2. Benutzernamen des eingeloggten Nutzers abrufen.
     * 3. Zum neuesten Beitrag scrollen.
     */
    await this.fetchMessages();
    await this.fetchUserFirstName();
    this.scrollToBottom();
  },
  methods: {
    /**
     * Nachrichten und Antworten aus der Supabase-Datenbank abrufen.
     * Struktur:
     * - Hauptnachrichten (ohne `antwort_auf`) werden geladen.
     * - Antworten werden den entsprechenden Hauptnachrichten zugeordnet.
     */
    async fetchMessages() {
      const { data, error } = await supabase
        .from("forum_posts") // Tabelle "forum_posts" in der Datenbank
        .select("*") // Alle Spalten abrufen
        .order("zeitstempel", { ascending: true }); // Nachrichten chronologisch sortieren

      if (error) {
        console.error("Fehler beim Laden der Nachrichten:", error.message);
        return;
      }

      // Aufteilen in Hauptnachrichten und Antworten
      const mainMessages = data.filter((msg) => !msg.antwort_auf); // Hauptnachrichten (ohne Bezug)
      const replies = data.filter((msg) => msg.antwort_auf); // Antworten (mit Bezug zu einer Hauptnachricht)

      // Antworten den jeweiligen Hauptnachrichten zuordnen
      this.messages = mainMessages.map((message) => ({
        ...message,
        replies: replies.filter((reply) => reply.antwort_auf === message.id),
      }));

      // Standardmäßig alle Antworten ausblenden
      this.messages.forEach((message) => {
        this.showReplies[message.id] = false;
      });

      // Zum neuesten Beitrag scrollen
      this.scrollToBottom();
    },

    /**
     * Vorname des aktuell eingeloggten Benutzers abrufen.
     * - Benutzer-ID wird über die Authentifizierung ermittelt.
     * - Vorname aus der Tabelle "profiles" laden.
     */
    async fetchUserFirstName() {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        console.error("Kein Benutzer eingeloggt.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles") // Tabelle "profiles" in der Datenbank
        .select("name") // Nur den Namen abrufen
        .eq("id", user.id) // Filter: Benutzer-ID
        .single(); // Genau einen Eintrag erwarten

      if (error) {
        console.error("Fehler beim Abrufen des Vornamens:", error.message);
      } else {
        this.userFirstName = data?.name || "Unbekannt"; // Fallback, falls der Name leer ist
      }
    },

    /**
     * Neue Nachricht erstellen und in der Datenbank speichern.
     * - Nachrichteninhalt wird mit dem Benutzernamen ergänzt.
     * - Datenbankeintrag erfolgt in der Tabelle "forum_posts".
     */
    async submitMessage() {
      if (!this.userFirstName) {
        alert("Fehler: Nutzername konnte nicht abgerufen werden.");
        return;
      }

      const fullMessage = `${this.userFirstName}: ${this.newMessage}`;
      const { error } = await supabase.from("forum_posts").insert([
        {
          inhalt: fullMessage,
          zeitstempel: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Fehler beim Senden der Nachricht:", error.message);
        alert("Fehler beim Senden der Nachricht.");
      } else {
        this.newMessage = ""; // Eingabefeld leeren
        await this.fetchMessages(); // Nachrichtenliste aktualisieren
      }
    },

    /**
     * Antwort auf eine Nachricht erstellen und in der Datenbank speichern.
     * - Antworten werden der zugehörigen Hauptnachricht zugeordnet.
     * - Datenbankeintrag erfolgt in der Tabelle "forum_posts".
     */
    async submitReply(messageId) {
      if (!this.userFirstName) {
        alert("Fehler: Nutzername konnte nicht abgerufen werden.");
        return;
      }

      const replyText = this.newReplies[messageId]; // Antwortinhalt für die spezifische Nachricht
      if (!replyText) return;

      const fullReply = `${this.userFirstName}: ${replyText}`;
      const { error } = await supabase.from("forum_posts").insert([
        {
          inhalt: fullReply,
          antwort_auf: messageId, // Bezug zur Hauptnachricht
          zeitstempel: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Fehler beim Senden der Antwort:", error.message);
        alert("Fehler beim Senden der Antwort.");
      } else {
        this.newReplies[messageId] = ""; // Antwort-Eingabefeld leeren
        this.showReplyForm[messageId] = false; // Antwortformular ausblenden
        await this.fetchMessages(); // Nachrichtenliste aktualisieren
      }
    },

    /**
     * Zeigt oder verbirgt das Antwortformular für eine spezifische Nachricht.
     * @param {number} messageId - ID der Nachricht
     */
    toggleReplyForm(messageId) {
      this.showReplyForm[messageId] = !this.showReplyForm[messageId];
    },

    /**
     * Zeigt oder verbirgt die Antworten einer spezifischen Nachricht.
     * @param {number} messageId - ID der Nachricht
     */
    toggleReplies(messageId) {
      this.showReplies[messageId] = !this.showReplies[messageId];
    },

    /**
     * Formatiert einen Zeitstempel in ein lesbares Datum und Uhrzeit.
     * @param {string} timestamp - Zeitstempel im ISO-Format
     * @returns {string} Formatierter Zeitstempel
     */
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    },

    /**
     * Scrollt automatisch zum neuesten Beitrag im Forum.
     * - Wird aufgerufen, nachdem Nachrichten geladen wurden.
     */
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector(".forum-container");
        if (container) {
          container.scrollTop = container.scrollHeight; // Scrollposition auf das Ende setzen
        }
      });
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';

@import '@/assets/css/pages/ForumPage.css';
</style>