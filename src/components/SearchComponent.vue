<template>
  <div class="search-container">
    <!-- Abfahrtsort -->
    <input 
      type="text" 
      id="departure-input" 
      placeholder="Abfahrtsort..." 
      v-model="departure"
    />
    
    <!-- Zielort -->
    <input 
      type="text" 
      id="destination-input" 
      placeholder="Zielort..." 
      v-model="destination"
    />
    
    <!-- Such-Button -->
    <button type="button" id="search-button" @click="search">
      Search
    </button>
    
    <!-- Filter-Button -->
    <button type="menu" id="filter-button">
      <img src="/images/icons8-filter-50.png" alt="filter" />
    </button>
  </div>
</template>

  
<script>
export default {
  name: 'SearchComponent',
  data() {
    return {
      departure: '', // Abfahrtsort
      destination: '', // Zielort
    };
  },
  methods: {
    search() {
      // Überprüfe, ob beide Felder ausgefüllt sind
      if (!this.departure || !this.destination) {
        alert('Bitte füllen Sie sowohl Abfahrts- als auch Zielort aus.');
        return;
      }
      // Beispiel: Anfrage an eine API senden
      console.log(`Suche nach Verbindungen von ${this.departure} nach ${this.destination}`);
      // Weiteres Verhalten implementieren...
    },
  },
};
</script>

  
  <style scoped>
  @import '@/assets/css/base.css';
  @import '@/assets/css/layout.css';
  @import '@/assets/css/components/search-container.css';
  </style>