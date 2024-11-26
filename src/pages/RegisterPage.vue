<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div>
          <label for="surname">Surname</label>
          <input type="text" id="surname" v-model="surname" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </template>
  
  <script>
import { supabase } from '@/services/supabase.js';
// Import the Supabase client to handle user authentication and database interactions.

export default {
  data() {
    return {
      name: '', // Stores the user's first name entered in the form.
      surname: '', // Stores the user's last name entered in the form.
      email: '', // Stores the user's email address entered in the form.
      password: '' // Stores the user's password entered in the form.
    };
  },
  methods: {
    async handleRegister() {
      // This function handles the user registration process when the form is submitted.

      // Step 1: Register the user in Supabase's authentication system
      const { data, error } = await supabase.auth.signUp({
        email: this.email, // Use the email provided in the form
        password: this.password // Use the password provided in the form
      });

      if (error) {
        // If an error occurs during the signup process, show an alert with the error message
        alert('Error registering: ' + error.message);
        return; // Stop further execution if there's an error
      }

      // Step 2: Insert additional user details (name, surname, email) into the 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles') // Target the 'profiles' table in the database
        .insert([
          {
            id: data.user.id, // Use the user ID provided by Supabase after successful signup
            name: this.name, // Use the name entered in the form
            surname: this.surname, // Use the surname entered in the form
            email: this.email // Use the email entered in the form
          }
        ]);

      if (profileError) {
        // If there's an error inserting the user's profile data, show an alert
        alert('Error creating profile: ' + profileError.message);
      } else {
        // If everything is successful, redirect the user to the login page
        this.$router.push('/login'); // Vue Router is used to navigate to the Login page
      }
    }
  }
};
</script>