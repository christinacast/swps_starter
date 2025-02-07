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
import SearchComponent from "@/components/SearchComponent.vue"; // Import der Suchkomponente
import { supabase } from "@/services/supabase.js"; // Verbindung zur Supabase-Datenbank

export default {
  name: "HomePage",
  components: {
    SearchComponent, // Einbinden der Suchkomponente
  },
  data() {
    return {
      recentMessages: [], // Speichert die letzten Hauptnachrichten für die Forums-Vorschau
    };
  },
  async mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente gerendert wurde.
     * Aktion: Die letzten Hauptnachrichten aus der Datenbank abrufen, um sie auf der Startseite anzuzeigen.
     */
    await this.fetchRecentMessages();
  },
  methods: {
    /**
     * Lädt die letzten Hauptnachrichten aus der Supabase-Datenbank.
     * - Abruf erfolgt aus der Tabelle "forum_posts".
     * - Nur Hauptnachrichten (keine Antworten) werden berücksichtigt.
     * - Ergebnisse werden chronologisch sortiert und auf zwei Nachrichten begrenzt.
     */
    async fetchRecentMessages() {
      try {
        // Abrufen der Hauptnachrichten aus der Tabelle "forum_posts"
        const { data, error } = await supabase
          .from("forum_posts") // Tabelle "forum_posts" in der Datenbank
          .select("id, inhalt, zeitstempel") // Nur relevante Spalten abrufen
          .is("antwort_auf", null) // Filter: Nur Hauptnachrichten ohne Bezug auf andere Nachrichten
          .order("zeitstempel", { ascending: false }) // Neueste Nachrichten zuerst
          .limit(2); // Abrufen der letzten zwei Hauptnachrichten

        if (error) {
          // Fehlerbehandlung bei Abfragefehlern
          console.error("Fehler beim Laden der Nachrichten:", error.message);
          return;
        }

        // Umkehrung der Reihenfolge, damit die Nachrichten chronologisch angezeigt werden
        this.recentMessages = data.reverse();
      } catch (err) {
        // Allgemeine Fehlerbehandlung für unerwartete Fehler
        console.error("Ein unerwarteter Fehler ist aufgetreten:", err.message);
      }
    },

    /**
     * Formatiert einen Zeitstempel in ein lesbares Datums- und Zeitformat.
     * @param {string} timestamp - Zeitstempel im ISO-Format
     * @returns {string} Formatierter Zeitstempel (z. B. 07.02.2025, 15:30)
     */
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString(); // Lokales Datums- und Zeitformat anwenden
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/pages/home.css";
</style>
