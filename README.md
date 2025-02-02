# Uni Drive – Deine Mitfahrplattform für die Uni Bayreuth

Willkommen zu **Uni Drive**, einem interaktiven Web-Projekt für Fahrgemeinschaften rund um die Universität Bayreuth.  
Ziel ist es, die **Bildung von Fahrgemeinschaften** zu vereinfachen – sei es für das tägliche Pendeln oder für gemeinsame Fahrten innerhalb der Region.

---

## Inhaltsverzeichnis

1. [Projektüberblick](#projektüberblick)  
2. [Key Features & USP](#key-features--usp)  
3. [Installation & Setup](#installation--setup)  
4. [Benutzung](#benutzung)  
5. [Projektstruktur](#projektstruktur)  
6. [Externe Services & API-Keys](#externe-services--api-keys)  
7. [Lizenz](#lizenz)  
8. [Projektteam](#projektteam)  
9. [Verweise & Weiterführende Infos](#verweise--weiterführende-infos)

---

## Projektüberblick

**Warum Uni Drive?**  
- Die Universität Bayreuth möchte Mitarbeitenden und Studierenden eine nachhaltige Alternative zum Individualverkehr bieten.  
- **Pendelverkehr** zwischen Campus Bayreuth und Kulmbach sowie Fahrten in der Region verursachen oft **unnötige CO₂-Emissionen** und hohe Verkehrsdichte.  
- **Uni Drive** hilft, **Mitfahrgelegenheiten** effizient zu koordinieren, dadurch wird sowohl Zeit als auch CO₂ gespart.

**Was macht das Projekt besonders?**  
- **Interaktivität**: Jede Fahrt kann entweder als „Suche nach Fahrer“ oder „Suche nach Mitfahrern“ eingestellt werden.  
- **Gruppenchat**: Interessierte können sich einer Fahrt anschließen und haben direkt einen Chat zur Abstimmung.  
- **Forum**: Zusätzlich gibt es ein offenes Forum für den Austausch unter allen Usern.  
- **Visuelle Kartenintegration**: Mithilfe der [Leaflet](https://leafletjs.com/)-Bibliothek und Geoapify-API werden Fahrten auf einer Karte als Route visualisiert.

---

## Key Features & USP

1. **Mitfahrer- und Fahrersuche**  
   - User stellen eine Fahrt ein und wählen, ob sie noch **Fahrer** oder **Mitfahrer** suchen.  
   - Jede Fahrt landet direkt in einer Datenbank, sodass alle anderen User diese sehen können.

2. **Gruppenchat**  
   - Tritt man einer Fahrt bei, wird automatisch ein **Chatraum** (Gruppenchat) erstellt.  
   - Teilnehmer klären dort Details wie Abfahrtszeit, Zustiegspunkte oder Kosten.

3. **Forum**  
   - Zusätzlich zum Chat kann man sich im **allgemeinen Forum** austauschen, Fahrten bewerben oder Feedback geben.

4. **Kartenintegration**  
   - Die Route wird als **Linie auf einer Leaflet-Karte** dargestellt (basierend auf GeoJSON-Daten).  
   - So sehen User sofort, welche Orte auf dem Weg liegen und ob ein Zwischeneinstieg möglich ist.

5. **Nachhaltiger Gedanke**  
   - Jede Mitfahrgelegenheit reduziert CO₂-Ausstoß und entlastet den Verkehr.  
   - Das Projekt unterstützt die Universität Bayreuth bei ihrem Ziel, eine **umweltfreundlichere Mobilität** zu fördern.

---

## Installation & Setup

1. **Voraussetzungen**  
   - [Node.js](https://nodejs.org/) (empfohlene Version siehe `package.json`)  
   - Ein beliebiger Paketmanager wie `npm` oder `yarn`.

2. **Repository klonen**  
   ```bash
   git clone https://github.com/<euer_repo>/swps_starter_group1.git
   cd swps_starter_group1

3. **Abhängigkeiten installieren**

```bash
npm install
```
oder
```bash
yarn install
```

4. **Development Server starten**
```bash
npm run serve
```

Danach kann das Projekt unter http://localhost:3000 im Browser aufgerufen werden.

Hinweis: Ein zusätzliches Setup in Supabase ist nicht nötig, da wir bereits eine fertige Supabase-Datenbank verwenden. Solange supabaseUrl und supabaseKey im Code hinterlegt sind, läuft das Backend automatisch.


---

## Benutzung

1. **Registrierung & Login**  
   - Nach dem Start gelangt man auf die Startseite.  
   - Hier kann man sich **registrieren** oder **einloggen**.

2. **Fahrt erstellen**  
   - Mit `+ Neue Fahrt inserieren` kann eine Fahrt angelegt werden, als „Suche nach Mitfahrern“ oder „Suche nach Fahrer“.  
   - Die Adresse wird per Geoapify-API in **GeoJSON** umgewandelt, um sie auf der Karte darzustellen.

3. **Alle Fahrten ansehen & filtern**  
   - Die Hauptseite zeigt **alle anstehenden Fahrten** in einer Tabelle an.  
   - Man kann nach Datum, Abfahrtsort, Zielort, Status usw. filtern.

4. **Einer Fahrt beitreten**  
   - Durch Klicken auf `Beitreten` tritt man einer Fahrt bei, was einen Gruppenchat für die Fahrt eröffnet.  

5. **Forum**  
   - Ein **Forum** ermöglicht den offenen Austausch zwischen allen Nutzern.  
   - Hier können Fahrten beworben und Diskussionen geführt werden.

---

## Projektstruktur

```bash
swps_starter_group1/
├─ public/
│  ├─ images/
│  ├─ cities.json
│  └─ index.html
├─ src/
│  ├─ assets/
│  │  ├─ css/
│  │  │  ├─ home.css
│  │  │  ├─ base.css
│  │  │  └─ layout.css
│  │  └─ images/
│  │     ├─ logo.png
│  │     └─ logo.svg
│  ├─ components/
│  │  ├─ CalendarComponent.vue
│  │  ├─ ErstelleTermin.vue
│  │  ├─ FooterComponent.vue
│  │  ├─ HeaderComponent.vue
│  │  ├─ MapComponent.vue
│  │  ├─ SearchComponent.vue
│  │  └─ TripsSuchenFormular.vue
│  ├─ pages/
│  │  ├─ CalendarPage.vue
│  │  ├─ ChatPage.vue
│  │  ├─ ForumPage.vue
│  │  ├─ HomePage.vue
│  │  ├─ ImpressumPage.vue
│  │  ├─ LoginPage.vue
│  │  ├─ MapsPage.vue
│  │  ├─ ProfilePage.vue
│  │  ├─ RegisterPage.vue
│  │  ├─ RidesPage.vue
│  │  ├─ TestprojektHinweise.vue
│  │  ├─ TransparenzPage.vue
│  │  └─ ViewAllTripsPage.vue
│  ├─ plugins/
│  │  ├─ vuetify.js
│  │  └─ webfontloader.js
│  ├─ router/
│  │  └─ index.js
│  ├─ services/
│  │  ├─ geoUtils.js      // Enthält Funktionen zum Konvertieren von Adressen in GeoJSON mithilfe der Geoapify API
│  │  ├─ supabase.js      // Erstellt den Supabase-Client (supabaseUrl, supabaseKey)
│  │  └─ validationService.js
│  ├─ App.vue
│  ├─ main.js
├─ .gitignore
├─ babel.config.js
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ vue.config.js
```

**Wichtige Ordner & Dateien kurz erklärt:**

- **public/**  
  Enthält statische Ressourcen (HTML, Bilder, JSON-Dateien).  
- **src/assets/**  
  CSS-Dateien (`home.css`, `layout.css` …) und weitere Bilddateien.  
- **src/components/**  
  Wiederverwendbare Vue-Komponenten (z. B. `MapComponent`, `HeaderComponent`, etc.).  
- **src/pages/**  
  „Seitenkomponenten“, die per Router angesteuert werden (z. B. `HomePage`, `LoginPage`, `RidesPage`).  
- **src/services/**  
  - `geoUtils.js`: Nutzt die Geoapify-API zur Adressumwandlung in GeoJSON.  
  - `supabase.js`: Initialisiert den Supabase-Client.  
  - `validationService.js`: Validierungslogik für Formulare oder Eingaben.  
- **plugins/**  
  - `vuetify.js`: Bindet das Vuetify-UI-Framework ein.  
  - `webfontloader.js`: Lädt Schriften asynchron.  
- **router/index.js**  
  Definiert alle Routen zu den jeweiligen Seitenkomponenten.  
- **package.json**  
  Enthält Projektmetadaten, Abhängigkeiten und Skripte.  
- **README.md**  
  Diese Dokumentation.

---

## Externe Services & API-Keys

- **Supabase**  
  - Bereitstellung einer Datenbank, Authentifizierung und Backend-Funktionen.  
  - `supabaseUrl` und `supabaseKey` werden in `src/services/supabase.js` hinterlegt.

- **Geoapify API**  
  - Konvertiert Adressen in Koordinaten/GeoJSON für die Kartenanzeige.  
  - API-Key in `src/services/geoUtils.js`.

---

## Lizenz

Dieses Projekt wird **Open Source** entwickelt.  
Falls nicht anders angegeben, steht es unter einer frei verfügbaren Lizenz.  

---

## Projektteam

- **Jakob Wölfel**  
- **Viktor Person**  
- **Nikita Singh**  
- **Christina Castedello**

*Product Owner (Scrum):* Anna  
*Betreuer & Bewertender:* Sebastian Duda

---

## Verweise & Weiterführende Infos

- **White-Paper**: Enthält detaillierte Informationen zu Scrum, Entwicklungsphasen und technischen Hintergründen.  
- **Kontakt**: Bei Fragen könnt ihr uns über GitHub Issues oder per E-Mail erreichen.  
- **Screenshots & GIFs**: *(Platzhalter für Screenshots oder Bewegtbilder)*

---
