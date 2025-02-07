<template>
  <header class="top-bar">
    <h1>Uni DRIVE</h1>
    <div class="center-items">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/maps" class="nav-link">Karten</router-link>
      <router-link to="/calendar" class="nav-link">Kalender</router-link>
      <router-link to="/chat" class="nav-link">Chat</router-link>
    </div>
    <div class="profile" v-if="user">
      <router-link to="/profile" class="nav-link-profile">
        <!-- Greet the user and display their profile icon -->
        <p class="greeting">Hallo, {{ user.name }}</p>
      </router-link>
      <img src="/images/icons8-admin-settings-male-64.png" alt="profile" class="profile-nav-icon" />
    </div>
    <div class="login-register-container" v-else>
      <!-- Show login/register if no user is logged in -->
      <router-link to="/login" class="user-link login-button">
        Login
      </router-link>
      <router-link to="/register" class="user-link signup-button">
        Sign-Up
      </router-link>
    </div>
  </header>
</template>

<script>
import { supabase } from '@/services/supabase.js'; // Importiert die Supabase-Instanz zur Authentifizierung und Datenabfrage

export default {
  name: 'HeaderComponent', // Name der Vue.js-Komponente, wichtig für Debugging und Wiederverwendbarkeit

  data() {
    return {
      user: null, // Reaktives Datenobjekt, um Informationen über den aktuell eingeloggten Benutzer zu speichern. Standardmäßig ist kein Benutzer eingeloggt.
    };
  },

  async mounted() {
    /**
     * Der `mounted` Lifecycle-Hook wird ausgeführt, wenn die Komponente vollständig in den DOM geladen wurde.
     * Hier werden initiale Daten abgerufen und Listener für Authentifizierungsänderungen eingerichtet.
     */
    
    // Schritt 1: Abrufen der Benutzerinformationen beim Laden der Komponente
    await this.fetchUser();

    // Schritt 2: Hinzufügen eines Event-Listeners für Änderungen des Authentifizierungsstatus
    // `onAuthStateChange` überwacht Anmeldungen, Abmeldungen und andere Authentifizierungsänderungen.
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        // Wenn ein Benutzer angemeldet ist, die Benutzerdaten erneut abrufen
        await this.fetchUser();
      } else {
        // Wenn der Benutzer abgemeldet ist, den `user`-Status zurücksetzen
        this.user = null;
      }
    });
  },

  methods: {
    /**
     * Ruft die Informationen des aktuell authentifizierten Benutzers ab und lädt zusätzliches Profilwissen aus der Datenbank.
     */
    async fetchUser() {
      try {
        // Schritt 1: Aktuell eingeloggten Benutzer aus der Supabase-Authentifizierung abrufen
        const { data } = await supabase.auth.getUser();

        if (data && data.user) {
          // Schritt 2: Wenn ein Benutzer vorhanden ist, zusätzliche Profildaten aus der Tabelle `profiles` abrufen
          const { data: profile, error: profileError } = await supabase
            .from('profiles') // Abfragen der Tabelle "profiles" in der Datenbank
            .select('name') // Nur die Spalte "name" abrufen
            .eq('id', data.user.id) // Filter: Benutzer-ID muss mit der ID des eingeloggten Benutzers übereinstimmen
            .single(); // Es wird nur eine Zeile erwartet

          if (!profileError) {
            // Schritt 3: Benutzer- und Profildaten kombinieren und im `user`-State speichern
            this.user = {
              ...data.user, // Enthält Basis-Benutzerdaten wie E-Mail, ID etc.
              name: profile?.name || 'User', // Fallback: Standardname 'User', falls kein Name im Profil vorhanden ist
            };
          } else {
            console.error('Fehler beim Abrufen der Profilinformationen:', profileError.message);
          }
        }
      } catch (error) {
        // Unerwartete Fehler während des Datenabrufs behandeln
        console.error('Fehler beim Abrufen des Benutzers:', error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Spezifische Stile für die Überschrift */
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
</style>