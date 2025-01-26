<template>
  <div class="impressum-page">
    <h1>Impressum</h1>
    <section>
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        Dieses Projekt wurde von einer Gruppe motivierter (Wirtschafts-)Informatikstudenten im Rahmen eines Studienprojekts erstellt.
        Wir möchten betonen, dass dieses Projekt keinen kommerziellen Hintergrund hat und ausschließlich zu Lernzwecken
        dient.
      </p>
      <p>
        Projektteam:<br />
        Uni DRIVE<br />
        Musterstraße 1<br />
        12345 Musterstadt<br />
      </p>
    </section>

    <section>
      <h2>Kontakt</h2>
      <p>
        Da es sich um ein Testprojekt handelt, können Sie uns bei Fragen oder Feedback gerne per E-Mail erreichen:
        <br />
        <a href="mailto:unidrive@studierende.de">unidrive@studierende.de</a>
      </p>
      <p>
        Bitte beachten Sie, dass wir nicht garantieren können, auf jede Anfrage zu antworten, da dieses Projekt
        nicht aktiv betreut wird.
      </p>
    </section>

    <section>
      <h2>Haftung für Inhalte</h2>
      <p>
        Dieses Projekt wurde mit größter Sorgfalt erstellt, dennoch übernehmen wir keine Haftung für die Korrektheit,
        Vollständigkeit oder Aktualität der Inhalte. Da es sich um ein Testprojekt handelt, können technische Fehler
        oder unvollständige Funktionen auftreten. Bitte nutzen Sie die Plattform daher nur zu Demonstrationszwecken.
      </p>
    </section>

    <section>
      <h2>Urheberrecht</h2>
      <p>
        Die Inhalte und Werke, die im Rahmen dieses Projekts entstanden sind, wurden von uns selbst erstellt und sind
        durch das Urheberrecht geschützt. Eine Verwendung der Inhalte außerhalb dieses Projekts bedarf der Zustimmung
        der Projektbeteiligten.
      </p>
    </section>

    <section>
      <h2>Ein besonderer Dank</h2>
      <p>
        Wir möchten uns bei unseren Kommilitonen, Professoren und Mentoren insbesondere Anna und Sebastian bedanken, die uns bei der Entwicklung dieses
        Projekts unterstützt haben. Dieses Projekt ist ein wichtiger Teil unseres Lernprozesses und gibt uns die
        Möglichkeit, praktische Erfahrungen zu sammeln.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: "ImpressumPage",
};
</script>

<style scoped>
.impressum-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding-bottom: 80px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #34495e;
  margin-top: 20px;
}

p {
  line-height: 1.6;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>