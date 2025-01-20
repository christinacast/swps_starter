<template>
<div class="homePage">
    <div class="search-container">
        <!-- Hintergrundbild -->
        <div class="start_pic"></div>
      <div class="search-wrapper">
        <SearchComponent />
      </div>
    </div>

    <!-- Content-Blöcke untereinander -->
    <div class="content-container">
      <!-- "Wer fährt heute?" Block -->
      <div
        class="content-block"
        style="background-image: url('/images/icons8-traffic-jam-64.png')"
      >
        <div class="content-overlay">
          <router-link to="/rides">
            <h2>Wer fährt heute?</h2>
            <p>
              Hier kannst du einsehen, wer heute alles fährt und für dich noch
              einen Platz frei hat.
            </p>
            <button>Learn More</button>
          </router-link>
        </div>
      </div>

      <!-- "Meine Fahrten" Block -->
      <div
        class="content-block"
        style="background-image: url('/images/icons8-steering-wheel-64.png')"
      >
        <router-link to="/calendar" class="content-overlay">
          <h2>Meine Fahrten</h2>
          <p>Siehe deine anstehenden Fahrten ein</p>
          <button class="btn">Learn More</button>
        </router-link>
      </div>

      <!-- "Zu Uni Now" Block -->
      <div
        class="content-block"
        style="background-image: url('/images/icons8-university-64.png')"
      >
        <div class="content-overlay">
          <h2>Zu Uni Now</h2>
          <p>Siehe deinen Uni Now Kalender ein</p>
          <button class="btn">Learn More</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchComponent from '@/components/SearchComponent.vue';

export default {
  name: 'HomePage',
  components: {
    SearchComponent,
  },
};
</script>

<style scoped>
@import '@/assets/css/pages/home.css';
</style>
