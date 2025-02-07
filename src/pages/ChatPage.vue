<template>
  <div class="chat-page">
    <h1>Gruppenübersicht</h1>
    <div class="rides-list">
      <div v-for="ride in ridesWithLastMessage" :key="ride.ride_id" class="ride-item">
        <!-- Fahrtbeschreibung -->
        <div class="ride-info" @click="toggleChat(ride.ride_id)">
          [FahrtID: {{ ride.ride_id }}] Von {{ ride.start_string }} nach {{ ride.end_string }} - {{ ride.ride_date }} {{
            ride.ride_time }}
        </div>

        <!-- Letzte Nachricht -->
        <p class="last-message">
          <span v-if="ride.lastMessage">
            {{ formatTimestamp(ride.lastMessage.zeitstempel) }} - {{ ride.lastMessage.inhalt }}
          </span>
          <span v-else>Noch keine Nachricht</span>
        </p>

        <!-- Buttons für Gruppe verwalten / verlassen -->
        <div class="group-buttons">
          <button v-if="ride.user_id === currentUserId" class="delete-button" @click="deleteRide(ride.ride_id)">
            Gruppe löschen
          </button>
          <button v-else class="leave-button" @click="leaveGroup(ride.ride_id)">
            Gruppe verlassen
          </button>
        </div>

        <!-- Chat-Komponente, wenn die Fahrt ausgewählt ist -->
        <div v-if="openChatId === ride.ride_id" class="chat-container">
          <div class="messages-container">
            <div v-for="message in ride.messages" :key="message.id" class="message">
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
            <textarea v-model="newMessage" placeholder="Nachricht schreiben..." required></textarea>
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
      ridesWithLastMessage: [], // Liste der Fahrten, jede mit der letzten Nachricht und vollständigen Nachrichten
      openChatId: null, // ID der aktuell geöffneten Fahrt für den Chat
      newMessage: "", // Inhalt der neuen Nachricht, die der Benutzer eingibt
      currentUserId: null, // Aktuelle Benutzer-ID, abgerufen nach Login
    };
  },

  async mounted() {
    /**
     * Beim Mounten der Komponente:
     * 1. Benutzer-ID abrufen (authentifizierter Benutzer).
     * 2. Fahrten mit zugehörigen Nachrichten abrufen.
     */
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error.message);
        return;
      }
      if (user) {
        this.currentUserId = user.id;
        await this.fetchRidesWithLastMessage();
      }
    } catch (err) {
      console.error("Ein Fehler ist beim Initialisieren der Komponente aufgetreten:", err.message);
    }
  },

  methods: {
    /**
     * Ruft alle Fahrten ab, an denen der aktuelle Benutzer teilnimmt.
     * Fügt für jede Fahrt die letzte Nachricht sowie alle zugehörigen Nachrichten hinzu.
     */
    async fetchRidesWithLastMessage() {
      try {
        const { data: rides, error: ridesError } = await supabase
          .from("rides")
          .select("*");

        if (ridesError) {
          console.error("Fehler beim Abrufen der Fahrten:", ridesError.message);
          return;
        }

        // Filtert Fahrten basierend auf der Teilnehmerliste, um nur relevante Fahrten zu laden
        const userRides = rides.filter((ride) => {
          try {
            const participants = Array.isArray(ride.participants) ? ride.participants : [];
            return participants.includes(this.currentUserId);
          } catch (err) {
            console.error(`Fehler beim Verarbeiten der participants-Liste für Fahrt ${ride.ride_id}:`, err.message);
            return false;
          }
        });

        // Abrufen der letzten Nachricht und aller Nachrichten für jede Fahrt
        this.ridesWithLastMessage = await Promise.all(
          userRides.map(async (ride) => {
            const [lastMessage, allMessages] = await Promise.all([
              supabase
                .from("gruppenchats")
                .select("*")
                .eq("fahrt_id", ride.ride_id)
                .order("zeitstempel", { ascending: false })
                .limit(1)
                .single()
                .then((response) => response.data)
                .catch(() => null),
              supabase
                .from("gruppenchats")
                .select("*")
                .eq("fahrt_id", ride.ride_id)
                .order("zeitstempel", { ascending: true })
                .then((response) => response.data)
                .catch(() => []),
            ]);

            return {
              ...ride,
              lastMessage: lastMessage || null, // Letzte Nachricht oder null, falls keine vorhanden
              messages: allMessages || [], // Vollständige Nachrichtenliste
            };
          })
        );
      } catch (err) {
        console.error("Fehler beim Abrufen der Fahrten und Nachrichten:", err.message);
      }
    },

    /**
     * Formatiert einen Zeitstempel in ein lokales Datums- und Zeitformat.
     * @param {string} timestamp - Zeitstempel im ISO-Format
     * @returns {string} Formatierter Zeitstempel
     */
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    },

    /**
     * Öffnet oder schließt den Chat für eine spezifische Fahrt.
     * @param {number} rideId - ID der Fahrt
     */
    toggleChat(rideId) {
      this.openChatId = this.openChatId === rideId ? null : rideId;
    },

    /**
     * Speichert eine neue Nachricht in der Datenbank.
     * Aktualisiert anschließend die Nachrichtenliste.
     * @param {number} rideId - ID der Fahrt, zu der die Nachricht gehört
     */
    async submitMessage(rideId) {
      if (!this.currentUserId) {
        alert("Bitte melden Sie sich an, um Nachrichten zu senden.");
        return;
      }

      try {
        // Benutzerprofil abrufen, um den Namen anzuzeigen
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", this.currentUserId)
          .single();

        if (profileError || !profile) {
          console.error("Fehler beim Abrufen des Profils:", profileError.message);
          alert("Fehler beim Abrufen des Profils.");
          return;
        }

        const fullMessage = `${profile.name}: ${this.newMessage}`;

        // Nachricht in die Datenbank einfügen
        const { error } = await supabase.from("gruppenchats").insert([
          {
            fahrt_id: rideId,
            inhalt: fullMessage,
            zeitstempel: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Fehler beim Speichern der Nachricht:", error.message);
          alert("Fehler beim Speichern der Nachricht.");
          return;
        }

        // UI aktualisieren
        this.newMessage = "";
        await this.fetchRidesWithLastMessage();
      } catch (err) {
        console.error("Fehler beim Senden der Nachricht:", err.message);
      }
    },

    /**
     * Löscht eine Fahrt aus der Datenbank und entfernt sie aus der UI.
     * @param {number} rideId - ID der Fahrt, die gelöscht werden soll
     */
    async deleteRide(rideId) {
      if (!confirm("Möchtest du diese Fahrt wirklich löschen?")) return;

      try {
        const { error } = await supabase
          .from("rides")
          .delete()
          .eq("ride_id", rideId);

        if (error) {
          console.error("Fehler beim Löschen der Fahrt:", error.message);
          alert("Fehler beim Löschen der Fahrt.");
          return;
        }

        alert("Fahrt erfolgreich gelöscht!");
        this.ridesWithLastMessage = this.ridesWithLastMessage.filter((ride) => ride.ride_id !== rideId);
      } catch (err) {
        console.error("Fehler beim Löschen der Fahrt:", err.message);
      }
    },

    /**
     * Entfernt den Benutzer aus der Teilnehmerliste einer Fahrt.
     * @param {number} rideId - ID der Fahrt
     */
    async leaveGroup(rideId) {
      if (!this.currentUserId) {
        alert("Bitte melden Sie sich an, um eine Gruppe zu verlassen.");
        return;
      }

      try {
        // Teilnehmer abrufen und aktuellen Benutzer entfernen
        const { data: ride, error } = await supabase
          .from("rides")
          .select("participants")
          .eq("ride_id", rideId)
          .single();

        if (error || !ride) {
          console.error("Fehler beim Laden der Fahrt:", error?.message);
          alert("Fehler beim Laden der Fahrt.");
          return;
        }

        const participants = (ride.participants || []).filter((id) => id !== this.currentUserId);

        // Aktualisierte Teilnehmerliste in die Datenbank schreiben
        const { error: updateError } = await supabase
          .from("rides")
          .update({ participants })
          .eq("ride_id", rideId);

        if (updateError) {
          console.error("Fehler beim Verlassen der Gruppe:", updateError.message);
          alert("Fehler beim Verlassen der Gruppe.");
          return;
        }

        alert("Gruppe erfolgreich verlassen!");
        this.ridesWithLastMessage = this.ridesWithLastMessage.filter((ride) => ride.ride_id !== rideId);
      } catch (err) {
        console.error("Fehler beim Verlassen der Gruppe:", err.message);
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/ChatPage.css';
</style>