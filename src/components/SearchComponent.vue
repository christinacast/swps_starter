<template>
  <div class="search-container">
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
      <button @click="applyFilters" class="filter-button" title="Klicke, um die Filter anzuwenden.">Suchen</button>
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
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      filters: {
        date: "",
        status: "",
        start: "",
        end: "",
      },
      showAdvancedFilter: false,
      advancedFilters: {
        exactDate: "",
        minSeats: "",
        stopover: "",
      },
    };
  },
  methods: {
    clearFilters() {
      this.filters = {
        date: "",
        status: "",
        start: "",
        end: "",
      };
      this.filteredRides = [...this.allRides];
    },
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    applyFilters() {
      // Build query parameters based on filters
      const queryParams = {
        date: this.filters.date || undefined,
        status: this.filters.status || undefined,
        start: this.filters.start || undefined,
        end: this.filters.end || undefined,
        exactDate: this.advancedFilters.exactDate || undefined,
        minSeats: this.advancedFilters.minSeats || undefined,
        stopover: this.advancedFilters.stopover || undefined,
      };

      // Remove undefined query parameters
      const query = Object.fromEntries(Object.entries(queryParams).filter(([, v]) => v !== undefined));

      console.log(`/view-all-Trips/${query}`)

      // Navigate to another page with query parameters
      this.$router.push({ name: "ViewAllTrips", query });
    }
  }
}

</script>


<style scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
@import '@/assets/css/components/SearchComponent.css';
</style>
