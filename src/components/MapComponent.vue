<template>
  <div>
    <h1>Hallo, {{ userName }}!</h1>
    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>

<script>
import L from 'leaflet'; // Importiert die Leaflet-Bibliothek für Karten
import 'leaflet/dist/leaflet.css'; // Standard-Stile für Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'; // Standard-Icon für Marker
import markerShadow from 'leaflet/dist/images/marker-shadow.png'; // Schatten-Icon für Marker

// Fix für das Problem mit den Standard-Marker-Icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  name: "MapComponent", // Name der Komponente
  props: {
    /**
     * @prop {String} userName - Der Name des Benutzers, der in der Begrüßung angezeigt wird.
     * @required
     */
    userName: {
      type: String,
      required: true,
    },
    /**
     * @prop {String} userPassword - Das Passwort des Benutzers (wird hier nur zu Demonstrationszwecken genutzt).
     * @required
     */
    userPassword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      map: null, // Instanz der Leaflet-Karte
      /**
       * @property {Array} route - Enthält die Koordinaten für die Route, die auf der Karte angezeigt wird.
       * Beispielkoordinaten für eine einfache Route:
       * [ [Breitengrad, Längengrad], ... ]
       */
      route: [
        [49.9427, 11.5760], // Beispielkoordinaten
        [49.9527, 11.5860], // Beispielkoordinaten
        [49.9627, 11.5960], // Beispielkoordinaten
      ],
    };
  },
  async mounted() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente in den DOM eingefügt wurde.
     * - Initialisiert die Leaflet-Karte.
     * - Fügt die Route zur Karte hinzu.
     */
    const mapContainer = document.getElementById('map'); // Zugriff auf den Karten-Container
    if (mapContainer && this.map) {
      mapContainer.innerHTML = ''; // Löscht den Inhalt des Map-Containers, falls eine Karte existiert
    }

    // Initialisierung der Leaflet-Karte
    this.map = L.map('map').setView([49.9427, 11.5760], 13); // Zentrum und Zoomstufe der Karte

    // Hinzufügen der OpenStreetMap-Tile-Layer zur Karte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors', // Attribution für OpenStreetMap
    }).addTo(this.map);

    // Aufruf der Methode, um die Route hinzuzufügen
    this.addRoute();
  },
  beforeUnmount() {
    /**
     * Lifecycle-Hook: Wird ausgeführt, bevor die Komponente zerstört wird.
     * - Entfernt die Leaflet-Karte aus dem DOM, um Speicherlecks zu vermeiden.
     */
    if (this.map) {
      this.map.remove(); // Entfernt die Karte und alle zugehörigen Ressourcen
    }
  },
  methods: {
    /**
     * Fügt die Route zur Leaflet-Karte hinzu.
     * - Zeichnet eine Polyline, die die Koordinaten der Route verbindet.
     * - Passt den Kartenzoom so an, dass die gesamte Route sichtbar ist.
     */
    addRoute() {
      // Erstellen und Hinzufügen der Polyline zur Karte
      const polyline = L.polyline(this.route, {
        color: 'blue', // Farbe der Route
        weight: 4, // Linienbreite
        opacity: 0.7, // Transparenz
      }).addTo(this.map);

      // Automatische Anpassung des Kartenzoom, damit die gesamte Route sichtbar ist
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
