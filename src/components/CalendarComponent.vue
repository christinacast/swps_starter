<template>
  <div id="calendar-container">
    <!-- FullCalendar -->
    <div id="calendar" ref="calendarEl"></div>

    <!-- Fenster mit Termindetails und Löschoption -->
    <div v-if="showDetailsDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>Details zum Termin</h3>
        <p><strong>Name:</strong> {{ selectedEvent?.title }}</p>
        <p><strong>Startzeit:</strong> {{ formatDate(selectedEvent?.start) }}</p>
        <p><strong>Endzeit:</strong> {{ formatDate(selectedEvent?.end) }}</p>
        <p><strong>Adresse:</strong> {{ selectedEvent?.extendedProps?.adresse || 'Keine Adresse angegeben' }}</p>

        <div class="modal-buttons">
          <button @click="deleteEvent">Löschen</button>
          <button @click="closeDetailsDialog">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar } from "@fullcalendar/core"; // Import der FullCalendar-Kalenderbibliothek
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin für Monatsansicht
import timeGridPlugin from "@fullcalendar/timegrid"; // Plugin für Wochen-/Tagesansicht
import interactionPlugin from "@fullcalendar/interaction"; // Plugin für Interaktion wie Event-Klick
import { ref, onMounted, onBeforeUnmount, watch } from "vue"; // Vue-Reaktivität und Lifecycle-Hooks
import { supabase } from "@/services/supabase.js"; // Verbindung zur Supabase-Datenbank

export default {
  name: "CalendarComponent", // Name der Komponente für Debugging und Wiederverwendbarkeit
  props: {
    /**
     * @prop {Array} events - Enthält die Liste der Events, die im Kalender angezeigt werden sollen.
     * Format: [{ id, title, start, end, extendedProps }]
     */
    events: {
      type: Array,
      default: () => [],
    },
    /**
     * @prop {Function} onDelete - Callback-Funktion, die nach dem Löschen eines Events ausgeführt wird.
     * Wird verwendet, um die Events in der übergeordneten Komponente zu aktualisieren.
     */
    onDelete: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    // Reaktive Referenzen und Variablen
    const calendarEl = ref(null); // Referenz für das DOM-Element des Kalenders
    let calendarInstance = null; // FullCalendar-Instanz
    const showDetailsDialog = ref(false); // Steuert die Anzeige des Detail-Dialogs
    const selectedEvent = ref(null); // Speichert die Daten des ausgewählten Events

    /**
     * Initialisiert die FullCalendar-Instanz und rendert den Kalender.
     * - Plugins und Ansichtseinstellungen werden hier definiert.
     */
    const initializeCalendar = () => {
      if (calendarEl.value) {
        calendarInstance = new Calendar(calendarEl.value, {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: "timeGridWeek", // Standardansicht: Wochenansicht mit Stundenraster
          headerToolbar: {
            left: "prev,next today", // Navigation (vor/zurück und heute)
            center: "title", // Titel der aktuellen Ansicht
            right: "dayGridMonth,timeGridWeek,timeGridDay", // Wechsel zwischen Monats-, Wochen- und Tagesansicht
          },
          events: props.events, // Events aus den Props laden
          editable: false, // Events können nicht per Drag & Drop bearbeitet werden
          selectable: true, // Benutzer können Events auswählen
          eventClick: handleEventClick, // Event-Klick-Handler definieren
        });

        calendarInstance.render(); // Kalender rendern
      }
    };

    /**
     * Wird aufgerufen, wenn ein Event im Kalender angeklickt wird.
     * - Öffnet den Detail-Dialog mit den Daten des angeklickten Events.
     * @param {Object} info - Informationen über das angeklickte Event.
     */
    const handleEventClick = (info) => {
      selectedEvent.value = {
        id: info.event.id, // Event-ID
        title: info.event.title, // Event-Titel
        start: info.event.start, // Startdatum/-zeit
        end: info.event.end, // Enddatum/-zeit
        extendedProps: info.event.extendedProps, // Erweiterte Eigenschaften (z. B. Adresse)
      };
      showDetailsDialog.value = true; // Dialog anzeigen
    };

    /**
     * Löscht das ausgewählte Event aus der Datenbank und aktualisiert den Kalender.
     * - Verwendet die Supabase-Datenbank zum Löschen.
     */
    const deleteEvent = async () => {
      if (selectedEvent.value) {
        try {
          // Löschen des Events aus der Tabelle "termine"
          const { error } = await supabase
            .from("termine")
            .delete()
            .eq("id", selectedEvent.value.id);

          if (error) {
            console.error("Fehler beim Löschen des Termins:", error.message);
            alert("Fehler beim Löschen des Termins.");
            return;
          }

          // Event aus dem Kalender entfernen
          calendarInstance.getEventById(selectedEvent.value.id)?.remove();

          alert("Termin erfolgreich gelöscht!");
          props.onDelete(); // Events in der übergeordneten Komponente aktualisieren
        } catch (err) {
          console.error("Fehler:", err.message);
        } finally {
          closeDetailsDialog(); // Dialog schließen
        }
      }
    };

    /**
     * Schließt den Detail-Dialog und setzt die Auswahl zurück.
     */
    const closeDetailsDialog = () => {
      showDetailsDialog.value = false;
      selectedEvent.value = null;
    };

    /**
     * Formatiert ein Datum in ein lesbares Format.
     * @param {Date} date - Datum, das formatiert werden soll.
     * @returns {string} Formatierter Datums-String.
     */
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleString(); // Lokales Datumsformat anwenden
    };

    /**
     * Beobachtet Änderungen in den übergebenen Events und aktualisiert den Kalender entsprechend.
     * - Entfernt alte Events und fügt neue hinzu.
     */
    watch(
      () => props.events, // Beobachtet die "events"-Prop
      (newEvents) => {
        if (calendarInstance) {
          calendarInstance.removeAllEvents(); // Alle bestehenden Events entfernen
          calendarInstance.addEventSource(newEvents); // Neue Events hinzufügen
        }
      }
    );

    /**
     * Lifecycle-Hook: Wird ausgeführt, sobald die Komponente in den DOM eingefügt wird.
     * - Initialisiert den Kalender.
     */
    onMounted(() => initializeCalendar());

    /**
     * Lifecycle-Hook: Wird ausgeführt, bevor die Komponente zerstört wird.
     * - Entfernt die FullCalendar-Instanz.
     */
    onBeforeUnmount(() => calendarInstance?.destroy());

    return {
      calendarEl,
      showDetailsDialog,
      selectedEvent,
      deleteEvent,
      closeDetailsDialog,
      formatDate,
    };
  },
};
</script>

<style scoped>
@import "@/assets/css/components/CalendarComponent.css";
</style>