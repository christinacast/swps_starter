<template>
  <div class="login-container">
    <h1 class="login-title">Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-input" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password"
          required />
      </div>

      <button type="submit" class="form-button">Login</button>
    </form>
    <p class="register-link">Don't have an account? <router-link to="/register" class="link">Register</router-link></p>
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
        this.$router.push({
          name: 'Profile',
          params: { userName: this.email, userPassword: this.password }
        });
      }
    }
  }
};
</script>

<style scoped>
@import '@/assets/css/pages/LoginPage.css';
</style>
