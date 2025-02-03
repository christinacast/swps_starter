<template>
  <div class="map-page">
    <h2>Hier kannst du deine Fahrten auf der Karte einsehen</h2>
    <div class="map-container">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import custom images for markers (make sure to have these in your assets folder)
import startIconImage from '@/../public/images/start-marker-64.png';
import endIconImage from '@/../public/images/end-marker-64.png';

export default {
  name: "MapViewPage",
  data() {
    return {
      map: null,
      startLocation: null,
      endLocation: null,
      defaultLocation: [49.9276, 11.5873], // Universität Bayreuth
    };
  },
  mounted() {
    // Parse coordinates from URL parameters
    const urlParams = new URLSearchParams(this.$route.query);
    this.startLocation = urlParams.get("start")
      ? urlParams.get("start").split(",").map(parseFloat).reverse()
      : null;
    this.endLocation = urlParams.get("end")
      ? urlParams.get("end").split(",").map(parseFloat).reverse()
      : null;

    this.initMap();
  },
  methods: {
    initMap() {
      const center = this.startLocation && this.endLocation ? this.startLocation : this.defaultLocation;
      this.map = L.map('map').setView(center, 13);

      // Add OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Define custom icons
      const startIcon = L.icon({
        iconUrl: startIconImage,
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Anchor point of the icon
        popupAnchor: [0, -30], // Point where the popup opens
      });

      const endIcon = L.icon({
        iconUrl: endIconImage,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -30],
      });

      // Add custom markers if start and end locations exist
      if (this.startLocation && this.endLocation) {
        const startMarker = L.marker(this.startLocation, { icon: startIcon }).addTo(this.map)
          .bindPopup('Startpunkt');
        const endMarker = L.marker(this.endLocation, { icon: endIcon }).addTo(this.map)
          .bindPopup('Endpunkt');

        console.log(startMarker, endMarker)

        // Draw a line between the points
        const line = L.polyline([this.startLocation, this.endLocation], { color: 'blue' }).addTo(this.map);

        // Adjust the map view to fit the line
        this.map.fitBounds(line.getBounds());
      }
    },
  },
};
</script>

<style scoped>
/* Container for the entire page */
.map-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  font-family: sans-serif;
}

/* A nice heading style to show a page title */
.map-page h2 {
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Container that holds the map; adjust width/height as desired */
.map-container {
  width: 80%;            /* you can fine-tune this */
  height: 60vh;          /* or this */
  margin: 20px auto;     /* centers it within .map-page */
  border: 2px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;      /* ensures the map doesn't overflow the rounded corners */
}

/* The map div must fill its parent’s size */
#map {
  width: 100%;
  height: 100%;
}
</style>