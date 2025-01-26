<template>
    <header>
        <h1 class="rides-heading">Hier werden dir Fahrten vermittelt.</h1>
    </header>
    <div class="TripsInserieren">
        <TripsInserierenFormular />
    </div>
    <div class="TripsSuchen">
        <TripsSuchenFormular />
    </div>
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
</style>