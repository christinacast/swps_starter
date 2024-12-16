<template>
    <footer class="Impressum-bar">
      <router-link to="/" class="bottom-bar-references">
        Impressum
      </router-link>
      <router-link to="/" class="bottom-bar-references">
        Rechtliches (AGB, Datenschutz)
      </router-link>
      <router-link to="/" class="bottom-bar-references">
        Cookies
      </router-link>
      <router-link to="/" class="bottom-bar-references">
        Transparenz der Plattform
      </router-link>
    </footer>
  </template>
  
  <script>

  export default {
    name: 'FooterComponent',
  };
  </script>
  
  <style scoped>
  @import '@/assets/css/base.css'; 
  @import '@/assets/css/layout.css'; 
  </style>