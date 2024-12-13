<template>
    <div>
      <h1>Hier ist dein Kalender!</h1> <!-- Überschrift der Seite -->
      <CalendarComponent
        :userName="userName"
        :userPassword="userPassword"
      />
    </div>
  </template>
  
  <script>
  import CalendarComponent from '@/components/CalendarComponent.vue';
  
  export default {
    props: {
      userName: {
        type: String,
        required: true, // Benutzername ist erforderlich
      },
      userPassword: {
        type: String,
        required: true, // Passwort ist erforderlich
      },
    },
    components: {
      CalendarComponent,
    },
  };
  </script>
  
  <style scoped>
  /* Optionales Styling für die Seite */
  </style>
  