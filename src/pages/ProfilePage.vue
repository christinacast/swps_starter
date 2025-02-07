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
import { supabase } from '@/services/supabase.js';
import { haversineDistance } from '@/services/kmDistanceComputation.js';

export default {
  name: 'ProfilePage',
  data() {
    return {
      user: null,
      profile: {},
      upcomingRides: {},
      pastRides: {},
    };
  },
  async mounted() {
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      this.user = authData.user;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('name, surname')
        .eq('id', this.user.id)
        .single();

      if (!error) {
        this.profile = profileData;
      } else {
        console.error('Error fetching profile:', error.message);
      }
    }

    let { data: rides, error } = await supabase
      .from('rides')
      .select("*")

    if (!error) {
      // Fahrten filtern: Nur Fahrten anzeigen, bei denen der Benutzer im participants-Array ist
      const allRides = rides.filter(ride => {
        try {
          const participants = Array.isArray(ride.participants) ? ride.participants : [];
          return participants.includes(this.user.id);
        } catch (err) {
          console.error(`Fehler beim Parsen des participants-Arrays für Fahrt ${ride.ride_id}:`, err);
          return false;
        }
      });

      Object.keys(allRides).forEach((key) => {
        const ride = allRides[key];

        // Add new key-value pairs
        allRides[key] = {
          ...ride,
          co2Saved: ride.available_seats > 0
            ? parseFloat((140 * haversineDistance(ride.start_point.coordinates, ride.end_point.coordinates))
              - ((140 * haversineDistance(ride.start_point.coordinates, ride.end_point.coordinates))
                / ride.participants.length)).toFixed(1)
            : 0,
        };
      });

      const currentDate = new Date();

      // Separate rides into upcoming and past based on date
      this.upcomingRides = allRides.filter((ride) => {
        const rideDate = new Date(`${ride.ride_date}T${ride.ride_time}`);
        return rideDate >= currentDate; // Upcoming rides
      });

      this.pastRides = allRides.filter((ride) => {
        const rideDate = new Date(`${ride.ride_date}T${ride.ride_time}`);
        return rideDate < currentDate; // Past rides
      });
    } else {
      console.error('Error fetching rides:', error.message);
    }

  },
  methods: {
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Error logging out: ' + error.message);
      } else {
        this.user = null;
        this.$router.push('/login');
      }
    },
    sortTable(column, table) {
      // Wenn dieselbe Spalte erneut geklickt wird, Sortierrichtung umkehren
      if (this.currentSort === column) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        // Neue Spalte sortieren, Standard: aufsteigend
        this.currentSort = column;
        this.currentSortDir = 'asc';
      }

      // Sortierlogik anwenden
      table.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        // Für Datum oder Zeit als JavaScript-Date-Objekt umwandeln, wenn notwendig
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