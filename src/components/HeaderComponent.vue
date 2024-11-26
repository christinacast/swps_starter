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
      <router-link to="/profile" class="nav-link-profile">
        <!-- Greet the user and display their profile icon -->
        <p class="greeting">Hallo, {{ user.name }}</p>
      </router-link>
      <img src="/images/icons8-admin-settings-male-64.png" alt="profile" class="profile-nav-icon" />
    </div>
    <div class="login-register-container" v-else>
      <!-- Show login/register if no user is logged in -->
      <router-link to="/login" class="user-link login-button">
        Login
      </router-link>
      <router-link to="/register" class="user-link signup-button">
        Sign-Up
      </router-link>
    </div>
  </header>
</template>

<script>
import { supabase } from '@/services/supabase.js'; // Import the configured Supabase client

export default {
  name: 'HeaderComponent', // The name of the Vue.js component
  data() {
    return {
      user: null, // A reactive property to store the logged-in user's data. Initially set to null, assuming no user is logged in.
    };
  },
  async mounted() {
    // The `mounted` lifecycle hook is a special function in Vue.js that is automatically called when the component is fully loaded into the DOM (Document Object Model).
    // The DOM is a representation of the web page's structure that JavaScript can interact with, such as adding or removing HTML elements dynamically.

    // Step 1: Use Supabase's `auth.getUser` method to check if there's a currently authenticated user
    await this.fetchUser();

    // Step 2: Listen for changes in the user's authentication state
    // Supabase provides an `onAuthStateChange` method that triggers whenever the user logs in or logs out.
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        // If a user logs in, fetch their data dynamically
        await this.fetchUser();
      } else {
        // If the user logs out, reset the `user` property to null
        this.user = null;
      }
    });
  },
  methods: {
    async fetchUser() {
      // This method fetches the logged-in user's data from Supabase

      // Step 1: Fetch the currently authenticated user
      const { data } = await supabase.auth.getUser();
      // `data` will contain information about the logged-in user if there is one, or it will be `null` if no user is logged in.

      // Step 2: Verify if a user object is present in the returned data
      if (data && data.user) {
        // If a user is logged in, proceed to fetch additional profile data

        try {
          // Step 3: Query the 'profiles' table in Supabase to fetch the user's profile data (e.g., name)
          const { data: profile, error: profileError } = await supabase
            .from('profiles') // Target the 'profiles' table
            .select('name') // Select the 'name' column only (you can add more columns if needed)
            .eq('id', data.user.id)
            // Use the `.eq()` method to filter the rows where the `id` matches the user's ID.
            // This ensures we only get the profile data for the logged-in user.
            .single(); // Ensure only a single row is returned

          // Step 4: Handle the case where the query is successful
          if (!profileError) {
            // Merge the user object from Supabase with the profile data.
            // If the 'name' field is not found in the profile, default it to 'User'.
            this.user = { ...data.user, name: profile.name || 'User' };
          }
        } catch (error) {
          // Log any unexpected errors during the fetching process
          console.error('Error fetching profile data:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Spezifische Stile für die Überschrift */
@import '@/assets/css/base.css';
@import '@/assets/css/layout.css';
</style>