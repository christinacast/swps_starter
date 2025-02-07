/**
 * Sortiert eine Tabelle basierend auf der angegebenen Spalte.
 * Diese Funktion wird in der ViewAllTripsPage und ProfilePage verwendet, um Tabellen
 * dynamisch nach Datum, Alphabet oder anderen Werten zu sortieren.
 *
 * @param {string} column - Der Name der Spalte, nach der sortiert werden soll.
 */
export function sortTable(column) {
  // Wenn dieselbe Spalte erneut ausgewählt wird, wird die Sortierrichtung umgekehrt
  if (this.currentSort === column) {
      this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
  } else {
      // Setzt die neue Spalte als aktuell zu sortierende Spalte, Standard: aufsteigend
      this.currentSort = column;
      this.currentSortDir = 'asc';
  }

  // Führt die Sortierung auf der gefilterten Tabelle durch
  this.filteredRides.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Konvertiert Datum oder Zeit in JavaScript-Date-Objekte für korrekte Sortierung
      if (column === 'ride_date' || column === 'ride_time') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
      }

      // Vergleichslogik basierend auf der Sortierrichtung
      if (aValue < bValue) {
          return this.currentSortDir === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
          return this.currentSortDir === 'asc' ? 1 : -1;
      }
      return 0; // Falls beide Werte gleich sind
  });
}

/*
Wichtige Hinweise:
1. Diese Funktion wird für die dynamische Sortierung von Tabellen verwendet, beispielsweise für Ride-Listen.
2. Die Funktion unterstützt unterschiedliche Datentypen wie Strings, Zahlen und Datumswerte.
3. Die Sortierung basiert auf einer bidirektionalen Logik (aufsteigend/absteigend).

Verwendung:
- `this.filteredRides`: Die Liste der zu sortierenden Objekte. 
Muss im Aufrufkontext definiert sein.
- `this.currentSort` und `this.currentSortDir`: Variablen im Komponenten- oder Seitenzustand, die die aktuelle Spalte und Sortierrichtung speichern.

Verweise:
- ViewAllTripsPage.vue: Verwendung zur Sortierung der angezeigten Fahrten.
- ProfilePage.vue: Nutzung für Sortierfunktionen in der Profilansicht.
*/