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
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { supabase } from "@/services/supabase.js";

export default {
  name: "CalendarComponent",
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    onDelete: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const calendarEl = ref(null);
    let calendarInstance = null;

    // Zustand für das Popup
    const showDetailsDialog = ref(false);
    const selectedEvent = ref(null);

    // Kalender initialisieren
    const initializeCalendar = () => {
      if (calendarEl.value) {
        calendarInstance = new Calendar(calendarEl.value, {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: "timeGridWeek",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          },
          events: props.events,
          editable: false,
          selectable: true,
          eventClick: handleEventClick, // Event-Klick-Handler
        });

        calendarInstance.render();
      }
    };

    // Event-Klick-Handler
    const handleEventClick = (info) => {
      selectedEvent.value = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        extendedProps: info.event.extendedProps,
      };
      showDetailsDialog.value = true; // Dialog anzeigen
    };

    // Termin löschen
    const deleteEvent = async () => {
      if (selectedEvent.value) {
        try {
          const { error } = await supabase
            .from("termine")
            .delete()
            .eq("id", selectedEvent.value.id);

          if (error) {
            console.error("Fehler beim Löschen des Termins:", error.message);
            alert("Fehler beim Löschen des Termins.");
            return;
          }

          // Entferne das Event aus FullCalendar
          calendarInstance.getEventById(selectedEvent.value.id)?.remove();

          alert("Termin erfolgreich gelöscht!");
          props.onDelete(); // Aktualisiere die Events
        } catch (err) {
          console.error("Fehler:", err.message);
        } finally {
          closeDetailsDialog();
        }
      }
    };

    // Dialog schließen
    const closeDetailsDialog = () => {
      showDetailsDialog.value = false;
      selectedEvent.value = null;
    };

    // Datum formatieren
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleString();
    };

    // Events im Kalender aktualisieren
    watch(
      () => props.events,
      (newEvents) => {
        if (calendarInstance) {
          calendarInstance.removeAllEvents();
          calendarInstance.addEventSource(newEvents);
        }
      }
    );

    // Initialisierung und Zerstörung
    onMounted(() => initializeCalendar());
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