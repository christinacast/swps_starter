<template>
  <div>
    <h1>Hallo, {{ userName }}!</h1> <!-- Zeige den Namen des Benutzers an -->
    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { nextTick } from 'vue';
import { createClient } from '@supabase/supabase-js';

export default {
  props: {
    userName: {
      type: String,
      required: true, // Benutzername ist erforderlich
    },
    userPassword: {
      type: String,
      required: true, // Passwort ist erforderlich
    },
  },
  data() {
    return {
      map: null,
    };
  },
  async mounted() {
    // Warten, bis das DOM vollständig gerendert ist
    await nextTick();

    // Überprüfen, ob die Karte bereits existiert und entfernen, falls ja
    if (this.map) {
      this.map.remove();
    }

    // Initialisiere die Karte nur, wenn sie noch nicht existiert
    this.map = L.map('map').setView([49.9427, 11.5760], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    await this.loadMarkers();
  },
  methods: {
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
    }
  },
};
</script>

<style scoped>
#map {
  height: 400px;
}
</style>



