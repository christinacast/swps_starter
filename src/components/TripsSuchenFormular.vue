<template>
    <div class="trips-suchen-form">
        <div class="content">
            <!-- Add Ride Section -->
            <section class="add-ride">
                <!-- Notice each input now has v-model binding (e.g. v-model="streetStart") -->
                <form @submit.prevent="handleSubmit" class="form-container">
              <h1>Du suchst noch eine Mitfahrgelegenheit?</h1>
              <h2>Klasse, dann stelle hier eine Suchanzeige ein</h2>
            <!-- Start Address -->
            <fieldset>
              <legend>Startpunkt</legend>
              <div class="form-group">
                <label for="street-start">Straße</label>
                <input
                  type="text"
                  id="street-start"
                  placeholder="Beispielstraße"
                  v-model="streetStart"
                  required
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="houseNumber-start">Haus Nr.</label>
                  <input
                    type="text"
                    id="houseNumber-start"
                    placeholder="123"
                    v-model="houseNumberStart"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="postalCode-start">Postleitzahl</label>
                  <input
                    type="text"
                    id="postalCode-start"
                    placeholder="12345"
                    v-model="postalCodeStart"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="city-start">Stadt</label>
                <input
                  type="text"
                  id="city-start"
                  placeholder="Musterstadt"
                  v-model="cityStart"
                  required
                />
              </div>
            </fieldset>
  
            <!-- Destination Address -->
            <fieldset>
              <legend>Ziel</legend>
              <div class="form-group">
                <label for="street-dest">Straße</label>
                <input
                  type="text"
                  id="street-dest"
                  placeholder="Beispielstraße"
                  v-model="streetDest"
                  required
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="houseNumber-dest">Haus Nr.</label>
                  <input
                    type="text"
                    id="houseNumber-dest"
                    placeholder="123"
                    v-model="houseNumberDest"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="postalCode-dest">Postleitzahl</label>
                  <input
                    type="text"
                    id="postalCode-dest"
                    placeholder="12345"
                    v-model="postalCodeDest"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="city-dest">Stadt</label>
                <input
                  type="text"
                  id="city-dest"
                  placeholder="Musterstadt"
                  v-model="cityDest"
                  required
                />
              </div>
            </fieldset>
  
            <!-- Additional Info -->
            <div class="form-row">
              <div class="form-group">
                <label for="date-add">Datum</label>
                <input
                  type="date"
                  id="date-add"
                  v-model="date"
                  required
                />
              </div>
              <div class="form-group">
                <label for="time-add">Uhrzeit</label>
                <input
                  type="time"
                  id="time-add"
                  v-model="time"
                  required
                />
              </div>
              <div class="form-group">
                <label for="seats">Freie Plätze</label>
                <input
                  type="number"
                  id="seats"
                  min="1"
                  placeholder="z.B. 3"
                  v-model="seats"
                  required
                />
              </div>
            </div>
  
            <!-- Submit Button -->
            <button type="submit" class="btn-submit">
              Suche einstellen
            </button>
  
            <!-- Confirmation Message -->
            <p v-if="confirmationStartAddress" class="confirmation-message">{{ confirmationStartAddress }}</p>
          </form>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/services/supabase.js';
  import { convertToGeoJSON } from '@/services/geoUtils.js'
  
  export default {
    name: 'TripsSuchenFormular',
    data() {
      return {
        user: null, // We only need to check if a user is logged in (no name/profile info)
        // Your form fields:
        streetStart: '',
        houseNumberStart: '',
        postalCodeStart: '',
        cityStart: '',
        streetDest: '',
        houseNumberDest: '',
        postalCodeDest: '',
        cityDest: '',
        date: '',
        time: '',
        seats: '',
        geoJSONStart: null,
        geoJSONDest: null,
  
        confirmationStartAddress: '',
        confirmationDestAddress: ''
      };
    },
  
    methods: {
      async checkUser() {},
  
      async handleSubmit() {
        await this.fetchUser();
  
        const startAddressString = `${this.streetStart} ${this.houseNumberStart}, ${this.postalCodeStart} ${this.cityStart}, Germany`;
        const destAddressString = `${this.streetDest} ${this.houseNumberDest}, ${this.postalCodeDest} ${this.cityDest}, Germany`;
  
        console.log('Constructed Address:', startAddressString, destAddressString);
        
        const startAddressGeoJSON = await convertToGeoJSON(startAddressString)
        const destAddressGeoJSON = await convertToGeoJSON(destAddressString)
  
        this.confirmationStartAddress = startAddressGeoJSON.properties.address
        this.confirmationDestAddress = destAddressGeoJSON.properties.address
        
        console.log('look at the following: ',startAddressGeoJSON, destAddressGeoJSON)
  
        // Construct a GeoJSON LineString
        const geoJSONRoute = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    startAddressGeoJSON.geometry.coordinates, // Start coordinates
                    destAddressGeoJSON.geometry.coordinates  // Destination coordinates
                ]
            },
            properties: {
                start: startAddressString,
                destination: destAddressString
            }
        };
  
        console.log("here the route:", geoJSONRoute)
        console.log(this.user.id, `${this.date}T${this.time}:00Z`)
        
        await this.insertToDatabase(startAddressGeoJSON, destAddressGeoJSON, geoJSONRoute, startAddressString, destAddressString)
        
        this.resetForm()
              },
  
      // Insert the GeoJSON data into your Supabase database
      async insertToDatabase(startGeoJSON, endGeoJSON, routeGeoJSON, startString, endString) {
        console.log(startGeoJSON.geometry, endGeoJSON.geometry, routeGeoJSON.geometry)
        const { data, error } = await supabase
          .from('rides')
          .insert({
            user_id: this.user.id,
            start_point: startGeoJSON.geometry,
            end_point: endGeoJSON.geometry,
            route: routeGeoJSON.geometry,
            status: "Suche noch einen Fahrer",
            available_seats: this.seats,
            ride_date: this.date,
            start_string: startString,
            end_string: endString,
            ride_time: this.time,
            participants: JSON.stringify([this.user.id]),
          })
          .select();
  
        if (error) {
          console.error('Supabase Insert Error:', error)
          throw new Error('Failed to insert data into the database', error);
        }
        return data;
      },
  
      async fetchUser() {
        // This method fetches the logged-in user's data from Supabase
  
        // Step 1: Fetch the currently authenticated user
        const { data } = await supabase.auth.getUser();
        // `data` will contain information about the logged-in user if there is one, or it will be `null` if no user is logged in.
  
        // Step 2: Verify if a user object is present in the returned data
        if (data && data.user) {
          // If a user is logged in, proceed to fetch additional profile data
  
          try {
            // Step 3: Query the 'profiles' table in Supabase to fetch the user's profile data (e.g., name)
            const { data: profile, error: profileError } = await supabase
              .from('profiles') // Target the 'profiles' table
              .select('id') // Select the 'id' column only 
              .eq('id', data.user.id)
              // Use the `.eq()` method to filter the rows where the `id` matches the user's ID.
              // This ensures we only get the profile data for the logged-in user.
              .single(); // Ensure only a single row is returned
  
            // Step 4: Handle the case where the query is successful
            if (!profileError) {
              // Merge the user object from Supabase with the profile data.
              // If the 'name' field is not found in the profile, default it to 'User'.
              this.user = { ...data.user, name: profile.name || 'User' };
            }
          } catch (error) {
            // Log any unexpected errors during the fetching process
            console.error('Error fetching profile data:', error);
          }
        }
      },
  
      resetForm() {
        this.streetStart = '';
        this.houseNumberStart = '';
        this.postalCodeStart = '';
        this.cityStart = '';
        this.streetDest = '';
        this.houseNumberDest = '';
        this.postalCodeDest = '';
        this.cityDest = '';
        this.date = '';
        this.time = '';
        this.seats = '';
        this.errorMessage = '';
      }
    },
  };
  </script>
  
  <style scoped>
  @import '@/assets/css/components/TripsSuchenFormular.css';
  </style>