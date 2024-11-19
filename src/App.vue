<template>
  <v-app>
    <v-main>
      <HeaderComponent /> <!-- Static Header -->
      <HomePage />
      <FooterComponent /> <!-- Static Footer -->
    </v-main>
  </v-app>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import HomePage from './pages/HomePage.vue'

export default {
  name: 'App',

  components: {
    HomePage,
    FooterComponent,
    HeaderComponent,
  },

  data: () => ({
    //
  }),
}
</script>