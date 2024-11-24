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
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        });
        if (error) {
          alert('Error logging in: ' + error.message);
        } else {
          this.$router.push('/dashboard'); // Redirect to dashboard on success
        }
      }
    }
  };
  </script>