<template>
  <div class="login-container">
    <h1 class="login-title">Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-input" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password"
          required />
      </div>

      <button type="submit" class="form-button">Login</button>
    </form>
    <p class="register-link">Don't have an account? <router-link to="/register" class="link">Register</router-link></p>
  </div>
</template>

<script>
import { supabase } from '@/services/supabase.js'; // Import der Verbindung zu Supabase

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '', // E-Mail-Adresse des Benutzers (vom Eingabeformular)
      password: '', // Passwort des Benutzers (vom Eingabeformular)
    };
  },
  methods: {
    /**
     * Handhabt den Login-Vorgang, wenn das Formular abgesendet wird.
     * 1. Überprüft die Anmeldedaten mithilfe von Supabase.
     * 2. Bei Erfolg wird der Benutzer zur Profilseite weitergeleitet.
     * 3. Bei Fehler wird eine Fehlermeldung angezeigt.
     */
    async handleLogin() {
      try {
        // Authentifizierung bei Supabase mit der E-Mail und dem Passwort des Benutzers
        const { error } = await supabase.auth.signInWithPassword({
          email: this.email, // Benutzer-E-Mail
          password: this.password, // Benutzer-Passwort
        });

        // Fehlerprüfung: Wenn ein Fehler auftritt, wird eine Benachrichtigung ausgegeben
        if (error) {
          console.error('Login-Fehler:', error.message); // Fehler in der Konsole anzeigen
          alert('Fehler beim Einloggen: ' + error.message); // Benutzer benachrichtigen
          return; // Ausführung beenden
        }

        // Benutzer erfolgreich eingeloggt, Weiterleitung zur Profilseite
        this.$router.push({
          name: 'Profile', // Name der Zielroute (Profilseite)
          params: {
            userName: this.email, // Übergabe der Benutzer-E-Mail als Parameter
            userPassword: this.password, // Übergabe des Passworts (sollte aus Sicherheitsgründen vermieden werden!)
          },
        });
      } catch (err) {
        // Allgemeine Fehlerbehandlung für unerwartete Probleme
        console.error('Ein unerwarteter Fehler ist aufgetreten:', err.message);
        alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/LoginPage.css';
</style>
