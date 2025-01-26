// geoUtils.js

export async function convertToGeoJSON(address) {
    // Your Geoapify API key
    const API_KEY = "385677337d03452faed0d83cada949da";
  
    // Build the API request URL
    const geoapifyURL = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      address
    )}&format=json&apiKey=${API_KEY}`;
  
    try {
      // Fetch the geocoding data from Geoapify
      const response = await fetch(geoapifyURL);
  
      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`Geoapify API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Check if any results were returned
      if (!data.results || data.results.length === 0) {
        throw new Error("No results found for the given address.");
      }
  
      // Extract the coordinates from the first result
      const { lat, lon } = data.results[0];
  
      // Return the GeoJSON format
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lon, lat], // GeoJSON requires [longitude, latitude]
        },
        properties: {
          address, // Include the original address in properties
        },
      };
    } catch (error) {
      console.error("Error converting address to GeoJSON:", error);
      throw error;
    }
  }