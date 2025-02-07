<template>
  <div class="map-page">
    <h2>Hier kannst du deine Fahrten auf der Karte einsehen</h2>
    <div class="map-container">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'; // Import der Leaflet-Bibliothek für die Kartenanzeige
import 'leaflet/dist/leaflet.css'; // Import der Standard-CSS für Leaflet

// Import benutzerdefinierter Marker-Icons (diese müssen in den Assets-Ordner hochgeladen werden)
import startIconImage from '@/../public/images/start-marker-64.png';
import endIconImage from '@/../public/images/end-marker-64.png';

export default {
  name: "MapViewPage", // Name der Komponente
  data() {
    return {
      map: null, // Leaflet-Instanz für die Karte
      startLocation: null, // Koordinaten des Startpunkts [Breite, Länge]
      endLocation: null, // Koordinaten des Endpunkts [Breite, Länge]
      defaultLocation: [49.9276, 11.5873], // Standardkoordinaten (Universität Bayreuth)
    };
  },
  mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente gerendert wurde.
     * Aktionen:
     * 1. URL-Parameter parsen, um Start- und Endkoordinaten abzurufen.
     * 2. Initialisierung der Leaflet-Karte.
     */
    const urlParams = new URLSearchParams(this.$route.query); // Abrufen der URL-Parameter
    this.startLocation = urlParams.get("start")
      ? urlParams.get("start").split(",").map(parseFloat).reverse() // Umwandlung in [Breite, Länge]
      : null;
    this.endLocation = urlParams.get("end")
      ? urlParams.get("end").split(",").map(parseFloat).reverse()
      : null;

    // Karte initialisieren
    this.initMap();
  },
  methods: {
    /**
     * Initialisiert die Leaflet-Karte und fügt Marker und Linien hinzu, falls verfügbar.
     */
    initMap() {
      // Karte zentrieren: Standardstandort oder Startkoordinaten, falls vorhanden
      const center = this.startLocation && this.endLocation ? this.startLocation : this.defaultLocation;

      // Leaflet-Karte erstellen und initialisieren
      this.map = L.map('map').setView(center, 13); // Zoomlevel 13 als Standard

      // Hinzufügen einer Tile-Layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // Maximale Zoomstufe
        attribution: '© OpenStreetMap contributors', // Copyright-Hinweis
      }).addTo(this.map);

      // Benutzerdefinierte Icons für Start- und Endpunkte erstellen
      const startIcon = L.icon({
        iconUrl: startIconImage, // URL des Icons für den Startpunkt
        iconSize: [25, 41], // Größe des Icons
        iconAnchor: [12, 41], // Ankerpunkt (Boden der Markierung)
        popupAnchor: [0, -30], // Punkt, an dem das Popup öffnet
      });

      const endIcon = L.icon({
        iconUrl: endIconImage, // URL des Icons für den Endpunkt
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -30],
      });

      // Marker und Linien hinzufügen, falls Start- und Endpunkte definiert sind
      if (this.startLocation && this.endLocation) {
        // Marker für den Startpunkt hinzufügen
        const startMarker = L.marker(this.startLocation, { icon: startIcon })
          .addTo(this.map)
          .bindPopup('Startpunkt'); // Popup für den Startpunkt

        // Marker für den Endpunkt hinzufügen
        const endMarker = L.marker(this.endLocation, { icon: endIcon })
          .addTo(this.map)
          .bindPopup('Endpunkt'); // Popup für den Endpunkt

        // Linie zwischen Start- und Endpunkt zeichnen
        const line = L.polyline([this.startLocation, this.endLocation], { color: 'blue' }).addTo(this.map);

        // Karte so anpassen, dass die Linie vollständig sichtbar ist
        this.map.fitBounds(line.getBounds());

        // Debugging: Marker in der Konsole ausgeben (kann entfernt werden)
        console.log("Startpunkt:", startMarker, "Endpunkt:", endMarker);
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/MapsPage.css';
</style>