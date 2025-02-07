/**
 * Berechnet die Haversine-Distanz zwischen zwei Koordinatenpaaren.
 * Diese Funktion wird genutzt, um die Entfernung zwischen zwei geografischen Punkten zu berechnen,
 * beispielsweise für die Berechnung von eingespartem CO2 in der ProfilePage.
 *
 * @param {Array<number>} coords1 - [longitude, latitude] des ersten Punktes.
 * @param {Array<number>} coords2 - [longitude, latitude] des zweiten Punktes.
 * @returns {number} - Die Distanz zwischen den Punkten in Kilometern.
 */
export function haversineDistance(coords1, coords2) {
  /**
   * Konvertiert Grad in Bogenmaß.
   * @param {number} deg - Winkel in Grad.
   * @returns {number} - Winkel in Bogenmaß.
   */
  const toRadians = (deg) => (deg * Math.PI) / 180;

  // Extrahiere die Koordinatenpaare
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Radius der Erde in Kilometern

  // Konvertiere Breiten- und Längengrade in Bogenmaß
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  // Haversine-Formel zur Distanzberechnung
  const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distanz in Kilometern
}

/*
Wichtige Hinweise:
1. Diese Funktion wird in der ProfilePage verwendet, um den CO2-Einsparungswert zu berechnen, 
 basierend auf den zurückgelegten Entfernungen.
2. Eingabeformate:
 - coords1 und coords2 müssen als Arrays im Format [longitude, latitude] übergeben werden.
3. Die Berechnung basiert auf der Haversine-Formel, die die Erdkrümmung berücksichtigt.

Verweise:
- ProfilePage.vue: Implementierung der CO2-Berechnung, die diese Funktion verwendet.
- Weitere Informationen zur Haversine-Formel: https://en.wikipedia.org/wiki/Haversine_formula
*/