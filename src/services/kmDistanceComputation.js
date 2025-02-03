export function haversineDistance(coords1, coords2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    const [lon1, lat1] = coords1; // Extract first set of coordinates
    const [lon2, lat2] = coords2; // Extract second set of coordinates
  
    const R = 6371; // Earth's radius in kilometers
  
    // Convert latitudes and longitudes from degrees to radians
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
  
    // Haversine formula
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in kilometers
  }