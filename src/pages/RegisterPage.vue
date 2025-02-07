<template>
  <div class="register-container">
    <h1 class="register-title">Register</h1>
    <form @submit.prevent="handleRegister" class="register-form">

      <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" v-model="name" class="form-input" placeholder="Enter your name" required />
      </div>

      <div class="form-group">
        <label for="surname" class="form-label">Surname</label>
        <input type="text" id="surname" v-model="surname" class="form-input" placeholder="Enter your surname"
          required />
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-input" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password"
          required />
      </div>

      <button type="submit" class="form-button">Register</button>
    </form>
    <p class="login-link">Already have an account? <router-link to="/login" class="link">Login</router-link></p>
  </div>
</template>

<script>
import { supabase } from '@/services/supabase.js'; // Verbindung zur Supabase-Datenbank

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '', // Vorname des Benutzers
      surname: '', // Nachname des Benutzers
      email: '', // E-Mail-Adresse des Benutzers
      password: '' // Passwort des Benutzers
    };
  },
  methods: {
    /**
     * Handhabt die Registrierung eines neuen Benutzers.
     * 1. Erstellt einen neuen Benutzer mit der E-Mail und dem Passwort.
     * 2. Fügt zusätzliche Profildaten (Name, Nachname, E-Mail) in die Tabelle "profiles" ein.
     * 3. Bei Erfolg wird der Benutzer zur Login-Seite weitergeleitet.
     * 4. Bei Fehlern werden diese ausgegeben und dem Benutzer mitgeteilt.
     */
    async handleRegister() {
      try {
        // Registrierung des Benutzers bei Supabase (Auth-Service)
        const { data, error } = await supabase.auth.signUp({
          email: this.email, // E-Mail-Adresse aus dem Formular
          password: this.password // Passwort aus dem Formular
        });

        // Überprüfung, ob ein Fehler aufgetreten ist
        if (error) {
          alert('Fehler bei der Registrierung: ' + error.message); // Benutzer informieren
          console.error('Registrierungsfehler:', error.message); // Fehler in der Konsole anzeigen
          return;
        }

        // Zusätzliche Profildaten in die Tabelle "profiles" einfügen
        const { error: profileError } = await supabase
          .from('profiles') // Tabelle "profiles" in der Datenbank
          .insert([
            {
              id: data.user.id, // Benutzer-ID, die von Supabase generiert wurde
              name: this.name, // Vorname aus dem Formular
              surname: this.surname, // Nachname aus dem Formular
              email: this.email // E-Mail-Adresse aus dem Formular
            }
          ]);

        // Überprüfung, ob ein Fehler beim Einfügen der Profildaten aufgetreten ist
        if (profileError) {
          alert('Fehler beim Erstellen des Profils: ' + profileError.message); // Benutzer informieren
          console.error('Profilfehler:', profileError.message); // Fehler in der Konsole anzeigen
        } else {
          // Erfolgreiche Registrierung, Benutzer zur Login-Seite weiterleiten
          alert('Registrierung erfolgreich! Bitte loggen Sie sich ein.');
          this.$router.push('/login'); // Weiterleitung zur Login-Seite
        }
      } catch (err) {
        // Allgemeine Fehlerbehandlung
        console.error('Ein unerwarteter Fehler ist aufgetreten:', err.message);
        alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  }
};
</script>

<style scoped>
@import '@/assets/css/pages/RegisterPage.css';
</style>
