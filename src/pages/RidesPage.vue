<template>
    <header>
        <h1 class="rides-heading">Hier werden dir Fahrten vermittelt.</h1>
    </header>
    <form class="trips-formular-wrapper">

        <div class="TripsInserieren">
            <TripsInserierenFormular />
        </div>
        <div class="TripsSuchen">
            <TripsSuchenFormular />
        </div>
    </form>
</template>

<script>

import TripsInserierenFormular from '@/components/TripsInserierenFormular.vue';
import TripsSuchenFormular from '@/components/TripsSuchenFormular.vue';

export default {
    name: "RidesPage",

    components: {
        TripsInserierenFormular,
        TripsSuchenFormular
    }
};

</script>

<style scoped>
.rides-heading {
  font-size: 2.5rem; /* Large font size for visibility */
  font-weight: bold; /* Emphasize the heading */
  color: #2c3e50; /* Dark gray/blue color for elegance */
  text-align: center; /* Center the heading horizontally */
  margin-top: 20px; /* Add some space at the top */
  margin-bottom: 20px; /* Add space below the heading */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  letter-spacing: 0.5px; /* Slightly increase letter spacing for readability */
}

/* Optional: Add responsiveness for smaller screens */
@media (max-width: 600px) {
  .rides-heading {
    font-size: 2rem; /* Reduce font size for smaller screens */
    margin-top: 15px; /* Adjust spacing for mobile view */
    margin-bottom: 15px;
  }
}

/* Wrapper für die Formulare */
.trips-formular-wrapper {
  display: flex; /* Flexbox aktivieren */
  gap: 1%; /* Abstand zwischen den Formularen */
  justify-content: center; /* Zentriert auf dem Bildschirm */
  flex-wrap: wrap; /* Ermöglicht das Springen in die nächste Zeile */
  margin-top: 2rem;
}

/* Stellt sicher, dass beide Formulare gleich breit sind */
.TripsInserieren,
.TripsSuchen {
  flex: 1; /* Gleiche Flex-Basis für beide Formulare */
  max-width: 700px; /* Maximale Breite für die Formulare */
  min-width: 500px; /* Mindestbreite für die Formulare */
  box-sizing: border-box; /* Padding und Border werden in die Breite einberechnet */
}

/* Media Query für kleinere Bildschirme */
@media (max-width: 768px) {
  .rides-form-wrapper {
    flex-direction: column; /* Formulare untereinander anordnen */
  }

  .trips-suchen-form {
    max-width: 100%; /* Volle Breite für jedes Formular */
  }
}
</style>