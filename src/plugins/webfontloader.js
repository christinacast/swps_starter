/**
 * Lädt Google-Fonts mithilfe des Webfontloaders.
 * Diese Datei sorgt dafür, dass die benötigten Schriftarten (Roboto) in unserer App dynamisch geladen werden.
 * Dokumentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  // Importiert den Webfontloader dynamisch mit Webpack (Lazy Loading)
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader');

  // Konfiguriert und lädt die Schriftarten von Google
  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap'], // Roboto mit verschiedenen Schriftstärken
    },
  });
}

/*
Hinweise:
1. Diese Funktion wird in der `main.js` verwendet, um sicherzustellen, dass die Schriftarten geladen sind, bevor die App gerendert wird.
2. Lazy Loading reduziert die Größe des Hauptbundles und verbessert die Ladezeit der App.
3. Aktuell wird nur die Schriftfamilie Roboto geladen. Zusätzliche Schriftarten können bei Bedarf ergänzt werden.
*/