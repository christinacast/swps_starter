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
  name: "SearchComponent", // Name der Komponente, wichtig für Debugging und Wiederverwendbarkeit

  data() {
    return {
      // Hauptfilter, die in der Suchleiste angezeigt werden
      filters: {
        date: "", // Filter: Datum ab dem gesucht wird
        status: "", // Filter: Status der Fahrt (z. B. "Offen für Mitfahrer")
        start: "", // Filter: Abreiseort
        end: "", // Filter: Zielort
      },
      showAdvancedFilter: false, // Steuert die Sichtbarkeit der erweiterten Filteroptionen
      // Erweiterte Filter für präzisere Suchoptionen
      advancedFilters: {
        exactDate: "", // Erweiterter Filter: Exaktes Datum
        minSeats: "", // Erweiterter Filter: Mindestanzahl verfügbarer Plätze
        stopover: "", // Erweiterter Filter: Zwischenziel
      },
    };
  },

  methods: {
    /**
     * Setzt alle Filter (inkl. Haupt- und erweiterte Filter) zurück.
     * - Stellt sicher, dass die Suchergebnisse auf alle Fahrten zurückgesetzt werden.
     */
    clearFilters() {
      this.filters = {
        date: "", // Setzt das Datumsfeld zurück
        status: "", // Setzt den Status-Filter zurück
        start: "", // Setzt den Startort zurück
        end: "", // Setzt den Zielort zurück
      };

      this.advancedFilters = {
        exactDate: "", // Setzt den exakten Datumsfilter zurück
        minSeats: "", // Setzt den Mindestplätze-Filter zurück
        stopover: "", // Setzt den Zwischenziel-Filter zurück
      };

      console.log("Filter wurden zurückgesetzt."); // Debugging-Hinweis
    },

    /**
     * Schaltet die Anzeige der erweiterten Filteroptionen um.
     * - Zeigt oder verbirgt die zusätzlichen Filtereingaben.
     */
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter; // Sichtbarkeit des erweiterten Filters umschalten
      console.log(
        `Erweiterte Filter ${this.showAdvancedFilter ? "aktiviert" : "deaktiviert"}.`
      ); // Debugging-Hinweis
    },

    /**
     * Wendet die Filter auf die Suchergebnisse an und navigiert zur Seite mit allen Fahrten.
     * - Erstellt die Query-Parameter basierend auf den aktiven Filtern.
     * - Navigiert zur `ViewAllTrips`-Seite mit den ausgewählten Filtern.
     */
    applyFilters() {
      // Erstellen der Query-Parameter basierend auf den aktiven Filtern
      const queryParams = {
        date: this.filters.date || undefined, // Datum, falls ausgewählt
        status: this.filters.status || undefined, // Status, falls ausgewählt
        start: this.filters.start || undefined, // Startort, falls angegeben
        end: this.filters.end || undefined, // Zielort, falls angegeben
        exactDate: this.advancedFilters.exactDate || undefined, // Exaktes Datum, falls angegeben
        minSeats: this.advancedFilters.minSeats || undefined, // Mindestanzahl an Sitzen, falls angegeben
        stopover: this.advancedFilters.stopover || undefined, // Zwischenziel, falls angegeben
      };

      // Entfernt alle Query-Parameter, die undefined sind
      const query = Object.fromEntries(
        Object.entries(queryParams).filter(([, v]) => v !== undefined)
      );

      console.log("Angewandte Filter:", query); // Debugging: Zeigt die angewandten Filter

      // Navigiert zur `ViewAllTrips`-Seite und übergibt die Filter als Query-Parameter
      this.$router.push({ name: "ViewAllTrips", query });
    },
  },
};
</script>


<style scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
@import '@/assets/css/components/SearchComponent.css';
</style>
