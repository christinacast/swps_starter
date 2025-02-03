<template>
  <div class="map-page">
    <h2>Hier kannst du deine Fahrten auf der Karte einsehen</h2>
    <div class="map-container">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'; // Leaflet.js importieren
import "leaflet/dist/leaflet.css";

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
    // Geodaten aus URL-Parametern holen
    const urlParams = new URLSearchParams(this.$route.query);
    this.startLocation = urlParams.get("start")
      ? urlParams.get("start").split(",").map(parseFloat).reverse()
      : null;
    this.endLocation = urlParams.get("end")
      ? urlParams.get("end").split(",").map(parseFloat).reverse()
      : null;

    console.log("Parsed startLocation:", this.startLocation);
    console.log("Parsed endLocation:", this.endLocation);

    this.initMap();
  },
  methods: {
    initMap() {
      // Falls keine Start- und Endpunkte vorhanden sind, Standard-Position nutzen
      const center = this.startLocation && this.endLocation ? this.startLocation : this.defaultLocation;
      this.map = L.map("map").setView(center, 13);

      // OpenStreetMap-Tiles hinzufügen
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Falls Start- und Endpunkte vorhanden sind, Marker & Linie setzen
      if (this.startLocation && this.endLocation) {
        const startMarker = L.marker(this.startLocation).addTo(this.map);
        const endMarker = L.marker(this.endLocation).addTo(this.map);

        console.log(startMarker, endMarker);

        // Linie zwischen den Punkten zeichnen
        const line = L.polyline([this.startLocation, this.endLocation], { color: "blue" }).addTo(this.map);

        // Karte auf Linie fokussieren
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