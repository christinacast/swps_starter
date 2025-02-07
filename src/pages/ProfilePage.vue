<template>
  <div class="profile-container">
    <h1 class="profile-title">Profile Seite</h1>
    <p class="profile-description">Hier kannst du deine eigenen Daten einsehen.</p>

    <div v-if="user" class="profile-card">
      <!-- Display user details -->
      <div class="profile-item">
        <strong>Name:</strong>
        <span>{{ profile.name || 'Unknown' }}</span>
      </div>
      <div class="profile-item">
        <strong>Nachname:</strong>
        <span>{{ profile.surname || 'Unknown' }}</span>
      </div>
      <div class="profile-item">
        <strong>Email:</strong>
        <span>{{ user.email }}</span>
      </div>

      <!-- Logout button -->
      <button class="form-button" @click="logout">Logout</button>
    </div>

    <div v-else class="profile-not-logged-in">
      <p>You are not logged in. <router-link to="/login" class="link">Login here</router-link></p>
    </div>
  </div>

  <!-- Fahrten Section -->
  <div v-if="user" class="fahrten-container">
    <div class="fahrten-section">
      <h2 class="fahrten-heading">Deine anstehenden Fahrten</h2>
      <p class="table-sort-info">
        Zum Sortieren der Tabelle, einfach auf den jeweiligen Header der Spalte klicken
      </p>
      <table class="fahrten-table">
        <thead>
          <tr>
            <th @click="sortTable('ride_date', this.upcomingRides)">Datum</th>
            <th @click="sortTable('ride_time', this.upcomingRides)">Uhrzeit</th>
            <th @click="sortTable('start_string', this.upcomingRides)">Abreiseort</th>
            <th @click="sortTable('end_string', this.upcomingRides)">Zielort</th>
            <th @click="sortTable('status', this.upcomingRides)">Status</th>
            <th @click="sortTable('available_seats', this.upcomingRides)">Plätze</th>
            <th>Fahrt auf der Karte einsehen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ride in upcomingRides" :key="ride.id">
            <td>{{ ride.ride_date }}</td>
            <td>{{ ride.ride_time }}</td>
            <td>{{ ride.start_string }}</td>
            <td>{{ ride.end_string }}</td>
            <td>{{ ride.status }}</td>
            <td>{{ ride.available_seats }}</td>
            <td> <router-link :to="`/maps?start=${ride.start_point.coordinates}&end=${ride.end_point.coordinates}`">
                Karte
              </router-link></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="fahrten-section">
      <h2 class="fahrten-heading">Deine vergangenen Fahrten</h2>
      <table class="fahrten-table">
        <thead>
          <tr>
            <th @click="sortTable('ride_date', this.pastRides)">Datum</th>
            <th @click="sortTable('ride_time', this.pastRides)">Uhrzeit</th>
            <th @click="sortTable('start_string', this.pastRides)">Abreiseort</th>
            <th @click="sortTable('end_string', this.pastRides)">Zielort</th>
            <th @click="sortTable('available_seats', this.pastRides)">Plätze</th>
            <th @click="sortTable('co2Saved', this.pastRides)">eingespartes CO₂</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ride in pastRides" :key="ride.id">
            <td>{{ ride.ride_date }}</td>
            <td>{{ ride.ride_time }}</td>
            <td>{{ ride.start_string }}</td>
            <td>{{ ride.end_string }}</td>
            <td>{{ ride.available_seats }}</td>
            <td>{{ ride.co2Saved }} g</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/services/supabase.js'; // Verbindung zur Supabase-Datenbank
import { haversineDistance } from '@/services/kmDistanceComputation.js'; // Import der Funktion zur Berechnung von Distanzen

export default {
  name: 'ProfilePage',
  data() {
    return {
      user: null, // Daten des eingeloggten Benutzers
      profile: {}, // Profildaten des Benutzers (Name, Nachname)
      upcomingRides: [], // Liste der anstehenden Fahrten
      pastRides: [], // Liste der vergangenen Fahrten
    };
  },
  async mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente gerendert wurde.
     * Aktionen:
     * 1. Benutzer-Authentifizierungsdaten abrufen.
     * 2. Profildaten des Benutzers laden.
     * 3. Fahrten abrufen und in anstehende und vergangene Fahrten trennen.
     */
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      this.user = authData.user;

      // Profildaten des Benutzers abrufen
      const { data: profileData, error: profileError } = await supabase
        .from('profiles') // Tabelle "profiles" in der Datenbank
        .select('name, surname') // Nur Name und Nachname abrufen
        .eq('id', this.user.id) // Benutzer-ID als Filter
        .single(); // Nur ein Datensatz erwartet

      if (!profileError) {
        this.profile = profileData;
      } else {
        console.error('Fehler beim Abrufen der Profildaten:', profileError.message);
      }
    }

    // Fahrten abrufen
    let { data: rides, error: ridesError } = await supabase
      .from('rides') // Tabelle "rides" in der Datenbank
      .select('*'); // Alle Spalten abrufen

    if (!ridesError) {
      // Nur Fahrten, an denen der Benutzer teilnimmt, filtern
      const allRides = rides.filter((ride) => {
        try {
          const participants = Array.isArray(ride.participants) ? ride.participants : [];
          return participants.includes(this.user.id); // Benutzer-ID in der Teilnehmerliste
        } catch (err) {
          console.error(`Fehler beim Verarbeiten der Teilnehmerliste für Fahrt ${ride.id}:`, err.message);
          return false;
        }
      });

      // Berechnung von eingespartem CO₂ für jede Fahrt
      const processedRides = allRides.map((ride) => ({
        ...ride,
        co2Saved: ride.available_seats > 0
          ? parseFloat(
            (140 * haversineDistance(ride.start_point.coordinates, ride.end_point.coordinates)) -
            ((140 * haversineDistance(ride.start_point.coordinates, ride.end_point.coordinates)) /
              ride.participants.length)
          ).toFixed(1)
          : 0,
      }));

      const currentDate = new Date();

      // Trennen in anstehende und vergangene Fahrten
      this.upcomingRides = processedRides.filter((ride) => {
        const rideDate = new Date(`${ride.ride_date}T${ride.ride_time}`);
        return rideDate >= currentDate; // Anstehende Fahrten
      });

      this.pastRides = processedRides.filter((ride) => {
        const rideDate = new Date(`${ride.ride_date}T${ride.ride_time}`);
        return rideDate < currentDate; // Vergangene Fahrten
      });
    } else {
      console.error('Fehler beim Abrufen der Fahrten:', ridesError.message);
    }
  },
  methods: {
    /**
     * Loggt den Benutzer aus.
     * 1. Meldet den Benutzer von Supabase ab.
     * 2. Leitet den Benutzer zur Login-Seite weiter.
     */
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Fehler beim Abmelden: ' + error.message);
      } else {
        this.user = null; // Benutzer aus dem lokalen Zustand entfernen
        this.$router.push('/login'); // Zur Login-Seite navigieren
      }
    },

    /**
     * Sortiert eine Tabelle basierend auf der angegebenen Spalte.
     * 1. Wenn dieselbe Spalte erneut geklickt wird, wird die Sortierrichtung umgekehrt.
     * 2. Sortiert die Tabelle entweder auf- oder absteigend.
     * @param {string} column - Der Name der zu sortierenden Spalte.
     * @param {Array} table - Die Tabelle, die sortiert werden soll (z. B. upcomingRides).
     */
    sortTable(column, table) {
      // Überprüfen, ob die gleiche Spalte erneut sortiert wird
      if (this.currentSort === column) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = column; // Neue Spalte setzen
        this.currentSortDir = 'asc'; // Standardmäßig aufsteigend sortieren
      }

      // Sortierlogik anwenden
      table.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        // Für Datums- und Zeitspalten in Date-Objekte umwandeln
        if (column === 'ride_date' || column === 'ride_time') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Sortierlogik
        if (aValue < bValue) {
          return this.currentSortDir === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.currentSortDir === 'asc' ? 1 : -1;
        }
        return 0; // Gleichstand
      });
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/ProfilePage.css';
</style>