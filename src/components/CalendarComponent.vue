<template>
    <div>
      <div id="calendar" style="height: 400px; width: 100%;"></div>
    </div>
  </template>
  
  <script>
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import { createClient } from '@supabase/supabase-js';

  
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
    data() {
      return {
        calendar: null, // Kalender-Instanz wird hier gespeichert
      };
    },
    async mounted() {
      // Sicherstellen, dass das Kalender-Element leer ist
      const calendarEl = document.getElementById('calendar');
      if (calendarEl && this.calendar) {
        calendarEl.innerHTML = ''; // Lösche den Inhalt des Kalender-Containers
      }
  
      // Initialisiere den Kalender
      this.calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        },
        events: await this.loadEvents(), // Dynamische Events
      });
      this.calendar.render();
    },
  
    beforeUnmount() {
      // Entferne den Kalender korrekt vor dem Zerstören der Komponente
      if (this.calendar) {
        this.calendar.destroy();
      }
    },
  
    methods: {
      async loadEvents() {
        // Events aus der Supabase-Datenbank laden
        const supabaseUrl = 'https://ldpsaujnvjyjtflecpgb.supabase.co';
        const supabaseKey = this.userPassword + 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHNhdWpudmp5anRmbGVjcGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NTc4NDcsImV4cCI6MjA0MTUzMzg0N30.56c2P7OPQyNd1flTA4vlyZ7Hn_8sFAWG8ThW6Q341DI';
        const supabase = createClient(supabaseUrl, supabaseKey);
  
        const { data: events, error } = await supabase
          .from('events')
          .select('title, start, end');
  
        if (error) {
          console.error('Error fetching events from Supabase:', error);
          return [];
        }
  
        return events || [];
      },
    },
  };
  </script>
  
  <style scoped>
  #calendar {
    height: 400px;
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  </style>
  