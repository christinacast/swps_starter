export function sortTable(column) {
    // Wenn dieselbe Spalte erneut geklickt wird, Sortierrichtung umkehren
    if (this.currentSort === column) {
      this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      // Neue Spalte sortieren, Standard: aufsteigend
      this.currentSort = column;
      this.currentSortDir = 'asc';
    }

    // Sortierlogik anwenden
    this.filteredRides.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Für Datum oder Zeit als JavaScript-Date-Objekt umwandeln, wenn notwendig
      if (column === 'ride_date' || column === 'ride_time') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Sortierlogik
      if (aValue < bValue) {
        return this.currentSortDir === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.currentSortDir === 'asc' ? 1 : -1;
      }
      return 0; // Gleichstand
    });
  }