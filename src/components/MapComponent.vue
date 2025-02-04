<template>
  <div>
    <h1>Hallo, {{ userName }}!</h1>
    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  props: {
    userName: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      route: [
        [49.9427, 11.5760], // Beispielkoordinaten
        [49.9527, 11.5860], // Beispielkoordinaten
        [49.9627, 11.5960], // Beispielkoordinaten
      ], // Beispielroute
    };
  },
  async mounted() {
    const mapContainer = document.getElementById('map');
    if (mapContainer && this.map) {
      mapContainer.innerHTML = ''; // Lösche den Inhalt des Map-Containers
    }

    this.map = L.map('map').setView([49.9427, 11.5760], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.addRoute(); // Route hinzufügen
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    addRoute() {
      // Hier fügst du die Route hinzu (mit einer Polyline)
      const polyline = L.polyline(this.route, {
        color: 'blue',
        weight: 4,
        opacity: 0.7,
      }).addTo(this.map);

      // Zoom auf die Route
      this.map.fitBounds(polyline.getBounds());
    },
  },
};
</script>

<style scoped>
#map {
  height: 400px;
}
</style>
