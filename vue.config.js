// Importiert die Funktion zur Konfiguration der Vue-CLI
const { defineConfig } = require('@vue/cli-service');

// Exportiert die Konfiguration der Vue-App
module.exports = defineConfig({
  // Aktiviert das Transpilieren von Abhängigkeiten für ältere Browserkompatibilität
  transpileDependencies: true,

  // Plugin-spezifische Optionen
  pluginOptions: {
    vuetify: {
      // Konfiguration für den Vuetify-Loader
      // Weitere Details: https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
});