<template>
  <div class="profile-container">
    <h1 class="profile-title">Profile Page</h1>
    <p class="profile-description">Here you can view your personal information.</p>
    
    <div v-if="user" class="profile-card">
      <!-- Display user details -->
      <div class="profile-item">
        <strong>Name:</strong> 
        <span>{{ profile.name || 'Unknown' }}</span>
      </div>
      <div class="profile-item">
        <strong>Email:</strong> 
        <span>{{ user.email }}</span>
      </div>
      
      <!-- Logout button -->
      <button class="form-button" @click="logout">Logout</button>
    </div>

    <div v-else class="profile-not-logged-in">
      <p>You are not logged in. <router-link to="/login" class="link">Login here</router-link></p>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/services/supabase.js';

export default {
  name: 'ProfilePage',
  data() {
    return {
      user: null,
      profile: {},
    };
  },
  async mounted() {
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      this.user = authData.user;

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
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Error logging out: ' + error.message);
      } else {
        this.user = null;
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.profile-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.profile-description {
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
}

.profile-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 400px;
}

.profile-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}

.profile-item:last-child {
  border-bottom: none;
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
  margin-top: 20px;
}

.form-button:hover {
  background-color: #0056b3;
}

.profile-not-logged-in {
  text-align: center;
}

.link {
  color: #007BFF;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>

