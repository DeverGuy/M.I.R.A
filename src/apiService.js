import { CROP_TYPES, STRESS_LEVELS, ADVISORY_STATUS } from './data/mockData';

export async function fetchRealFields(bounds) {
  // bounds is Leaflet bounds object
  const south = bounds.getSouth();
  const west = bounds.getWest();
  const north = bounds.getNorth();
  const east = bounds.getEast();

  // Overpass API query for farmland
  const query = `
    [out:json];
    (
      way["landuse"="farmland"](${south},${west},${north},${east});
      relation["landuse"="farmland"](${south},${west},${north},${east});
    );
    out geom;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await response.json();

    const fields = [];
    const cropKeys = Object.keys(CROP_TYPES);
    const stressKeys = Object.keys(STRESS_LEVELS);

    data.elements.forEach((element, index) => {
      let polygon = [];
      if (element.type === 'way' && element.geometry) {
        polygon = element.geometry.map(pt => [pt.lat, pt.lon]);
      } else if (element.type === 'relation' && element.members) {
        // Just take the first outer way for simplicity in rendering
        const outer = element.members.find(m => m.role === 'outer');
        if (outer && outer.geometry) {
          polygon = outer.geometry.map(pt => [pt.lat, pt.lon]);
        }
      }

      if (polygon.length > 2) {
        // Calculate rough center for fetching weather later
        const centerLat = polygon.reduce((sum, pt) => sum + pt[0], 0) / polygon.length;
        const centerLng = polygon.reduce((sum, pt) => sum + pt[1], 0) / polygon.length;

        // Assign random crop for now, as OSM doesn't always specify crop type
        const crop = CROP_TYPES[cropKeys[Math.floor(Math.random() * cropKeys.length)]];
        const stress = STRESS_LEVELS[stressKeys[Math.floor(Math.random() * stressKeys.length)]];
        
        let advisory;
        if (stress === STRESS_LEVELS.LOW) advisory = ADVISORY_STATUS.OPTIMAL;
        else if (stress === STRESS_LEVELS.MODERATE) advisory = ADVISORY_STATUS.IRRIGATE_SOON;
        else advisory = ADVISORY_STATUS.CRITICAL;

        fields.push({
          id: `osm-${element.id}`,
          name: `Field ${element.id}`,
          region: 'Local Farm',
          crop,
          stress,
          advisory,
          stage: 'Vegetative',
          area: 'N/A', 
          polygon,
          center: [centerLat, centerLng]
        });
      }
    });
    return fields;
  } catch (error) {
    console.error("Error fetching OSM data", error);
    return [];
  }
}

export async function fetchWeatherData(lat, lng) {
  // Fetch real historical weather and soil moisture for the last 12 weeks (84 days)
  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${getPastDate(84)}&end_date=${getPastDate(0)}&daily=precipitation_sum,soil_moisture_0_to_7cm&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.daily) throw new Error("Invalid weather data");

    const timeSeries = [];
    const daily = data.daily;

    // Aggregate into 12 weekly data points
    for (let week = 0; week < 12; week++) {
      let weeklyRain = 0;
      let weeklySoilMoisture = 0;

      for (let day = 0; day < 7; day++) {
        const idx = week * 7 + day;
        weeklyRain += daily.precipitation_sum[idx] || 0;
        weeklySoilMoisture += daily.soil_moisture_0_to_7cm[idx] || 0.2;
      }
      weeklySoilMoisture /= 7; // average soil moisture

      // Simulate NDVI based on real soil moisture
      let ndvi = weeklySoilMoisture * 2.5; // arbitrary scaling for demo
      ndvi = Math.max(0.1, Math.min(0.9, ndvi));

      let ndwi = (weeklySoilMoisture - 0.2) * 2;
      ndwi = Math.max(-0.5, Math.min(0.5, ndwi));

      let deficit = Math.max(0, 20 - weeklyRain); // simple deficit calc

      timeSeries.push({
        week: `W${week + 1}`,
        ndvi: ndvi.toFixed(2),
        ndwi: ndwi.toFixed(2),
        deficit: deficit.toFixed(1),
        rainfall: weeklyRain.toFixed(1)
      });
    }

    return timeSeries;
  } catch (error) {
    console.error("Error fetching weather", error);
    return null;
  }
}

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}
