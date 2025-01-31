<template>
  <!-- 
    The outer <div> contains the entire "Inserieren" (insertion) form.
    We use "trips-inserieren-form" as a CSS class for potential styling.
  -->
  <div class="trips-inserieren-form">
    
    <!-- 
      This container holds the main content of the form.
      You can style it or add more layout structure if desired.
    -->
    <div class="content">

      <!-- 
        SECTION: Add Ride Form
        This section includes all the input fields, labels,
        and the submit button that triggers a new ride insertion.
      -->
      <section class="add-ride">
        
        <!-- 
          We use the `@submit.prevent="handleSubmit"` directive
          to handle form submission in the `handleSubmit` method 
          and prevent the default page reload.
        -->
        <form @submit.prevent="handleSubmit" class="form-container">

          <!-- 
            Introductory text to let the user know what this form is about.
          -->
          <h1>Du suchst noch Mitfahrer für dein Fahrtziel?</h1>
          <h2>Super, inseriere hier eine Fahrt</h2>

          <!-- 
            FIELDSET: Start Address
            Contains inputs for the starting location of the ride.
            v-model binds each input to our data properties.
          -->
          <fieldset>
            <legend>Startpunkt</legend>

            <!-- Street -->
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

            <!-- House Number & Postal Code in a row -->
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

            <!-- City -->
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

          <!-- 
            FIELDSET: Destination Address
            Contains inputs for the destination location of the ride.
          -->
          <fieldset>
            <legend>Ziel</legend>

            <!-- Street -->
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

            <!-- House Number & Postal Code in a row -->
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

            <!-- City -->
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

          <!-- 
            DIV: Additional Info
            Contains date and time fields.
          -->
          <div class="form-row">

            <!-- Date -->
            <div class="form-group">
              <label for="date-add">Datum</label>
              <input
                type="date"
                id="date-add"
                v-model="date"
                required
              />
            </div>

            <!-- Time -->
            <div class="form-group">
              <label for="time-add">Uhrzeit</label>
              <input
                type="time"
                id="time-add"
                v-model="time"
                required
              />
            </div>

          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="isInserting"
          >
            <!-- If currently inserting, show a small loading indicator or text -->
            {{ isInserting ? "Wird inseriert..." : "Inserieren" }}
          </button>

          <!-- 
            Status Messages
            We conditionally display feedback from the process:
            - successMessage
            - errorMessage
          -->
          <p 
            v-if="successMessage" 
            class="status-message success"
          >
            {{ successMessage }}
          </p>
          <p 
            v-if="errorMessage" 
            class="status-message error"
          >
            {{ errorMessage }}
          </p>

        </form>
      </section>
      
      <!-- 
        SECTION: Debug Logs
        A list of every log message we produce while handling submission.
        This helps with immediate feedback for any steps that fail or succeed.
      -->
      <section class="debug-logs" v-if="debugMessages.length">
        <h3>Debug Logs:</h3>
        <ul>
          <!-- 
            We iterate over each message in debugMessages and print it out.
          -->
          <li v-for="(message, index) in debugMessages" :key="index">
            {{ message }}
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>

<script>
/**
 * Import supabase client for database interactions
 * and a utility for address-to-GeoJSON conversion.
 */
import { supabase } from '@/services/supabase.js'
import { convertToGeoJSON } from '@/services/geoUtils.js'

export default {
  name: 'TripsInserierenFormular',

  data() {
    return {
      /**
       * USER & AUTH
       * ----------------------------------
       * 'user' stores info about the currently logged-in user.
       */
      user: null,

      /**
       * FORM FIELDS
       * ----------------------------------
       * Each property here is bound to an input field via v-model.
       * The user must fill these in before submitting the form.
       */
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

      /**
       * FEEDBACK & DEBUG
       * ----------------------------------
       * We store debug messages in an array, so we can show them in the UI.
       * successMessage and errorMessage are shown when the submission finishes
       * or fails, respectively.
       * isInserting is a boolean that indicates whether the insertion process
       * is currently in progress (helps to disable the button, show loading text, etc.).
       */
      debugMessages: [],
      successMessage: '',
      errorMessage: '',
      isInserting: false
    }
  },

  methods: {
    /**
     * handleSubmit
     * -----------------------------------------------------
     * Method triggered when the user presses the "Inserieren" button.
     * 1) Fetch user data (to ensure user is logged in).
     * 2) Construct the full addresses (start & dest).
     * 3) Convert addresses to GeoJSON.
     * 4) Construct a route LineString from start to destination.
     * 5) Insert the data into the database.
     * 6) Handle success or error, and reset the form accordingly.
     */
    async handleSubmit() {
      this.clearFeedback()      // Clear old messages/logs
      this.isInserting = true   // Mark insertion as in-progress

      // Step 1: Attempt to fetch current user (auth check)
      await this.fetchUser()

      // If user is still null after fetchUser, it means no user is logged in
      if (!this.user) {
        this.errorMessage = 'Kein Benutzer eingeloggt. Bitte loggen Sie sich ein.'
        this.debugMessages.push('No user found. Exiting submission process.')
        this.isInserting = false
        return
      }

      try {
        // Step 2: Construct address strings
        const startAddressString = `${this.streetStart} ${this.houseNumberStart}, ${this.postalCodeStart} ${this.cityStart}, Germany`
        const destAddressString = `${this.streetDest} ${this.houseNumberDest}, ${this.postalCodeDest} ${this.cityDest}, Germany`

        this.debugMessages.push(`Constructed start address: ${startAddressString}`)
        this.debugMessages.push(`Constructed destination address: ${destAddressString}`)

        // Step 3: Convert addresses to GeoJSON (start & dest)
        // We wrap it in a try-catch in case `convertToGeoJSON` fails or returns null.
        const startAddressGeoJSON = await this.convertAddressToGeoJSON(startAddressString)
        const destAddressGeoJSON = await this.convertAddressToGeoJSON(destAddressString)

        // Step 4: Construct a GeoJSON LineString for the route
        const geoJSONRoute = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              startAddressGeoJSON.geometry.coordinates, // Start coords
              destAddressGeoJSON.geometry.coordinates   // Destination coords
            ]
          },
          properties: {
            start: startAddressString,
            destination: destAddressString
          }
        }

        this.debugMessages.push('Constructed route (LineString) GeoJSON:')
        this.debugMessages.push(JSON.stringify(geoJSONRoute, null, 2))

        // Step 5: Insert into the database
        await this.insertToDatabase(
          startAddressGeoJSON,
          destAddressGeoJSON,
          geoJSONRoute.geometry,
          startAddressString,
          destAddressString
        )

        // If no error thrown, we assume success:
        this.successMessage = 'Fahrt erfolgreich inseriert!'
        this.debugMessages.push('Ride insertion completed successfully.')

        // Step 6: Reset the form
        this.resetForm()

      } catch (err) {
        // Catch any unexpected error in the process
        this.errorMessage = `Fehler beim Inserieren: ${err.message}`
        this.debugMessages.push(`Error during submission: ${err.message}`)
        console.error('Submission Error:', err)
      } finally {
        // In any case, end the "loading" state
        this.isInserting = false
      }
    },

    /**
     * convertAddressToGeoJSON
     * -----------------------------------------------------
     * Helper that calls the "convertToGeoJSON" function.
     * Adds debug logs to help troubleshoot address geocoding.
     */
    async convertAddressToGeoJSON(address) {
      this.debugMessages.push(`Attempting to convert "${address}" to GeoJSON...`)
      const geoJSON = await convertToGeoJSON(address)

      if (!geoJSON || !geoJSON.geometry) {
        this.debugMessages.push(`Failed to convert "${address}" to GeoJSON (invalid response).`)
        throw new Error('Ungültige GeoJSON-Daten erhalten')
      }

      this.debugMessages.push(`GeoJSON for "${address}" received successfully.`)
      this.debugMessages.push(JSON.stringify(geoJSON, null, 2))
      return geoJSON
    },

    /**
     * insertToDatabase
     * -----------------------------------------------------
     * Inserts the ride data into the 'rides' table in Supabase.
     * We display logs for debugging and handle any errors returned.
     */
    async insertToDatabase(startGeoJSON, endGeoJSON, routeGeoJSON, startString, destString) {
      try {
        this.debugMessages.push('Inserting new ride into the database...')

        // Attempt to insert
        const { data, error } = await supabase
          .from('rides')
          .insert({
            user_id: this.user.id,
            start_point: startGeoJSON.geometry,
            end_point: endGeoJSON.geometry,
            route: routeGeoJSON,
            status: "Offen für Mitfahrer",
            available_seats: 5,
            ride_date: this.date,
            start_string: startString,
            end_string: destString,
            ride_time: this.time,
            // For participants, you might want to store an array or JSON. 
            // Shown here as a string example (adjust as needed).
            participants: [this.user.id]
          })
          .select()

        if (error) {
          this.debugMessages.push(`Supabase Insert Error: ${error.message}`)
          console.error('Supabase Insert Error:', error)
          throw new Error(error.message)
        }

        this.debugMessages.push('Ride inserted successfully:')
        this.debugMessages.push(JSON.stringify(data, null, 2))
        return data
      } catch (err) {
        console.log(err) // Re-throw so handleSubmit can catch it
        throw err
      }
    },

    /**
     * fetchUser
     * -----------------------------------------------------
     * Fetches the currently logged-in user from Supabase auth.
     * Then tries to load additional profile data for that user.
     */
    async fetchUser() {
      this.debugMessages.push('Fetching current user from Supabase auth...')

      // Step 1: Get the currently authenticated user
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        // If there's an error, we log it and keep user = null
        this.debugMessages.push(`Error fetching user: ${error.message}`)
        console.error('Error fetching user:', error)
        return
      }

      if (data && data.user) {
        // If a user is logged in, proceed to fetch profile
        this.debugMessages.push(`User found: ${data.user.id}`)
        await this.fetchUserProfile(data.user)
      } else {
        // If no user is logged in, user remains null
        this.debugMessages.push('No user logged in.')
      }
    },

    /**
     * fetchUserProfile
     * -----------------------------------------------------
     * Given the basic user info, fetch additional profile data
     * (e.g. the user's name) from the 'profiles' table.
     */
    async fetchUserProfile(baseUser) {
      this.debugMessages.push(`Fetching profile for user: ${baseUser.id}`)

      try {
        // Query the 'profiles' table for the user's name
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', baseUser.id)
          .single()

        if (profileError) {
          this.debugMessages.push(`Error fetching user profile: ${profileError.message}`)
          console.error('Error fetching user profile:', profileError)
          return
        }

        // If successful, attach the name to the user object
        const userName = profile?.name || 'User'
        this.user = { ...baseUser, name: userName }
        this.debugMessages.push(`Profile fetched successfully. User name: ${userName}`)
      } catch (err) {
        this.debugMessages.push(`Unexpected error fetching profile: ${err.message}`)
        console.error('Unexpected error fetching profile:', err)
      }
    },

    /**
     * resetForm
     * -----------------------------------------------------
     * Clears the form fields so the user can enter new data if desired.
     */
    resetForm() {
      this.debugMessages.push('Resetting form fields...')
      this.streetStart = ''
      this.houseNumberStart = ''
      this.postalCodeStart = ''
      this.cityStart = ''
      this.streetDest = ''
      this.houseNumberDest = ''
      this.postalCodeDest = ''
      this.cityDest = ''
      this.date = ''
      this.time = ''
    },

    /**
     * clearFeedback
     * -----------------------------------------------------
     * Clears all feedback fields (debug messages, success, and error texts)
     * to avoid mixing them with the next submission attempt.
     */
    clearFeedback() {
      this.debugMessages = []
      this.successMessage = ''
      this.errorMessage = ''
    }
  }
}
</script>

<style scoped>
@import '@/assets/css/components/TripsInserierenFormular.css';
</style>