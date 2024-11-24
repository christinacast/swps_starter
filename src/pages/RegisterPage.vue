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
  
  export default {
    data() {
      return {
        name: '',
        surname: '',
        email: '',
        password: ''
      };
    },
    methods: {
      async handleRegister() {
        const { data, error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password
        });
  
        if (error) {
          alert('Error registering: ' + error.message);
          return;
        }
  
        // Insert additional user details into the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, name: this.name, surname: this.surname, email: this.email }]);
  
        if (profileError) {
          alert('Error creating profile: ' + profileError.message);
        } else {
          this.$router.push('/login'); // Redirect to login page on success
        }
      }
    }
  };
  </script>