<template>
    <header>
        <h1 class="rides-heading">Hier werden dir Fahrten vermittelt.</h1>
    </header>
    <form class="trips-formular-wrapper">

        <div class="TripsInserieren">
            <TripsInserierenFormular />
        </div>
    </form>
</template>

<script>
import TripsInserierenFormular from '@/components/TripsInserierenFormular.vue'; // Import der Komponente für das Formular zur Fahrtenvermittlung

export default {
  name: "RidesPage", // Name der Komponente, wichtig für Debugging und Router-Referenzen

  components: {
    TripsInserierenFormular, // Registrierung der TripsInserierenFormular-Komponente
  },

  data() {
    return {
      // Hier könnten später datenbezogene Zustände für die Seite hinzugefügt werden,
      // z. B. Fahrtenliste oder Filteroptionen.
    };
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/RidesPage.css';
</style>