import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { createNoise3D } from 'simplex-noise';

// Custom seeded random to keep noise deterministic but animated
const seed = () => 0.42; 
const noise3D = createNoise3D(seed);

const SimplexLayer = ({ activeLayer, isHeatmapMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!isHeatmapMode) return;

    let timeOffset = 0;
    let animationFrame;

    const CustomGridLayer = L.GridLayer.extend({
      createTile: function (coords) {
        const tile = L.DomUtil.create('canvas', 'leaflet-tile');
        const size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        
        const ctx = tile.getContext('2d');
        const imgData = ctx.createImageData(size.x, size.y);
        const data = imgData.data;
        
        const baseScale = 0.005;
        const scale = baseScale * Math.pow(2, 6 - coords.z); 
        
        for (let x = 0; x < size.x; x++) {
          for (let y = 0; y < size.y; y++) {
            const globalX = coords.x * size.x + x;
            const globalY = coords.y * size.y + y;
            
            // 3D Noise where the Z axis is TIME! This creates a flowing weather animation.
            let n = noise3D(globalX * scale, globalY * scale, timeOffset) * 0.5 + 0.5;
            n += (noise3D(globalX * scale * 2, globalY * scale * 2, timeOffset * 1.5) * 0.5 + 0.5) * 0.5;
            n += (noise3D(globalX * scale * 4, globalY * scale * 4, timeOffset * 2.0) * 0.5 + 0.5) * 0.25;
            
            n = n / 1.75; 
            
            let r=0, g=0, b=0, a=0;
            const threshold = 0.40; // Lowered threshold for better coverage
            
            if (n > threshold) {
              const intensity = Math.min(1, (n - threshold) / (1 - threshold));
              
              if (activeLayer === 'stress') {
                // Moisture Stress: Green -> Yellow -> Red
                if (intensity < 0.5) {
                  r = Math.floor(intensity * 2 * 255);
                  g = 255;
                  b = 0;
                } else {
                  r = 255;
                  g = Math.floor((1 - (intensity - 0.5) * 2) * 255);
                  b = 0;
                }
              } else if (activeLayer === 'advisory') {
                // Irrigation Advisory: Orange / Red for critical areas
                r = 255;
                g = Math.floor(165 * (1 - intensity));
                b = 0;
              } else {
                // Crop / Moisture map (Blue / Cyan / White)
                r = Math.floor(intensity * 100);
                g = Math.floor(intensity * 150 + 100);
                b = 255;
              }
              
              const alphaRamp = Math.min(1, intensity * 2.5);
              a = Math.floor(alphaRamp * 180); 
            }
            
            const index = (y * size.x + x) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        return tile;
      }
    });

    const layerInstance = new CustomGridLayer({ opacity: 0.7, updateWhenIdle: false, keepBuffer: 2 });
    layerInstance.addTo(map);

    // Animation Loop
    let lastDrawTime = Date.now();
    const animate = () => {
      const now = Date.now();
      // Only redraw tiles every 150ms to save CPU, but advance time to create animation
      if (now - lastDrawTime > 150) {
        timeOffset += 0.015; // Speed of the weather movement
        
        // Redraw all visible tiles
        for (const key in layerInstance._tiles) {
          const tile = layerInstance._tiles[key];
          if (tile.current && tile.el) {
            // Re-render the canvas
            const coords = layerInstance._keyToTileCoords(key);
            const newTile = layerInstance.createTile(coords, () => {});
            const ctx = tile.el.getContext('2d');
            ctx.clearRect(0, 0, tile.el.width, tile.el.height);
            ctx.drawImage(newTile, 0, 0);
          }
        }
        lastDrawTime = now;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      map.removeLayer(layerInstance);
    };
  }, [activeLayer, isHeatmapMode, map]);

  return null;
};

export default SimplexLayer;
