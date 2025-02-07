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
      ridesWithLastMessage: [], // Fahrten mit letzter Nachricht
      openChatId: null, // ID der Fahrt, deren Chat geöffnet ist
      newMessage: "", // Eingabefeld für neue Nachrichten
      currentUserId: null, // Aktuelle Benutzer-ID
    };
  },

  async mounted() {
    // Aktuelle Benutzer-ID abrufen
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Fehler beim Abrufen des Benutzers:", error.message);
    }
    if (user) {
      this.currentUserId = user.id;
    }
    await this.fetchRidesWithLastMessage();
  },

  methods: {
    // Fahrten und Nachrichten abrufen
    async fetchRidesWithLastMessage() {
      // Aktuellen Benutzer abrufen
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Fehler beim Abrufen des Benutzers:", userError?.message);
        return;
      }
      const userId = user.id;

      // Fahrten abrufen
      const { data: rides, error: ridesError } = await supabase.from("rides").select("*");
      if (ridesError) {
        console.error("Fehler beim Abrufen der Fahrten:", ridesError.message);
        return;
      }

      // Fahrten filtern: Nur Fahrten anzeigen, bei denen der Benutzer im participants-Array ist
      const userRides = rides.filter(ride => {
        try {
          const participants = Array.isArray(ride.participants) ? ride.participants : [];
          return participants.includes(userId);
        } catch (err) {
          console.error(`Fehler beim Parsen des participants-Arrays für Fahrt ${ride.ride_id}:`, err);
          return false;
        }
      });

      // Nachrichten für diese Fahrten abrufen
      const ridesWithMessages = await Promise.all(
        userRides.map(async (ride) => {
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

      // Gefilterte Fahrten in die UI laden
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

    //Gruppe löschen
    async deleteRide(rideId) {
      const confirmation = confirm("Möchtest du diese Fahrt wirklich löschen?");
      if (!confirmation) return;

      const { error } = await supabase
        .from("rides")
        .delete()
        .eq("ride_id", rideId);

      if (error) {
        alert("Fehler beim Löschen der Fahrt.");
        console.error("Fehler beim Löschen:", error.message);
      } else {
        alert("Fahrt erfolgreich gelöscht!");

        // Entferne die Fahrt aus der UI
        this.ridesWithLastMessage = this.ridesWithLastMessage.filter(ride => ride.ride_id !== rideId);
      }
    },

    // Gruppe verlassen
    async leaveGroup(rideId) {
      if (!this.currentUserId) {
        alert("Bitte einloggen, um eine Gruppe zu verlassen.");
        return;
      }

      // Lade die aktuelle participants-Liste aus Supabase
      let { data: ride, error } = await supabase
        .from('rides')
        .select('participants')
        .eq('ride_id', rideId)
        .single();

      if (error || !ride) {
        alert("Fehler beim Laden der Fahrt.");
        return;
      }

      // Sicherstellen, dass `participants` ein Array ist
      let participants = Array.isArray(ride.participants) ? ride.participants : [];

      // Entferne den Benutzer aus der Teilnehmerliste
      participants = participants.filter(id => id !== this.currentUserId);

      // Setze `verlassen` auf die UUID des Users, der die Gruppe verlassen hat
      const { error: updateError } = await supabase
        .from("rides")
        .update({ participants, verlassen: this.currentUserId }) // nur `verlassen` setzen
        .eq("ride_id", rideId);

      if (updateError) {
        alert("Fehler beim Verlassen der Gruppe.");
      } else {
        alert("Du hast die Gruppe erfolgreich verlassen!");
        // UI aktualisieren: Entferne die Fahrt aus der Liste
        this.ridesWithLastMessage = this.ridesWithLastMessage.filter(ride => ride.ride_id !== rideId);
      }
    }
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/ChatPage.css';
</style>