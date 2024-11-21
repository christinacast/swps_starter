<template>
  <header class="top-bar">
    <h1>Uni DRIVE</h1>
    <div class="center-items">
      <router-link to="/" class="nav-link">
        <img src="/images/icons8-home.pdf" alt="home" class="nav-icon" />
      </router-link>
      <router-link to="/" class="nav-link">
        <img src="/images/icons8-messages-64.png" alt="messages" class="nav-icon" />
      </router-link>
      <router-link to="/maps" class="nav-link">
        <img src="/images/icons8-map-64.png" alt="maps" class="nav-icon" />
      </router-link>
      <router-link to="/" class="nav-link">
        <img src="/images/icons8-calendar-64.png" alt="calendar" class="nav-icon" />
      </router-link>
    </div>
    <div class="profile">
      <router-link to="/profil" class="nav-link">
         <img src="/images/icons8-admin-settings-male-64.png" alt="profile" class="nav-icon" />
     </router-link>

    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style scoped>
/* Spezifische Stile für die Überschrift */


@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
</style>