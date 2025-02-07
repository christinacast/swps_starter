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

import TripsInserierenFormular from '@/components/TripsInserierenFormular.vue';

export default {
    name: "RidesPage",

    components: {
        TripsInserierenFormular,
    }
};

</script>

<style scoped>
@import '@/assets/css/pages/RidesPage.css';
</style>