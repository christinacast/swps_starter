<template>
    <div>
      <h1>Profil Page</h1>
      <p>Hier kann der Nutzer seine eigenen Daten einsehen.</p>
    </div>
    <div v-if="user">
      <!-- Display user details -->
      <p><strong>Name:</strong> {{ profile.name || 'Unknown' }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>

      <!-- Logout button -->
      <button class="logout-button" @click="logout">Logout</button>
    </div>

    <div v-else>
      <p>You are not logged in. <router-link to="/login">Login here</router-link></p>
    </div>
  </template>

<script>
import { supabase } from '@/services/supabase.js';

export default {
  name: 'ProfilPage',
  data() {
    return {
      user: null,     // Supabase-authenticated user
      profile: {},    // Additional profile data
    };
  },
  async mounted() {
    // Fetch the currently logged-in user
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      this.user = authData.user;

      // Fetch additional profile data from the 'profiles' table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('name, surname')
        .eq('id', this.user.id)
        .single();

      if (!error) {
        this.profile = profileData;
      } else {
        console.error('Error fetching profile:', error.message);
      }
    }
  },
  methods: {
    async logout() {
      // Log out the user via Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Error logging out: ' + error.message);
      } else {
        // Clear user data and redirect to the login page
        this.user = null;
        this.$router.push('/login');
      }
    },
  },
};
</script>
  
<style scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
</style>