<template>
    <div class="rides-page">
      <header>
        <h1>Hier werden dir Fahrten vermittelt.</h1>
      </header>
      <div class="content">
        <!-- Add Ride Section -->
        <section class="add-ride">
          <form @submit.prevent="handleSubmit" class="form-container">
            <!-- Start Address -->
            <fieldset>
              <legend>Startpunkt</legend>
              <div class="form-group">
                <label for="street-start">Straße</label>
                <input type="text" id="street-start" placeholder="Beispielstraße" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="houseNumber-start">Haus Nr.</label>
                  <input type="text" id="houseNumber-start" placeholder="123" required />
                </div>
                <div class="form-group">
                  <label for="postalCode-start">Postleitzahl</label>
                  <input type="text" id="postalCode-start" placeholder="12345" required />
                </div>
              </div>
              <div class="form-group">
                <label for="city-start">Stadt</label>
                <input type="text" id="city-start" placeholder="Musterstadt" required />
              </div>
            </fieldset>
  
            <!-- Destination Address -->
            <fieldset>
              <legend>Ziel</legend>
              <div class="form-group">
                <label for="street-dest">Straße</label>
                <input type="text" id="street-dest" placeholder="Beispielstraße" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="houseNumber-dest">Haus Nr.</label>
                  <input type="text" id="houseNumber-dest" placeholder="123" required />
                </div>
                <div class="form-group">
                  <label for="postalCode-dest">Postleitzahl</label>
                  <input type="text" id="postalCode-dest" placeholder="12345" required />
                </div>
              </div>
              <div class="form-group">
                <label for="city-dest">Stadt</label>
                <input type="text" id="city-dest" placeholder="Musterstadt" required />
              </div>
            </fieldset>
  
            <!-- Additional Info -->
            <div class="form-row">
              <div class="form-group">
                <label for="date-add">Datum</label>
                <input type="date" id="date-add" v-model="date" required />
              </div>
              <div class="form-group">
                <label for="time-add">Uhrzeit</label>
                <input type="time" id="time-add" v-model="time" required />
              </div>
              <div class="form-group">
                <label for="seats">Freie Plätze</label>
                <input type="number" id="seats" min="1" placeholder="z.B. 3" v-model="seats" required />
              </div>
            </div>
  
            <!-- Submit Button -->
            <button type="submit" class="btn-submit" :disabled="!isFormValid">
              Inserieren
            </button>
          </form>
        </section>
      </div>
    </div>
  </template>

<script>
import { validateAddressInput } from '@/services/validationService';
// import { supabase } from '@/services/supabase.js';

export default {
    name: "RidesPage",
    data() {
        return {
            startInput: "",
            destinationInput: "",
            date: "",
            time: "",
            seats: "",
            validationMessage: '',
        };
    },
    methods: {
        checkInput() {
            const { isValid, message } = validateAddressInput(this.startInput);
            this.validationMessage = message;
            if (!isValid) {
                // Handle invalid input (e.g., show an error)
                console.error('Invalid input:', message);
            }
        },
    },
};
</script>

<style scoped>
@import '@/assets/css/pages/rides.css';
</style>