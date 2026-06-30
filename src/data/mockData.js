// Mock Data for the Dashboard Prototype - Global Scale

export const CROP_TYPES = {
  WHEAT: { id: 'wheat', name: 'Wheat', color: '#f59e0b' },
  CORN: { id: 'corn', name: 'Corn', color: '#10b981' },
  SOYBEAN: { id: 'soybean', name: 'Soybean', color: '#8b5cf6' },
  RICE: { id: 'rice', name: 'Rice', color: '#3b82f6' },
  COTTON: { id: 'cotton', name: 'Cotton', color: '#f43f5e' }
};

export const STRESS_LEVELS = {
  LOW: { id: 'low', name: 'Low Stress', color: '#10b981' },
  MODERATE: { id: 'mod', name: 'Moderate Stress', color: '#f59e0b' },
  HIGH: { id: 'high', name: 'High Stress', color: '#ef4444' },
};

export const ADVISORY_STATUS = {
  OPTIMAL: { id: 'opt', name: 'Optimal Moisture', color: '#3b82f6' },
  IRRIGATE_SOON: { id: 'soon', name: 'Irrigate Soon', color: '#f59e0b' },
  CRITICAL: { id: 'crit', name: 'Critical Deficit', color: '#ef4444' },
};

const createPolygon = (lat, lng, size) => [
  [lat, lng],
  [lat + size, lng],
  [lat + size, lng + size],
  [lat, lng + size],
];

export const AGRICULTURAL_HUBS = [
  // North America
  { name: 'USA Midwest', lat: 41.5, lng: -93.5, spread: 3.0 },
  { name: 'USA Central Valley', lat: 36.5, lng: -120.0, spread: 1.0 },
  { name: 'Canada Prairies', lat: 51.0, lng: -106.0, spread: 3.0 },
  
  // South America
  { name: 'Brazil Mato Grosso', lat: -12.5, lng: -55.5, spread: 4.0 },
  { name: 'Brazil Parana', lat: -24.5, lng: -51.5, spread: 2.0 },
  { name: 'Argentina Pampas', lat: -33.5, lng: -62.5, spread: 3.0 },
  
  // Europe
  { name: 'France', lat: 47.0, lng: 2.0, spread: 2.0 },
  { name: 'Germany', lat: 51.0, lng: 10.0, spread: 2.0 },
  { name: 'Ukraine', lat: 49.0, lng: 31.0, spread: 3.0 },
  
  // Africa
  { name: 'South Africa Free State', lat: -28.0, lng: 26.0, spread: 2.0 },
  { name: 'Nigeria Kano', lat: 11.5, lng: 8.5, spread: 2.0 },
  { name: 'Kenya Rift Valley', lat: 0.5, lng: 35.5, spread: 1.5 },
  
  // Asia
  { name: 'India Punjab', lat: 30.5, lng: 75.5, spread: 1.5 },
  { name: 'India Madhya Pradesh', lat: 23.5, lng: 78.5, spread: 3.0 },
  { name: 'China Henan', lat: 34.0, lng: 114.0, spread: 2.0 },
  { name: 'China Heilongjiang', lat: 47.0, lng: 127.0, spread: 3.0 },
  
  // Australia
  { name: 'Australia NSW', lat: -33.0, lng: 147.0, spread: 2.0 },
  { name: 'Australia WA Wheatbelt', lat: -31.0, lng: 118.0, spread: 1.5 },
];

// Generate 2000 fields strictly around inland agricultural hubs
export const mockFields = Array.from({ length: 2000 }).map((_, index) => {
  const hub = AGRICULTURAL_HUBS[Math.floor(Math.random() * AGRICULTURAL_HUBS.length)];
  
  // Random offset within the safe inland spread
  const latOffset = (Math.random() - 0.5) * hub.spread;
  const lngOffset = (Math.random() - 0.5) * hub.spread;
  
  const baseLat = hub.lat + latOffset;
  const baseLng = hub.lng + lngOffset;
  
  const size = 0.05 + Math.random() * 0.1; // Larger field size for global visibility

  const cropKeys = Object.keys(CROP_TYPES);
  const crop = CROP_TYPES[cropKeys[Math.floor(Math.random() * cropKeys.length)]];
  
  const stressKeys = Object.keys(STRESS_LEVELS);
  const stress = STRESS_LEVELS[stressKeys[Math.floor(Math.random() * stressKeys.length)]];
  
  let advisory;
  if (stress === STRESS_LEVELS.LOW) advisory = ADVISORY_STATUS.OPTIMAL;
  else if (stress === STRESS_LEVELS.MODERATE) advisory = ADVISORY_STATUS.IRRIGATE_SOON;
  else advisory = ADVISORY_STATUS.CRITICAL;

  const stages = ['Sowing', 'Vegetative', 'Flowering', 'Maturity'];
  const stage = stages[Math.floor(Math.random() * stages.length)];

  return {
    id: `f-${index}`,
    name: `Global Field ${index + 1}`,
    region: hub.name,
    crop,
    stress,
    advisory,
    stage,
    area: (size * 1000).toFixed(1), // Rough hectare estimation mock
    polygon: createPolygon(baseLat, baseLng, size),
    timeSeries: generateTimeSeries(crop.id, stress.id)
  };
});

function generateTimeSeries(cropType, stressProfile) {
  const data = [];
  let currentNdvi = 0.2;
  let currentNdwi = -0.1;
  let currentDeficit = 0;

  for (let i = 0; i < 12; i++) {
    // Simulate progression over 12 weeks
    if (i < 4) {
      currentNdvi += 0.1; // Growing
    } else if (i < 8) {
      currentNdvi += Math.random() * 0.05; // Peak
    } else {
      currentNdvi -= 0.08; // Senescence
    }

    if (stressProfile === 'high') {
      currentNdwi -= Math.random() * 0.05;
      currentDeficit += 10 + Math.random() * 5;
    } else if (stressProfile === 'mod') {
      currentNdwi += (Math.random() - 0.5) * 0.05;
      currentDeficit += 2 + Math.random() * 3;
    } else {
      currentNdwi += Math.random() * 0.05;
      currentDeficit = Math.max(0, currentDeficit - (Math.random() * 5));
    }

    data.push({
      week: `W${i+1}`,
      ndvi: Math.max(0, Math.min(1, currentNdvi)).toFixed(2),
      ndwi: Math.max(-1, Math.min(1, currentNdwi)).toFixed(2),
      deficit: currentDeficit.toFixed(1),
      rainfall: (Math.random() * 20).toFixed(1)
    });
  }
  return data;
}
