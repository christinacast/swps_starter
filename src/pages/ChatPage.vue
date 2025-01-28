<template>
  <div class="chat-page">
    <h1>Gruppenübersicht</h1>
    <div class="rides-list">
      <div
        v-for="ride in ridesWithLastMessage"
        :key="ride.ride_id"
        class="ride-item"
      >
        <!-- Fahrtbeschreibung -->
        <div class="ride-info" @click="toggleChat(ride.ride_id)">
          [FahrtID: {{ ride.ride_id }}] Von {{ ride.start_string }} nach {{ ride.end_string }} - {{ ride.ride_date }} {{ ride.ride_time }}
        </div>

        <!-- Letzte Nachricht -->
        <p class="last-message">
          <span v-if="ride.lastMessage">
            {{ formatTimestamp(ride.lastMessage.zeitstempel) }} - {{ ride.lastMessage.inhalt }}
          </span>
          <span v-else>Noch keine Nachricht</span>
        </p>

        <!-- Chat-Komponente, wenn die Fahrt ausgewählt ist -->
        <div v-if="openChatId === ride.ride_id" class="chat-container">
          <div class="messages-container">
            <div
              v-for="message in ride.messages"
              :key="message.id"
              class="message"
            >
              <p>
                <strong>{{ message.inhalt }}</strong>
              </p>
              <small class="timestamp">
                {{ formatTimestamp(message.zeitstempel) }}
              </small>
            </div>
          </div>

          <!-- Neue Nachricht schreiben -->
          <form @submit.prevent="submitMessage(ride.ride_id)" class="new-message-form">
            <textarea
              v-model="newMessage"
              placeholder="Nachricht schreiben..."
              required
            ></textarea>
            <button type="submit">Senden</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase.js";

export default {
  name: "ChatPage",
  data() {
    return {
      ridesWithLastMessage: [], // Fahrten mit letzter Nachricht
      openChatId: null, // ID der Fahrt, deren Chat geöffnet ist
      newMessage: "", // Eingabefeld für neue Nachrichten
    };
  },
  async mounted() {
    await this.fetchRidesWithLastMessage();
  },
  methods: {
    // Fahrten und Nachrichten abrufen
    async fetchRidesWithLastMessage() {
      // Abrufen aller Fahrten aus der Tabelle rides
      const { data: rides, error: ridesError } = await supabase.from("rides").select("*");

      if (ridesError) {
        console.error("Fehler beim Abrufen der Fahrten:", ridesError.message);
        return;
      }

      // Für jede Fahrt die letzte Nachricht und alle Nachrichten abrufen
      const ridesWithMessages = await Promise.all(
        rides.map(async (ride) => {
          const { data: lastMessage, error: messageError } = await supabase
            .from("gruppenchats")
            .select("*")
            .eq("fahrt_id", ride.ride_id)
            .order("zeitstempel", { ascending: false })
            .limit(1)
            .single();

          const { data: allMessages, error: allMessagesError } = await supabase
            .from("gruppenchats")
            .select("*")
            .eq("fahrt_id", ride.ride_id)
            .order("zeitstempel", { ascending: true });

          if (messageError && messageError.code !== "PGRST116") {
            console.error(`Fehler beim Abrufen der letzten Nachricht für Fahrt ${ride.ride_id}:`, messageError.message);
          }

          if (allMessagesError) {
            console.error(`Fehler beim Abrufen aller Nachrichten für Fahrt ${ride.ride_id}:`, allMessagesError.message);
          }

          return {
            ...ride,
            lastMessage: lastMessage || null, // Letzte Nachricht oder null
            messages: allMessages || [], // Alle Nachrichten oder leer
          };
        })
      );

      this.ridesWithLastMessage = ridesWithMessages;
    },

    // Zeitstempel formatieren
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    },

    // Chat ein-/ausblenden
    toggleChat(rideId) {
      this.openChatId = this.openChatId === rideId ? null : rideId; // Toggle-Logik
    },

    // Neue Nachricht speichern
    async submitMessage(rideId) {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        alert("Sie müssen eingeloggt sein, um Nachrichten zu schreiben.");
        return;
      }

      // Vorname des Nutzers abrufen
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.error("Fehler beim Abrufen des Nutzernamens:", profileError.message);
        alert("Fehler beim Abrufen Ihres Profils.");
        return;
      }

      const fullMessage = `${profile.name}: ${this.newMessage}`;

      const { error } = await supabase.from("gruppenchats").insert([
        {
          fahrt_id: rideId,
          inhalt: fullMessage,
          zeitstempel: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Fehler beim Senden der Nachricht:", error.message);
        alert("Fehler beim Senden der Nachricht.");
        return;
      }

      // Nachricht erfolgreich gespeichert, Chat aktualisieren
      this.newMessage = "";
      await this.fetchRidesWithLastMessage();
    },
  },
};
</script>

<style scoped>
.chat-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.rides-list {
  margin-top: 20px;
}

.ride-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ride-info {
  font-weight: bold;
  cursor: pointer;
}

.last-message {
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}

.chat-container {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.messages-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 5px;
}

.message {
  margin-bottom: 10px;
}

.timestamp {
  font-size: 12px;
  color: #888;
}

.new-message-form textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.new-message-form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.new-message-form button:hover {
  background-color: #0056b3;
}
</style>
