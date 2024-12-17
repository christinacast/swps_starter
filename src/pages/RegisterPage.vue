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
        <input type="text" id="surname" v-model="surname" class="form-input" placeholder="Enter your surname" required />
      </div>
      
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-input" placeholder="Enter your email" required />
      </div>
      
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password" required />
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
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.register-form {
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

.login-link {
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
