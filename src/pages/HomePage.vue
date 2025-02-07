<template>
  <div class="homePage">
    <!-- Suchkomponente -->
    <SearchComponent />
    <!-- Abschnitt mit Hintergrundbild -->
    <div class="hero-section">
      <div class="hero-content">
        <h2>Willkommen auf unserer Plattform!</h2>
        <p>Entdecke die neuesten Fahrten, das Forum und vieles mehr!</p>

      </div>
    </div>

    <div class="sticky-note">
      <h2>Willkommen bei UniDrive! 🚗</h2>
      <p>Schön, dass du hier bist! <strong>UniDrive</strong> ist die Plattform für Studierende, die gemeinsam zur Uni
        pendeln möchten.
        Ob du eine Mitfahrgelegenheit suchst oder selbst eine Fahrt anbietest – hier findest du schnell die passende
        Verbindung.</p>

      <ul>
        <li>🌍 <strong>Nachhaltig & Günstig</strong> – Spare Geld und schone die Umwelt.</li>
        <li>🤝 <strong>Gemeinsam statt einsam</strong> – Lerne neue Leute kennen und teile die Fahrt.</li>
        <li>📍 <strong>Flexibel & Einfach</strong> – Finde Fahrten, die zu deinem Zeitplan passen.</li>
      </ul>

      <p><strong>Melde dich jetzt an</strong> und werde Teil unserer Mitfahr-Community! 🚀</p>
    </div>

    <!-- Hauptinhalt -->
    <div class="main-content">
      <!-- "Wer fährt heute?" Block -->
      <div class="content-block" style="background-image: url('/images/icons8-traffic-jam-64.png')">
        <div class="content-overlay">
          <router-link to="/view-all-Trips">
            <h2>Wer fährt demnächst?</h2>
            <p>
              Hier kannst du einsehen welche Fahrten anstehen
            </p>
            <button class="btn">Erfahre Mehr</button>
          </router-link>
        </div>
      </div>


      <!-- "Meine Fahrten" Block -->
      <div class="content-block" style="background-image: url('/images/icons8-steering-wheel-64.png')">
        <router-link to="/profile" class="content-overlay">
          <h2>Meine Fahrten</h2>
          <p>Siehe deine anstehenden Fahrten ein</p>
          <button class="btn">Erfahre Mehr</button>
        </router-link>
      </div>

      <!-- Forum-Kasten -->
      <div class="content-block" style="background-image: url('/images/icons8-messages-64.png')">
        <router-link to="/forum" class="content-overlay">
          <div class="forum-preview-content">
            <!-- Titel und Beschreibung -->
            <div class="forum-header">
              <h2>Forum</h2>
              <p>Hier kannst du dich mit Kommilitonen austauschen.</p>
            </div>

            <!-- Nachrichten-Vorschau -->
            <div class="forum-messages">
              <div v-for="message in recentMessages" :key="message.id" class="forum-message">
                <p>{{ message.inhalt }}</p>
                <small class="timestamp">
                  {{ formatTimestamp(message.zeitstempel) }}
                </small>
              </div>
            </div>
            <button class="btn">Zum Forum</button>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Neuer Button zum Inserieren von Fahrten -->
    <div class="insert-ride-block">
      <router-link to="/rides" class="insert-ride-btn">
        + Neue Fahrt inserieren
      </router-link>
    </div>
  </div>
</template>

<script>
import SearchComponent from "@/components/SearchComponent.vue";
import { supabase } from "@/services/supabase.js";

export default {
  name: "HomePage",
  components: {
    SearchComponent,
  },
  data() {
    return {
      recentMessages: [], // Letzte Hauptnachrichten für die Vorschau
    };
  },
  async mounted() {
    await this.fetchRecentMessages();
  },
  methods: {
    // Abrufen der letzten Hauptnachrichten aus der Datenbank
    async fetchRecentMessages() {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("id, inhalt, zeitstempel") // Zeitstempel abrufen
        .is("antwort_auf", null) // Nur Hauptnachrichten
        .order("zeitstempel", { ascending: false }) // Neueste Nachrichten zuerst
        .limit(2); // Zeige die letzten 2 Hauptnachrichten

      if (error) {
        console.error("Fehler beim Laden der Nachrichten:", error.message);
      } else {
        this.recentMessages = data.reverse(); // Chronologisch sortieren
      }
    },
    // Zeitstempel formatieren
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString(); // Zeitformat (z. B. 20.01.2025, 14:00)
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/pages/home.css";
</style>
