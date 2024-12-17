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
        <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password" required />
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
          name: 'MapsPage',
          params: { userName: this.email, userPassword: this.password }
        });
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #007BFF;
  outline: none;
}

.form-button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-button:hover {
  background-color: #0056b3;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.link {
  color: #007BFF;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
