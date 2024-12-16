<template>
  <div>
    <h1>Route von {{ departure }} nach {{ destination }}</h1>
    <!-- Karte anzeigen -->
    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { nextTick } from 'vue';
import { createClient } from '@supabase/supabase-js';
import 'leaflet-routing-machine'; // Importiere das Routing-Plugin, sodass die Route zwischen 2 Orten berechnet wird

export default {
  props: {
    departure: {
      type: String,
      required: true, // Abfahrtsort als Prop
    },
    destination: {
      type: String,
      required: true, // Zielort als Prop
    },
  },
  data() {
    return {
      map: null,
      locations: [], // Standortdaten speichern
    };
  },
  async mounted() {
    await nextTick();

    // Überprüfen, ob die Karte bereits existiert und entfernen, falls ja
    if (this.map) {
      this.map.remove();
    }

    // Initialisiere die Karte mit einem Standardort
    this.map = L.map('map').setView([49.9427, 11.5760], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Lade die Marker-Daten
    await this.loadMarkers();

    // Füge die Route hinzu
    this.addRoute();
  },
  methods: {
    // Lädt alle Orte aus Supabase
    async loadMarkers() {
      const supabaseUrl = 'https://ldpsaujnvjyjtflecpgb.supabase.co';
      const supabaseKey = this.userPassword + 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHNhdWpudmp5anRmbGVjcGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NTc4NDcsImV4cCI6MjA0MTUzMzg0N30.56c2P7OPQyNd1flTA4vlyZ7Hn_8sFAWG8ThW6Q341DI';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: locations, error } = await supabase
        .from('orte')
        .select('ort_name, x_koordinate, y_koordinate, link');

      if (error) {
        console.error('Error fetching data from Supabase:', error);
        return;
      }

      if (!locations || locations.length === 0) {
        console.warn('No data found in the "orte" table');
        return;
      }

      this.locations = locations; // Speicher die Orte in der Komponente

      // Füge Marker für alle Orte hinzu
      locations.forEach((location) => {
        const { ort_name, x_koordinate, y_koordinate, link } = location;

        if (x_koordinate && y_koordinate) {
          const popupContent = `
            <b>${ort_name}</b><br>
            <a href="${link}" target="_blank">Website</a>
          `;

          L.marker([y_koordinate, x_koordinate])
            .addTo(this.map)
            .bindPopup(popupContent);
        } else {
          console.warn(`Invalid coordinates for ${ort_name}`);
        }
      });

      // Füge Marker für Abfahrts- und Zielort hinzu
      this.addDepartureMarker();
      this.addDestinationMarker();
    },

    // Sucht einen Ort in den Locations anhand des Namens
    findLocationByName(name) {
      return this.locations.find(location => location.ort_name.toLowerCase() === name.toLowerCase());
    },

    // Fügt einen Marker für den Abfahrtsort hinzu
    addDepartureMarker() {
      const departureLocation = this.findLocationByName(this.departure);
      if (departureLocation) {
        L.marker([departureLocation.y_koordinate, departureLocation.x_koordinate])
          .addTo(this.map)
          .bindPopup(`<b>${this.departure}</b><br>Abfahrtsort`);
      }
    },

    // Fügt einen Marker für den Zielort hinzu
    addDestinationMarker() {
      const destinationLocation = this.findLocationByName(this.destination);
      if (destinationLocation) {
        L.marker([destinationLocation.y_koordinate, destinationLocation.x_koordinate])
          .addTo(this.map)
          .bindPopup(`<b>${this.destination}</b><br>Zielort`);
      }
    },

    // Fügt eine Route zwischen Abfahrts- und Zielort hinzu
    addRoute() {
      const departureLocation = this.findLocationByName(this.departure);
      const destinationLocation = this.findLocationByName(this.destination);

      if (departureLocation && destinationLocation) {
        // Initialisiere das Routing
        L.Routing.control({
          waypoints: [
            L.latLng(departureLocation.y_koordinate, departureLocation.x_koordinate), // Abfahrtsort
            L.latLng(destinationLocation.y_koordinate, destinationLocation.x_koordinate), // Zielort
          ],
          routeWhileDragging: true,
        }).addTo(this.map);
      } else {
        console.error('Abfahrts- oder Zielort konnte nicht gefunden werden.');
      }
    }
  },
};
</script>

<style scoped>
#map {
  height: 400px;
}
</style>
