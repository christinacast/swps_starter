<template>
  <div class="register-container">
    <h1 class="register-title">Register</h1>
    <form @submit.prevent="handleRegister" class="register-form">

      <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" v-model="name" class="form-input" placeholder="Enter your name" required />
      </div>

      <div class="form-group">
        <label for="surname" class="form-label">Surname</label>
        <input type="text" id="surname" v-model="surname" class="form-input" placeholder="Enter your surname"
          required />
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-input" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password"
          required />
      </div>

      <button type="submit" class="form-button">Register</button>
    </form>
    <p class="login-link">Already have an account? <router-link to="/login" class="link">Login</router-link></p>
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

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: this.name,
            surname: this.surname,
            email: this.email
          }
        ]);

      if (profileError) {
        alert('Error creating profile: ' + profileError.message);
      } else {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
@import '@/assets/css/pages/RegisterPage.css';
</style>
