// Importiert die Material Design Icons und die Vuetify-Stylesheets
// Diese Dateien sind notwendig, damit Vuetify-Komponenten korrekt gerendert werden
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons
import 'vuetify/styles'; // Vuetify Styles

// Importiert die Hauptfunktion von Vuetify zur Erstellung des Frameworks
import { createVuetify } from 'vuetify';

// Exportiert eine Vuetify-Instanz, die in unserer App genutzt wird
// Wir verwenden Vuetify als zentrales UI-Framework, um eine konsistente Benutzeroberfläche zu gewährleisten
export default createVuetify({});

/*
Wichtige Hinweise:
1. Diese Datei stellt die zentrale Konfiguration für Vuetify bereit.
2. Wir verwenden Vuetify, um ein modernes, responsives und benutzerfreundliches Design zu realisieren.
3. Anpassungen wie Farb- oder Komponenten-Themes können hier vorgenommen werden, um das Design unserer App zu individualisieren.
*/