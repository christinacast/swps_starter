<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/services/supabase.js'; 
  // Import the Supabase client to handle authentication and API requests.
  
  export default {
    data() {
      // The `data` function is where we define reactive variables (state) for the component.
      return {
        email: '', // Stores the user's email address entered in the email input field.
        password: '' // Stores the user's password entered in the password input field.
      };
    },
    methods: {
      async handleLogin() {
        // This method is triggered when the user submits the login form.
        // It communicates with Supabase to authenticate the user.
  
        // Step 1: Attempt to log the user in using their email and password
        const { error } = await supabase.auth.signInWithPassword({
          email: this.email, // The email address entered by the user
          password: this.password // The password entered by the user
        });
  
        // Step 2: Handle login errors
        if (error) {
          // If the login fails, show an alert with the error message.
          // This could happen if the email or password is incorrect or the account does not exist.
          alert('Error logging in: ' + error.message);
        } else {
        // Benutzername und Passwort weiterleiten, um zur Map-Seite zu navigieren
        this.$router.push({
          name: 'MapsPage',
          params: { userName: this.email, userPassword: this.password }
        });
      }
    }
      }
    };
  </script>