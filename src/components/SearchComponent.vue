<template>
    <div class="search-container">
      <input type="text" id="search-input" placeholder="Search..." />
      <button type="button" id="search-button">Search</button>
      <button type="menu" id="filter-button">
        <img src="/images/icons8-filter-50.png" alt="filter" />
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchComponent',
  };
  </script>
  
  <style scoped>
  @import '@/assets/css/base.css';
  @import '@/assets/css/layout.css';
  @import '@/assets/css/components/searchBar.css';
  </style>