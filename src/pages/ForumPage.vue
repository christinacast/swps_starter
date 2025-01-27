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
        <button @click="toggleReplyForm(message.id)"> <!-- Knopf zum Anzeigen und Verstecken (durch Abbrechen) des Antwortfeldes -->
          {{ showReplyForm[message.id] ? "Abbrechen" : "Antworten" }}
        </button>
        <div v-if="showReplyForm[message.id]" class="reply-form">
          <textarea
            v-model="newReplies[message.id]"
            placeholder="Antwort schreiben..."
            required
          ></textarea>
          <button @click="submitReply(message.id)">Senden</button> <!-- Knopf zum absenden der Antwort -->
        </div>
      </div>
    </div>

    <!-- Nachricht schreiben-->
    <form @submit.prevent="submitMessage" class="new-message-form">
      <textarea
        v-model="newMessage"
        placeholder="Nachricht schreiben..."
        required
      ></textarea>
      <button type="submit">Senden</button> <!-- Knopf zum Absenden der Nachricht  -->
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { supabase } from "@/services/supabase.js";

export default {
  data() {
    return {
      messages: [], // Nachrichtenliste mit Antworten
      newMessage: "", // Text der Nachricht
      newReplies: {}, // Antworten pro Nachricht (Schlüssel: Nachricht-ID)
      showReplyForm: reactive({}), // Kontrolliert, ob das Antwortformular angezeigt wird
      showReplies: reactive({}), // Kontrolliert, ob Antworten angezeigt werden
      userFirstName: "", // Vorname des eingeloggten Nutzers
    };
  },
  async mounted() {
    await this.fetchMessages();
    await this.fetchUserFirstName();
    this.scrollToBottom(); // Automatisch nach unten scrollen, damit man beim öffnen des Forums bei den neusten Nachrichten ist
  },
  methods: {
    // Nachrichten und Antworten aus der Datenbank abrufen und zeitlich sortieren
    async fetchMessages() {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .order("zeitstempel", { ascending: true }); // Älteste Nachrichten zuerst

      if (error) {
        console.error("Fehler beim Laden der Nachrichten:", error.message);
        return;
      }

      // Nachrichten mit Antworten strukturieren
      const mainMessages = data.filter((msg) => !msg.antwort_auf); // Hauptnachrichten
      const replies = data.filter((msg) => msg.antwort_auf); // Antworten

      // Antworten den Hauptnachrichten zuordnen
      this.messages = mainMessages.map((message) => ({
        ...message,
        replies: replies.filter((reply) => reply.antwort_auf === message.id),
      }));

      // Standardmäßig alle Antworten ausblenden
      this.messages.forEach((message) => {
        this.showReplies[message.id] = false;
      });

      this.scrollToBottom(); // Zum neuesten Beitrag scrollen
    },

    // Vorname des aktuellen Nutzers abrufen
    async fetchUserFirstName() {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        console.error("Kein Nutzer eingeloggt.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Fehler beim Abrufen des Vornamens:", error.message);
      } else {
        this.userFirstName = data?.name || "Unbekannt";
      }
    },

    // Nachricht in der Datenbank speichern
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
        this.newMessage = "";
        await this.fetchMessages();
      }
    },

    // Antwort in der Datenbank speichern
    async submitReply(messageId) {
      if (!this.userFirstName) {
        alert("Fehler: Nutzername konnte nicht abgerufen werden.");
        return;
      }

      const replyText = this.newReplies[messageId];
      if (!replyText) return;

      const fullReply = `${this.userFirstName}: ${replyText}`;
      const { error } = await supabase.from("forum_posts").insert([
        {
          inhalt: fullReply,
          antwort_auf: messageId,
          zeitstempel: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Fehler beim Senden der Antwort:", error.message);
        alert("Fehler beim Senden der Antwort.");
      } else {
        this.newReplies[messageId] = "";
        this.showReplyForm[messageId] = false;
        await this.fetchMessages();
      }
    },

    // Zeigt/verbirgt das Antwortformular für eine Nachricht
    toggleReplyForm(messageId) {
      this.showReplyForm[messageId] = !this.showReplyForm[messageId];
    },

    // Zeigt/verbirgt die Antworten einer Nachricht
    toggleReplies(messageId) {
      this.showReplies[messageId] = !this.showReplies[messageId];
    },

    // Zeitstempel formatieren
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    },

    // Automatisch zum neuesten Beitrag scrollen
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector(".forum-container");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.forum-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* Nachrichten-Container */
.forum-container {
  height: 400px;
  width: 100%;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Einzelne Nachricht */
.message {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.message:last-child {
  border-bottom: none;
}

.timestamp {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

/* Antworten */
.replies {
  margin-left: 20px;
  border-left: 2px solid #ddd;
  padding-left: 10px;
}

.reply {
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 5px;
}

/* Antwortformular */
.reply-form {
  margin-top: 10px;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #009260;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3b7b5b;
}

.toggle-replies-button {
  margin-top: 5px;
  background-color: #6c757d;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.toggle-replies-button:hover {
  background-color: #5a6268;
}
</style>
