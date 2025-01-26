<template>
    <div class="transparenz-page">
      <h1>Transparenz der Plattform</h1>
  
      <section>
        <h2>Unser Ziel: Maximale Offenheit</h2>
        <p>
          Willkommen auf Uni DRIVE! Wir sind stolz darauf, eine Plattform zu schaffen, die vollständig transparent ist.
          Unser Ziel ist es, dass jeder Nutzer genau versteht, wie unser System funktioniert und welche Informationen
          verarbeitet werden. Transparenz ist für uns ein grundlegender Wert und ein Zeichen des Vertrauens, das wir
          Ihnen entgegenbringen.
        </p>
      </section>
  
      <section>
        <h2>Keine Datenspeicherung</h2>
        <p>
          Da dieses Projekt ein reines Testprojekt von Studenten ist, möchten wir Ihnen versichern, dass 
          <strong>keine persönlichen Daten gespeichert</strong> werden. Alle Daten, die Sie während der Nutzung 
          eingeben, werden ausschließlich für die Dauer Ihrer Sitzung verwendet und danach unwiderruflich gelöscht. 
          Es erfolgt keine Speicherung in Datenbanken oder auf Servern.
        </p>
      </section>
  
      <section>
        <h2>Open Source Ansatz</h2>
        <p>
          Die Entwicklung von Uni DRIVE basiert auf einem Open-Source-Ansatz. Der gesamte Code ist öffentlich einsehbar, 
          und Sie können jederzeit nachvollziehen, wie unser System aufgebaut ist. Unser Code ist auf 
          <a href="https://github.com" target="_blank">GitHub</a> verfügbar, und wir laden alle ein, Feedback zu geben 
          oder Verbesserungen vorzuschlagen.
        </p>
      </section>
  
      <section>
        <h2>Verwendete Technologien</h2>
        <p>
          Transparenz bedeutet auch, dass wir offenlegen, welche Technologien wir verwenden. Für dieses Projekt nutzen wir:
        </p>
        <ul>
          <li><strong>Vue.js</strong> - Für das Frontend und die Benutzeroberfläche</li>
          <li><strong>Supabase</strong> - Für Datenbank- und Backend-Funktionen (nur für Testzwecke)</li>
          <li><strong>Geoapify API</strong> - Für die Verarbeitung von Geodaten und Adressen</li>
          <li><strong>GitHub</strong> - Für die Versionskontrolle und Zusammenarbeit</li>
        </ul>
      </section>
  
      <section>
        <h2>Unsere Motivation</h2>
        <p>
          Dieses Projekt wurde entwickelt, um Studenten praktische Erfahrung in der Entwicklung moderner Webanwendungen 
          zu bieten. Unser Ziel ist es, nicht nur die technischen Grundlagen zu erlernen, sondern auch die Bedeutung 
          von Offenheit und Vertrauen im digitalen Raum zu verstehen.
        </p>
      </section>
  
      <section>
        <h2>Ihr Feedback ist willkommen</h2>
        <p>
          Wir schätzen Ihr Feedback! Da dieses Projekt ein Lernprojekt ist, hilft uns Ihr Input dabei, unsere 
          Fähigkeiten zu verbessern und zukünftige Projekte noch besser zu gestalten.
        </p>
        <p>
          Kontaktieren Sie uns gerne bei Fragen, Anregungen oder Feedback. Wir freuen uns auf Ihre Nachricht!
        </p>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: "TransparenzPlattform",
  };
  </script>
  
  <style scoped>
  .transparenz-page {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    padding-bottom: 80px; /* Extra Platz am Ende */
  }
  
  h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 28px;
  }
  
  h2 {
    color: #34495e;
    margin-top: 20px;
    font-size: 22px;
  }
  
  p {
    line-height: 1.8;
    margin-bottom: 15px;
    color: #4a4a4a;
  }
  
  ul {
    margin-top: 10px;
    margin-bottom: 20px;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 10px;
    color: #4a4a4a;
  }
  
  strong {
    color: #2c3e50;
  }
  
  a {
    color: #3498db;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>