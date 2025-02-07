// geoUtils.js

/**
 * Konvertiert eine Adresse in ein GeoJSON-Format, das für die geografische Verarbeitung verwendet werden kann.
 * Diese Funktion wird im `TripsInserierenFormular.vue` verwendet, um Koordinaten (Latitude, Longitude) aus einer
 * Adresse zu erhalten und diese als GeoJSON-Daten zu speichern.
 *
 * @param {string} address - Die Adresse, die in GeoJSON konvertiert werden soll.
 * @returns {Object} GeoJSON-Objekt mit den Koordinaten und der Adresse.
 * @throws {Error} Falls keine Ergebnisse gefunden wurden oder die Geoapify-API einen Fehler zurückgibt.
 */
export async function convertToGeoJSON(address) {
  // Geoapify API-Schlüssel (wird zur Abfrage verwendet)
  const API_KEY = "385677337d03452faed0d83cada949da";

  // Erstellen der API-Request-URL
  const geoapifyURL = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&format=json&apiKey=${API_KEY}`;

  try {
    // Abrufen der Geodaten von der Geoapify-API
    const response = await fetch(geoapifyURL);

    // Überprüfung auf HTTP-Fehler
    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Überprüfung, ob Ergebnisse vorhanden sind
    if (!data.results || data.results.length === 0) {
      throw new Error("No results found for the given address.");
    }

    // Extrahieren der Koordinaten aus dem ersten Ergebnis
    const { lat, lon } = data.results[0];

    // Rückgabe der GeoJSON-Daten
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat], // GeoJSON benötigt [longitude, latitude]
      },
      properties: {
        address, // Speichert die ursprüngliche Adresse als Eigenschaft
      },
    };
  } catch (error) {
    console.error("Error converting address to GeoJSON:", error);
    throw error;
  }
}

/*
Wichtige Hinweise:
1. Diese Funktion wird im TripsInserierenFormular.vue verwendet, um Adressen in GeoJSON umzuwandeln.
2. Der GeoJSON-Output kann direkt in Karten oder Datenbanken verwendet werden, die geografische Daten unterstützen.
3. Abhängigkeit von der Geoapify-API:
   - Der API_KEY ist für die Nutzung erforderlich. Sensible oder kritische Daten sollten hier nicht verarbeitet werden.
4. Fehlerbehandlung ist integriert, um API- oder Adressfehler nachvollziehbar zu machen.
*/