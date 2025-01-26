<template>
    <footer class="Impressum-bar">
      <router-link to="/impressum" class="bottom-bar-references">
        Impressum
      </router-link>
      <router-link to="/testprojekt-hinweise" class="bottom-bar-references">
        Testprojekt-Hinweise
      </router-link>
      <router-link to="/cookies" class="bottom-bar-references">
        Cookies
      </router-link>
      <router-link to="/transparenz" class="bottom-bar-references">
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