// Importiert die Vue-Bibliothek und die Funktion zum Erstellen einer Vue-App
import { createApp } from 'vue';

// Importiert die Hauptkomponente der Anwendung (Einstiegspunkt der App)
import App from './App.vue';

// Importiert Vuetify, das UI-Framework für Styling und Komponenten
import vuetify from './plugins/vuetify';

// Importiert eine Funktion zum Laden von Schriftarten
import { loadFonts } from './plugins/webfontloader';

// Importiert das Router-Modul für die Navigation innerhalb der App
import router from './router';

// Lädt die Fonts vor der App-Initialisierung
loadFonts();

// Erstellt die App und fügt Vuetify und Router hinzu
createApp(App)
  .use(vuetify) // UI-Framework einbinden
  .use(router)  // Router für Navigation einbinden
  .mount('#app'); // App im Element mit ID 'app' einbinden

/*
  Verweise auf andere Dateien:
  - ./plugins/vuetify.js: Konfiguration von Vuetify.
  - ./plugins/webfontloader.js: Logik zum Laden der Schriftarten.
  - ./router/index.js: Definition der App-Routen.
*/
