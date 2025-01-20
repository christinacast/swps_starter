<template>
  <div class="search-container">
    <!-- Abfahrtsort -->
    <div class="search-input-container">
      <input 
        type="text" 
        id="departure-input" 
        placeholder="Abfahrtsort..." 
        v-model="departure" 
        @input="filterSuggestions('departure')" 
      />
      <ul v-if="filteredDepartureSuggestions.length > 0">
        <li 
          v-for="(suggestion, index) in filteredDepartureSuggestions" 
          :key="index"
          @click="selectSuggestion('departure', suggestion)"
        >
          {{ suggestion.text }}
        </li>
      </ul>
    </div>
    
    <!-- Zielort -->
    <div class="search-input-container">
      <input 
        type="text" 
        id="destination-input" 
        placeholder="Zielort..." 
        v-model="destination" 
        @input="filterSuggestions('destination')" 
      />
      <ul v-if="filteredDestinationSuggestions.length > 0">
        <li 
          v-for="(suggestion, index) in filteredDestinationSuggestions" 
          :key="index"
          @click="selectSuggestion('destination', suggestion)"
        >
          {{ suggestion.text }}
        </li>
      </ul>
    </div>
    
    <!-- Such-Button -->
    <button type="button" id="search-button" @click="search">
      Search
    </button>
    
    <!-- Filter-Button -->
    <button type="menu" id="filter-button">
      <img src="/images/filter-icon.png" alt="filter" class="small-icon"/>
    </button>
  </div>
</template>

<script>
import cities from '/public/cities.json'; // Importiere die Städte-JSON-Datei

export default {
  name: 'SearchComponent',
  data() {
    return {
      departure: '', // Abfahrtsort
      destination: '', // Zielort
      allCities: cities, // Alle Städte aus der JSON-Datei
      filteredDepartureSuggestions: [], // Gefilterte Abfahrtsort-Vorschläge
      filteredDestinationSuggestions: [], // Gefilterte Zielort-Vorschläge
    };
  },
  methods: {
    // Filtert die Städte basierend auf der Benutzereingabe
    filterSuggestions(type) {
      const query = type === 'departure' ? this.departure : this.destination;
      const filteredSuggestions = this.allCities.filter(city =>
        city.text.toLowerCase().includes(query.toLowerCase())
      );
      
      if (type === 'departure') {
        this.filteredDepartureSuggestions = filteredSuggestions;
      } else {
        this.filteredDestinationSuggestions = filteredSuggestions;
      }
    },
    // Wählt einen Vorschlag aus und setzt den entsprechenden Wert
    selectSuggestion(type, suggestion) {
      if (type === 'departure') {
        this.departure = suggestion.text;
        this.filteredDepartureSuggestions = []; // Löscht Vorschläge nach Auswahl
      } else {
        this.destination = suggestion.text;
        this.filteredDestinationSuggestions = []; // Löscht Vorschläge nach Auswahl
      }
    },
    // Die Such-Funktion, wenn der Benutzer auf den "Search"-Button klickt
    search() {
      if (!this.departure || !this.destination) {
        alert('Bitte füllen Sie sowohl Abfahrts- als auch Zielort aus.');
        return;
      }
      
      // Weiterleitung zur MapsPage mit den Parametern für Abfahrts- und Zielort
      this.$router.push({
        name: 'MapsPage',
        params: { departure: this.departure, destination: this.destination }
      });
    }
  }
};
</script>


<style scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
@import '@/assets/css/components/search-container.css';

/* Stil für die Dropdown-Vorschläge */

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  border: 1px solid #ccc;
  position: absolute;
  width: 100%;
  z-index: 10; /* Sicherstellen, dass die Liste oben angezeigt wird */
}

li {
  padding: 8px;
  cursor: pointer;
}

li:hover {
  background-color: #f1f1f1;
}

/* Styling für die Such-Eingabefelder */
.search-input-container {
  position: relative;
}
</style>
