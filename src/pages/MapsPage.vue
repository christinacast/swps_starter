<template>
  <div id="map-container">
    <div id="map"></div>
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
    };
  },
  mounted() {
    // Geodaten aus URL-Parametern holen
    const urlParams = new URLSearchParams(this.$route.query);
    this.startLocation = urlParams.get("start")?.split(",").map(parseFloat).reverse();
    this.endLocation = urlParams.get("end")?.split(",").map(parseFloat).reverse();

    console.log("Parsed startLocation:", this.startLocation);
    console.log("Parsed endLocation:", this.endLocation);

    this.initMap();
  },
  methods: {
    initMap() {
      // Karte initialisieren
      this.map = L.map("map").setView(this.startLocation, 13);

      // OpenStreetMap-Tiles hinzufügen
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Marker für Start- und Endpunkte setzen
      const startMarker = L.marker(this.startLocation).addTo(this.map);
      const endMarker = L.marker(this.endLocation).addTo(this.map);

      console.log(startMarker, endMarker)

      // Linie zwischen den Punkten zeichnen
      const line = L.polyline([this.startLocation, this.endLocation], { color: "blue" }).addTo(this.map);

      // Karte auf Linie fokussieren
      this.map.fitBounds(line.getBounds());
      this.map.invalidateSize();
    },
  },
};
</script>

<style scoped>
#map-container {
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}
</style>