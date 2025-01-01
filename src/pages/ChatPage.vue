<template>
    <div class="chat-page">
      <!-- Sidebar mit der Benutzerliste -->
      <div class="sidebar">
        <h2>Chats</h2>
        <button class="new-chat-button" @click="openUserSearch">Neuen Chat starten</button>
        <ul>
          <li v-for="user in users" :key="user.id" @click="selectUser(user)" class="chat-list-item">
            <div class="user-item">
              <img :src="user.avatar" alt="User Avatar" class="user-avatar" />
              <span>{{ user.namen }}</span> <!-- Hier den Spaltennamen angepasst -->
            </div>
          </li>
        </ul>
      </div>
  
      <!-- Benutzer-Suchfeld -->
      <div v-if="searchingNewChat" class="user-search-container">
        <input 
          v-model="searchQuery" 
          @input="searchUsers" 
          placeholder="Benutzer suchen..." 
          class="search-bar"
        />
        <ul class="search-results">
          <li v-for="user in filteredUsers" :key="user.id" @click="selectNewChatUser(user)" class="search-result-item">
            <div class="user-item">
              <img :src="user.avatar" alt="User Avatar" class="user-avatar" />
              <span>{{ user.namen }}</span> <!-- Hier den Spaltennamen angepasst -->
            </div>
          </li>
        </ul>
      </div>
  
      <!-- Chat-Bereich -->
      <div class="chat-container" v-if="selectedUser">
        <div class="chat-header">
          <img :src="selectedUser.avatar" alt="Selected User Avatar" class="chat-avatar" />
          <h3>{{ selectedUser.namen }}</h3> <!-- Hier den Spaltennamen angepasst -->
        </div>
        <div class="chat-messages">
          <div v-for="message in chatMessages" :key="message.id" class="message">
            <div :class="{'message-sent': message.sender === 'me', 'message-received': message.sender !== 'me'}">
              <p>{{ message.content }}</p>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input v-model="message" @keyup.enter="sendMessage" placeholder="Nachricht eingeben..." />
          <button @click="sendMessage">Senden</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { supabase } from '@/services/supabase.js';
  
  export default {
    data() {
      return {
        users: [],
        filteredUsers: [],
        selectedUser: null,
        chatMessages: [],
        message: '',
        searchingNewChat: false,
        searchQuery: '',
      };
    },
    async mounted() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        const { data: users, error } = await supabase
          .from('profiles') // Tabellennamen auf 'profiles' geändert
          .select('*');
        
        if (error) console.error('Fehler beim Laden der Benutzer:', error);
        else this.users = users;
      },
      selectUser(user) {
        this.selectedUser = user;
        this.loadChatMessages(user.id);
      },
      async loadChatMessages(userId) {
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', userId);
        
        if (error) console.error('Fehler beim Laden der Nachrichten:', error);
        else this.chatMessages = messages;
      },
      openUserSearch() {
        this.searchingNewChat = true;
        this.searchQuery = '';
        this.filteredUsers = [];
      },
      async searchUsers() {
        if (this.searchQuery.trim() === '') {
          this.filteredUsers = [];
          return;
        }
        
        const { data: users, error } = await supabase
          .from('profiles') // Tabellennamen auf 'profiles' geändert
          .select('*')
          .ilike('namen', `%${this.searchQuery}%`); // Spaltennamen auf 'namen' geändert
        
        if (error) {
          console.error('Fehler bei der Benutzersuche:', error);
        } else {
          console.log('Gefundene Benutzer:', users); // Debugging-Hilfe
          this.filteredUsers = users;
        }
      },
      selectNewChatUser(user) {
        this.searchingNewChat = false;
        this.selectUser(user);
      },
      async sendMessage() {
        if (this.message.trim() && this.selectedUser) {
          const newMessage = {
            user_id: this.selectedUser.id,
            sender: 'me',
            content: this.message.trim(),
          };
          
          const { data, error } = await supabase
            .from('messages')
            .insert([newMessage]);
          
          if (error) console.error('Fehler beim Senden der Nachricht:', error);
          else this.chatMessages.push(data[0]);
          
          this.message = '';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-page { display: flex; height: 100vh; }
  .new-chat-button { width: 100%; margin-bottom: 10px; }
  .search-bar { width: 100%; padding: 10px; margin-bottom: 10px; }
</style>
  