// Mock Data for the Dashboard Prototype - Global Scale

export const CROP_TYPES = {
  // Cereals
  WHEAT: { id: 'wheat', name: 'Wheat', color: '#f59e0b' },
  CORN: { id: 'corn', name: 'Corn', color: '#10b981' },
  RICE: { id: 'rice', name: 'Rice', color: '#3b82f6' },
  BARLEY: { id: 'barley', name: 'Barley', color: '#d97706' },
  OATS: { id: 'oats', name: 'Oats', color: '#b45309' },
  SORGHUM: { id: 'sorghum', name: 'Sorghum', color: '#84cc16' },
  MILLET: { id: 'millet', name: 'Millet', color: '#a3e635' },
  RYE: { id: 'rye', name: 'Rye', color: '#78350f' },
  
  // Pulses/Legumes
  SOYBEAN: { id: 'soybean', name: 'Soybean', color: '#8b5cf6' },
  LENTIL: { id: 'lentil', name: 'Lentil', color: '#d946ef' },
  CHICKPEA: { id: 'chickpea', name: 'Chickpea', color: '#ec4899' },
  PEAS: { id: 'peas', name: 'Peas', color: '#4ade80' },
  BEANS: { id: 'beans', name: 'Beans', color: '#a855f7' },
  
  // Oilseeds
  SUNFLOWER: { id: 'sunflower', name: 'Sunflower', color: '#eab308' },
  CANOLA: { id: 'canola', name: 'Canola/Rapeseed', color: '#facc15' },
  PEANUT: { id: 'peanut', name: 'Peanut', color: '#c2410c' },
  OLIVE: { id: 'olive', name: 'Olive', color: '#65a30d' },
  
  // Fibers and Cash Crops
  COTTON: { id: 'cotton', name: 'Cotton', color: '#f43f5e' },
  SUGARCANE: { id: 'sugarcane', name: 'Sugarcane', color: '#14b8a6' },
  SUGARBEET: { id: 'sugarbeet', name: 'Sugar Beet', color: '#0ea5e9' },
  TOBACCO: { id: 'tobacco', name: 'Tobacco', color: '#b91c1c' },
  COFFEE: { id: 'coffee', name: 'Coffee', color: '#451a03' },
  TEA: { id: 'tea', name: 'Tea', color: '#166534' },
  COCOA: { id: 'cocoa', name: 'Cocoa', color: '#7c2d12' },
  
  // Roots/Tubers
  POTATO: { id: 'potato', name: 'Potato', color: '#9a3412' },
  CASSAVA: { id: 'cassava', name: 'Cassava', color: '#ca8a04' },
  SWEET_POTATO: { id: 'sweet_potato', name: 'Sweet Potato', color: '#ea580c' },
  YAM: { id: 'yam', name: 'Yam', color: '#92400e' },
  
  // Fruits/Vegetables (Broad Categories)
  TOMATO: { id: 'tomato', name: 'Tomato', color: '#ef4444' },
  ONION: { id: 'onion', name: 'Onion', color: '#fb923c' },
  APPLE: { id: 'apple', name: 'Apple Orchard', color: '#dc2626' },
  BANANA: { id: 'banana', name: 'Banana Plantation', color: '#fef08a' },
  CITRUS: { id: 'citrus', name: 'Citrus Grove', color: '#f97316' },
  GRAPES: { id: 'grapes', name: 'Vineyard', color: '#5b21b6' },
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

export function suggestCropForRegion(lat, lng) {
  // Simple mock logic based on latitude
  const absLat = Math.abs(lat);
  
  // Select a random crop from a suitable list for variety in suggestions
  if (absLat < 23.5) {
    // Tropical
    const tropicalCrops = [CROP_TYPES.RICE, CROP_TYPES.COFFEE, CROP_TYPES.SUGARCANE, CROP_TYPES.BANANA, CROP_TYPES.CASSAVA, CROP_TYPES.COCOA, CROP_TYPES.YAM, CROP_TYPES.SORGHUM, CROP_TYPES.MILLET];
    const recommendedCrop = tropicalCrops[Math.floor(Math.random() * tropicalCrops.length)];
    return {
      recommendedCrop,
      climate: 'Tropical',
      conditions: 'High humidity, consistent rainfall, warm temperatures year-round.',
      soil: 'Varies by specific location, often clay loam with good water retention.',
      reasoning: `${recommendedCrop.name} thrives in tropical climates with abundant water and heat. Given the selected coordinates near the equator, this crop is highly recommended.`
    };
  } else if (absLat >= 23.5 && absLat < 40) {
    // Subtropical / Warm Temperate
    const subtropicalCrops = [CROP_TYPES.COTTON, CROP_TYPES.SOYBEAN, CROP_TYPES.TEA, CROP_TYPES.CITRUS, CROP_TYPES.PEANUT, CROP_TYPES.SWEET_POTATO, CROP_TYPES.OLIVE, CROP_TYPES.GRAPES, CROP_TYPES.TOBACCO];
    const recommendedCrop = subtropicalCrops[Math.floor(Math.random() * subtropicalCrops.length)];
    return {
      recommendedCrop,
      climate: 'Subtropical / Warm Temperate',
      conditions: 'Long, hot summers and mild winters.',
      soil: 'Often sandy loam, well-drained soils.',
      reasoning: `${recommendedCrop.name} performs excellently in subtropical zones. The moderate rainfall and long growing season here are ideal for it.`
    };
  } else if (absLat >= 40 && absLat < 55) {
    // Cool Temperate
    const temperateCrops = [CROP_TYPES.WHEAT, CROP_TYPES.CORN, CROP_TYPES.SUNFLOWER, CROP_TYPES.POTATO, CROP_TYPES.SUGARBEET, CROP_TYPES.APPLE, CROP_TYPES.CANOLA, CROP_TYPES.ONION, CROP_TYPES.BEANS];
    const recommendedCrop = temperateCrops[Math.floor(Math.random() * temperateCrops.length)];
    return {
      recommendedCrop,
      climate: 'Temperate',
      conditions: 'Distinct seasons, moderate rainfall, cool winters.',
      soil: 'Deep, fertile loam (Mollisols or Alfisols).',
      reasoning: `${recommendedCrop.name} is a staple of temperate agriculture. The chill hours in winter and warm summers make this a perfect growing belt.`
    };
  } else {
    // Cold / Boreal
    const borealCrops = [CROP_TYPES.BARLEY, CROP_TYPES.OATS, CROP_TYPES.RYE, CROP_TYPES.PEAS, CROP_TYPES.LENTIL];
    const recommendedCrop = borealCrops[Math.floor(Math.random() * borealCrops.length)];
    return {
      recommendedCrop,
      climate: 'Cold Temperate / Boreal',
      conditions: 'Short growing season, cold winters.',
      soil: 'Slightly acidic, well-drained, often podzolic.',
      reasoning: `Hardy crops like ${recommendedCrop.name} are recommended due to the short frost-free period and cooler summer temperatures.`
    };
  }
}
