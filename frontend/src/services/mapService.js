export const geocodeAddress = async (address) => {
    // In a real app, you would use a free geocoding service like Nominatim
    // For this example, we'll return simulated coordinates
    
    // Generate slightly randomized coordinates for demo purposes
    const baseCoordinates = { lat: 28.6139, lng: 77.2090 }; // Delhi
    
    // Add some randomness to simulate different addresses
    const randomOffset = () => (Math.random() - 0.5) * 0.1;
    
    return {
      lat: baseCoordinates.lat + randomOffset(),
      lng: baseCoordinates.lng + randomOffset()
    };
  };
  
  export const calculateRoute = (source, destination) => {
    // Calculate direct distance between points
    const R = 6371e3; // Earth's radius in meters
    const φ1 = source.lat * Math.PI/180;
    const φ2 = destination.lat * Math.PI/180;
    const Δφ = (destination.lat - source.lat) * Math.PI/180;
    const Δλ = (destination.lng - source.lng) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c / 1000; // Convert to kilometers
  
    // Estimate time (assuming average speed of 20 km/h)
    const timeMinutes = (distance / 20) * 60;
    
    return {
      distance: {
        text: `${distance.toFixed(1)} km`,
        value: distance * 1000 // In meters
      },
      duration: {
        text: `${Math.round(timeMinutes)} mins`,
        value: timeMinutes * 60 // In seconds
      }
    };
  };