<template>
    <div class="chat-page">
      <!-- Sidebar mit der Benutzerliste -->
      <div class="sidebar">
        <h2>Benutzer</h2>
        <ul>
          <li v-for="user in users" :key="user.id" @click="selectUser(user)">
            <div class="user-item">
              <img :src="user.avatar" alt="User Avatar" class="user-avatar" />
              <span>{{ user.name }}</span>
            </div>
          </li>
        </ul>
        <button @click="startNewChat">Neuen Chat starten</button>
      </div>
  
      <!-- Chat-Bereich -->
      <div class="chat-container">
        <div v-if="selectedUser" class="chat-header">
          <img :src="selectedUser.avatar" alt="Selected User Avatar" class="chat-avatar" />
          <h3>{{ selectedUser.name }}</h3>
        </div>
        <div class="chat-messages">
          <div v-for="message in chatMessages" :key="message.id" class="message">
            <div :class="{'message-sent': message.sender === 'me', 'message-received': message.sender !== 'me'}">
              <p>{{ message.content }}</p>
            </div>
          </div>
        </div>
        <div v-if="selectedUser" class="chat-input">
          <input v-model="message" @keyup.enter="sendMessage" placeholder="Nachricht eingeben..." />
          <button @click="sendMessage">Senden</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        users: [
          { id: 1, name: 'Max Mustermann', avatar: 'https://via.placeholder.com/50' },
          { id: 2, name: 'Erika Mustermann', avatar: 'https://via.placeholder.com/50' },
          // Füge hier weitere Benutzer hinzu
        ],
        selectedUser: null,
        chatMessages: [],
        message: '',
      };
    },
    methods: {
      selectUser(user) {
        this.selectedUser = user;
        this.chatMessages = []; // Setze die Nachrichten zurück, wenn ein neuer Chat ausgewählt wird
      },
      startNewChat() {
        this.selectedUser = null;
        this.chatMessages = []; // Setze die Nachrichten zurück für den neuen Chat
      },
      sendMessage() {
        if (this.message.trim()) {
          this.chatMessages.push({
            id: this.chatMessages.length + 1,
            sender: 'me',
            content: this.message.trim(),
          });
          this.message = ''; // Eingabefeld zurücksetzen
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-page {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 250px;
    background-color: #f4f4f4;
    padding: 20px;
    border-right: 1px solid #ddd;
  }
  
  .sidebar h2 {
    font-size: 1.5em;
  }
  
  .user-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .chat-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
  }
  
  .message {
    margin-bottom: 10px;
  }
  
  .message-sent {
    background-color: #d1ffd6;
    padding: 10px;
    border-radius: 10px;
    max-width: 60%;
    align-self: flex-end;
  }
  
  .message-received {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 10px;
    max-width: 60%;
    align-self: flex-start;
  }
  
  .chat-input {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .chat-input input {
    flex: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ddd;
    outline: none;
  }
  
  .chat-input button {
    padding: 10px 20px;
    background-color: #009260;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .chat-input button:hover {
    background-color: #007c4c;
  }
  </style>
  