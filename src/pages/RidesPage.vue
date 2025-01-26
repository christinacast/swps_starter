<template>
    <header>
      <h1>Hier werden dir Fahrten vermittelt.</h1>
    </header>
    <div class="InserierteTrips">
        <TripsInserierenFormular />
    </div>
</template>

<script>

import TripsInserierenFormular from '@/components/TripsInserierenFormular.vue';

export default {
    name: "RidesPage",

    components: {
        TripsInserierenFormular
    }
};

</script>