<template>
  <v-app>
    <v-main>
      <HeaderComponent /> <!-- Static Header -->
      <div id="app">
        <router-view /> <!-- Dynamically loads the component for the current route -->
      </div>
      <FooterComponent /> <!-- Static Footer -->
    </v-main>
  </v-app>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  name: 'App',

  components: {
    FooterComponent,
    HeaderComponent,
  },

  data: () => ({
    //
  }),
}
</script>