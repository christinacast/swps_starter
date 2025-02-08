<template>
  <div class="fahrten-container">
    <!-- Filter Bar -->
    <div class="filter-bar">
      <input type="date" v-model="filters.date" placeholder="Datum auswählen" class="filter-input"
        title="Filtere ab einem spezifischen Datum." />
      <select v-model="filters.status" class="filter-select"
        title="Wähle den Status der Fahrt: Offen, Suche Fahrer oder andere.">
        <option value="">Jeglicher Status</option>
        <option value="Offen für Mitfahrer">Offen für Mitfahrer</option>
        <option value="Suche Fahrer">Suche Fahrer</option>
      </select>
      <input type="text" v-model="filters.start" placeholder="Abreiseort" class="filter-input"
        title="Gib den Abreiseort ein, um die Suche einzugrenzen." />
      <input type="text" v-model="filters.end" placeholder="Zielort" class="filter-input"
        title="Gib den Zielort ein, um die Suche einzugrenzen." />
      <button @click="applyFilters" class="filter-button" title="Klicke, um die Filter anzuwenden.">Filtern</button>
      <button @click="clearFilters" class="filter-clear" title="Setze alle Filter zurück.">Zurücksetzen</button>
      <button @click="toggleAdvancedFilter" class="filter-advanced" title="Zeige weitere Filteroptionen an.">
        Erweiterter Filter
      </button>
    </div>

    <!-- Erweiterte Filter-Leiste -->
    <div v-if="showAdvancedFilter" class="advanced-filter-bar">
      <input type="date" v-model="advancedFilters.exactDate" placeholder="Exaktes Datum" class="filter-input"
        title="Hier kanst du nach einem exakten Datum filtern" />
      <input type="number" v-model="advancedFilters.minSeats" placeholder="Min. Plätze" class="filter-input" />
      <input type="text" v-model="advancedFilters.stopover" placeholder="Zwischenziel" class="filter-input" />
      <p>Zum sortieren der Tabelle, einfach auf den jeweiligen Header der Spalte klicken</p>
    </div>

    <!-- Table Section -->
    <div class="fahrten-section">
      <h2 class="fahrten-heading">Alle anstehenden Fahrten</h2>
      <p class="table-sort-info">
        Zum Sortieren der Tabelle, einfach auf den jeweiligen Header der Spalte klicken
      </p>
      <table class="fahrten-table">
        <thead>
          <tr>
            <th @click="sortTable('ride_date')">Datum</th>
            <th @click="sortTable('ride_time')">Uhrzeit</th>
            <th @click="sortTable('start_string')">Abreiseort</th>
            <th @click="sortTable('end_string')">Zielort</th>
            <th @click="sortTable('available_seats')">Plätze</th>
            <th>Fahrt auf der Karte einsehen</th>
            <th>Ich möchte mit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ride in filteredRides" :key="ride.id">
            <td>{{ ride.ride_date }}</td>
            <td>{{ ride.ride_time }}</td>
            <td>{{ ride.start_string }}</td>
            <td>{{ ride.end_string }}</td>
            <td>{{ ride.available_seats }}</td>
            <td> <router-link :to="`/maps?start=${ride.start_point.coordinates}&end=${ride.end_point.coordinates}`">
                Karte
              </router-link></td>
            <td v-if="!ride.participants.includes(currentUserId)"> <button class="join-button"
                @click="joinRide(ride.ride_id)">Beitreten</button> </td>
            <td v-else>Du fährst bereits mit</td> <!-- Leeres Feld, wenn der Nutzer bereits teilnimmt -->


          </tr>
        </tbody>
      </table>
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
import { supabase } from '@/services/supabase';

export default {
  name: "ViewAllTripsPage", // Name der Komponente, wichtig für Debugging und Router-Referenzen

  data() {
    return {
      allRides: [], // Enthält alle Fahrten, die aus der Datenbank geladen werden
      currentUserId: null, // Speichert die ID des aktuell eingeloggten Benutzers
      filters: {
        date: "", // Filter: Suche nach Fahrten ab einem bestimmten Datum
        status: "", // Filter: Status der Fahrt (z. B. "Offen für Mitfahrer")
        start: "", // Filter: Abreiseort
        end: "", // Filter: Zielort
      },
      filteredRides: [], // Enthält die Fahrten, die nach den aktiven Filtern gefiltert werden
      showAdvancedFilter: false, // Steuert, ob erweiterte Filteroptionen angezeigt werden
      advancedFilters: {
        exactDate: "", // Erweiterter Filter: Exaktes Datum
        minSeats: "", // Erweiterter Filter: Mindestanzahl verfügbarer Plätze
        stopover: "", // Erweiterter Filter: Zwischenziel
      },
    };
  },

  async mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente in den DOM eingefügt wurde.
     * 1. Lädt die aktuelle Benutzer-ID aus der Authentifizierung.
     * 2. Ruft alle verfügbaren Fahrten aus der Datenbank ab.
     * 3. Wendet Filter basierend auf URL-Parametern an, falls vorhanden.
     */
    try {
      // Benutzer-ID aus der Supabase-Authentifizierung abrufen
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        this.currentUserId = user.id;
      }

      // Abrufen aller Fahrten aus der Datenbank
      const { data: rides, error } = await supabase
        .from('rides') // Tabelle "rides" in der Supabase-Datenbank
        .select("*"); // Abruf aller Spalten

      if (error) {
        console.error("Fehler beim Abrufen der Fahrten:", error.message);
        return;
      }

      this.allRides = rides; // Speichert alle abgerufenen Fahrten
      this.filteredRides = rides; // Standardmäßig: Keine Filter angewendet, alle Fahrten anzeigen

      // Überprüfen, ob URL-Parameter vorhanden sind, und Filter anwenden
      if (Object.keys(this.$route.query).length > 0) {
        this.applyFiltersWhenRedirect(this.$route.query);
      }
    } catch (err) {
      console.error("Ein unerwarteter Fehler ist aufgetreten:", err.message);
    }
  },

  methods: {
    /**
     * Sortiert die Tabelle basierend auf einer angegebenen Spalte.
     * @param {string} column - Name der Spalte, nach der sortiert werden soll.
     */
    sortTable(column) {
      // Überprüfung, ob dieselbe Spalte erneut sortiert wird
      if (this.currentSort === column) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'; // Sortierrichtung umkehren
      } else {
        this.currentSort = column; // Neue Spalte festlegen
        this.currentSortDir = 'asc'; // Standardmäßig aufsteigend sortieren
      }

      // Sortierlogik anwenden
      this.filteredRides.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        // Sonderfall: Datum und Zeit in Date-Objekte umwandeln
        if (column === 'ride_date' || column === 'ride_time') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return this.currentSortDir === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.currentSortDir === 'asc' ? 1 : -1;
        }
        return 0; // Gleichstand
      });
    },

    /**
     * Fügt den aktuellen Benutzer zu einer Fahrt hinzu.
     * @param {number} rideId - ID der Fahrt, der der Benutzer beitreten möchte.
     */
    async joinRide(rideId) {
      try {
        // Benutzer-ID aus der Supabase-Authentifizierung abrufen
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          alert("Bitte loggen Sie sich ein, um einer Fahrt beizutreten.");
          return;
        }

        const userId = user.id;

        // Abrufen der Teilnehmerliste der spezifischen Fahrt
        const { data: ride, error } = await supabase
          .from('rides')
          .select('participants') // Nur die Spalte "participants" abrufen
          .eq('ride_id', rideId) // Filter: Fahrt-ID
          .single();

        if (error || !ride) {
          alert("Fehler beim Abrufen der Fahrt.");
          return;
        }

        let participants = Array.isArray(ride.participants)
          ? ride.participants
          : [];

        if (participants.includes(userId)) {
          alert("Du bist bereits Teilnehmer dieser Fahrt.");
          return;
        }

        // Benutzer der Teilnehmerliste hinzufügen
        participants.push(userId);

        // Teilnehmerliste in der Datenbank aktualisieren und userID in neustes_mitglies schreiben um Trigger in Supabase auszulösen, dass automatisch einen Termin erstellt
        const { error: updateError } = await supabase
          .from('rides')
          .update({ participants, neustes_mitglied: this.currentUserId  })
          .eq('ride_id', rideId);

        if (updateError) {
          alert("Fehler beim Beitreten der Fahrt.");
        } else {
          alert("Du hast erfolgreich an der Fahrt teilgenommen!");
          this.filteredRides = this.filteredRides.map(ride =>
            ride.ride_id === rideId ? { ...ride, participants } : ride
          );
        }
      } catch (err) {
        console.error("Ein unerwarteter Fehler ist aufgetreten:", err.message);
      }
    },

    /**
     * Setzt alle aktiven Filter zurück und zeigt alle Fahrten an.
     */
    clearFilters() {
      this.filters = {
        date: "",
        status: "",
        start: "",
        end: "",
      };
      this.filteredRides = [...this.allRides]; // Zeigt alle Fahrten ohne Filter an
    },

    /**
     * Schaltet die Anzeige erweiterter Filteroptionen um.
     */
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter; // Sichtbarkeit umschalten
    },

    /**
     * Wendet die aktuellen Filter auf die Fahrtenliste an.
     */
    applyFilters() {
      this.filteredRides = this.allRides.filter((ride) => {
        return (
          (!this.filters.date || ride.ride_date >= this.filters.date) &&
          (!this.filters.status || ride.status === this.filters.status) &&
          (!this.filters.start || ride.start_string.includes(this.filters.start)) &&
          (!this.filters.end || ride.end_string.includes(this.filters.end)) &&
          (!this.advancedFilters.exactDate || ride.ride_date === this.advancedFilters.exactDate) &&
          (!this.advancedFilters.minSeats || ride.available_seats >= this.advancedFilters.minSeats) &&
          (!this.advancedFilters.stopover || ride.stopovers?.includes(this.advancedFilters.stopover))
        );
      });
    },

    /**
     * Wendet Filter basierend auf den übergebenen URL-Parametern an.
     * @param {Object} query - URL-Parameter mit den Filterwerten.
     */
    applyFiltersWhenRedirect(query) {
      this.filters = {
        date: query.date || "",
        status: query.status || "",
        start: query.start || "",
        end: query.end || "",
      };

      this.advancedFilters = {
        exactDate: query.exactDate || "",
        minSeats: query.minSeats || "",
        stopover: query.stopover || "",
      };

      this.applyFilters(); // Filter anwenden
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/ViewAllTripsPage.css';
</style>