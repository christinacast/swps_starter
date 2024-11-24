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
    <div class="profile" v-if="user">
      <!-- Show greeting if user is logged in -->
      <p class="greeting">Hello, {{ user.name }}</p>
      <router-link to="/profil" class="nav-link">
        <img src="/images/icons8-admin-settings-male-64.png" alt="profile" class="nav-icon" />
      </router-link>
    </div>
    <div class="login-register-container" v-else>
      <!-- Show login/register if no user is logged in -->
      <router-link to="/login">
        Login
      </router-link>
      <router-link to="/register"> 
        Sign-Up 
      </router-link>
    </div>
  </header>
</template>

<script>
import { supabase } from '@/services/supabase.js'

export default {
  name: 'HeaderComponent',
  data() {
    return {
      user: null, // Store the user-data when logged in
    };
  },
  async mounted() {
  // Check if the user is logged in
  const { data } = await supabase.auth.getUser();
    if (data && data.user) {
      // Fetch additional profile data from the 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', data.user.id)
        .single();

      if (!profileError) {
        this.user = { ...data.user, name: profile.name || 'User' }; // Default to 'User' if no name is found
      }
    }
  },
};

</script>

<style scoped>
/* Spezifische Stile für die Überschrift */
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
</style>