import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Polygon, Popup, useMap, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import './leaflet-setup';
import 'leaflet/dist/leaflet.css';
import { CROP_TYPES, STRESS_LEVELS, ADVISORY_STATUS } from '../data/mockData';
import { fetchRealFields } from '../apiService';
import SimplexLayer from './SimplexLayer';

// Component to handle map interactions like zooming to fields
const MapController = ({ selectedField, selectedRegion }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (selectedField) {
      const bounds = selectedField.polygon;
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (selectedRegion) {
      map.flyTo([selectedRegion.lat, selectedRegion.lng], 5, { duration: 1.5 });
    } else {
      map.flyTo([20, 0], 3, { duration: 1.5 });
    }
  }, [selectedField, selectedRegion, map]);

  return null;
};

// Component to handle freeform drag-to-select area drawing
const DrawBoxControl = ({ drawnBounds, setDrawnFields, setDrawnBounds, setFields }) => {
  const map = useMap();
  const [bounds, setBounds] = React.useState(null);
  
  React.useEffect(() => {
    if (!drawnBounds) {
      setBounds(null);
    }
  }, [drawnBounds]);
  
  React.useEffect(() => {
    let startPoint = null;
    let panStart = null;
    
    const onMouseDown = (e) => {
      // Middle click to pan
      if (e.originalEvent.button === 1) {
        e.originalEvent.preventDefault();
        panStart = e.containerPoint;
        if (map.getContainer()) {
          map.getContainer().style.cursor = 'grabbing';
        }
        return;
      }
      // Shift + Left click to draw box
      if (e.originalEvent.shiftKey && e.originalEvent.button === 0) {
        map.dragging.disable();
        if (map.getContainer()) {
          map.getContainer().style.cursor = 'crosshair';
        }
        startPoint = e.latlng;
        setBounds([startPoint, startPoint]);
      }
    };
    
    const onMouseMove = (e) => {
      if (panStart) {
        const panEnd = e.containerPoint;
        const offset = [panStart.x - panEnd.x, panStart.y - panEnd.y];
        map.panBy(offset, { animate: false });
        panStart = panEnd;
        return;
      }
      if (!startPoint) return;
      setBounds([startPoint, e.latlng]);
    };
    
    const onMouseUp = (e) => {
      if (e.originalEvent.button === 1) {
        panStart = null;
        if (map.getContainer()) {
          map.getContainer().style.cursor = '';
        }
        return;
      }
      if (!startPoint) return;
      
      const endPoint = e.latlng;
      const finalBounds = L.latLngBounds(startPoint, endPoint);
      setBounds(finalBounds);
      if (setDrawnBounds) setDrawnBounds(finalBounds);
      startPoint = null;
      
      map.dragging.enable();
      if (map.getContainer()) {
        map.getContainer().style.cursor = '';
      }
      
      // Fetch real farmland polygons from OpenStreetMap Overpass API
      fetchRealFields(finalBounds).then(realFields => {
        if (realFields.length > 0) {
          setFields(prev => {
            // Keep existing fields that aren't OSM, add new OSM fields
            const nonOsmFields = prev.filter(f => !f.id.startsWith('osm-'));
            return [...nonOsmFields, ...realFields];
          });
          setDrawnFields(realFields);
        } else {
          setDrawnFields([]);
        }
      });
    };
    
    map.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);
    
    return () => {
      map.off('mousedown', onMouseDown);
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);
      map.dragging.enable();
      if (map.getContainer()) {
        map.getContainer().style.cursor = '';
      }
    };
  }, [map, setDrawnFields, setDrawnBounds]);
  
  if (bounds) {
    return <Rectangle bounds={bounds} pathOptions={{ color: '#3b82f6', weight: 2, fillOpacity: 0.2 }} />;
  }
  return null;
};

const MapContainer = ({ activeLayer, fields, setFields, selectedField, setSelectedField, selectedRegion, drawnBounds, setDrawnFields, setDrawnBounds, isHeatmapMode }) => {
  // Center to show a global view
  const center = [20, 0];

  const getFieldColor = (field) => {
    switch (activeLayer) {
      case 'crop':
        return field.crop.color;
      case 'stress':
        return field.stress.color;
      case 'advisory':
        return field.advisory.color;
      default:
        return '#3b82f6';
    }
  };

  const renderLegend = () => {
    let items = [];
    let title = '';

    if (activeLayer === 'crop') {
      title = 'Crop Types';
      items = Object.values(CROP_TYPES);
    } else if (activeLayer === 'stress') {
      title = 'Moisture Stress';
      items = Object.values(STRESS_LEVELS);
    } else if (activeLayer === 'advisory') {
      title = 'Irrigation Advisory';
      items = Object.values(ADVISORY_STATUS);
    }

    return (
      <div className="layer-legend glass">
        <h4 className="legend-title">{title}</h4>
        {items.map((item) => (
          <div key={item.id} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="map-area">
      <LeafletMap center={center} zoom={3} style={{ height: '100%', width: '100%' }}>
        {/* Light theme styled tile layer (using CartoDB Positron) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {!isHeatmapMode && fields.map((field) => (
          <Polygon
            key={field.id}
            positions={field.polygon}
            pathOptions={{
              fillColor: getFieldColor(field),
              fillOpacity: selectedField?.id === field.id ? 0.9 : 0.6,
              color: selectedField?.id === field.id ? '#ffffff' : getFieldColor(field),
              weight: selectedField?.id === field.id ? 3 : 1,
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold mb-1">{field.name}</h3>
                <p className="text-sm">Region: {field.region}</p>
                <p className="text-sm">Crop: {field.crop.name}</p>
                <p className="text-sm">Stage: {field.stage}</p>
                <button 
                  className="text-sm mt-3 py-1.5 px-3 rounded text-white font-semibold cursor-pointer w-full text-center transition-colors"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedField(field);
                  }}
                >
                  View Analytics
                </button>
              </div>
            </Popup>
          </Polygon>
        ))}

        <MapController selectedField={selectedField} selectedRegion={selectedRegion} />
        <DrawBoxControl drawnBounds={drawnBounds} setDrawnFields={setDrawnFields} setDrawnBounds={setDrawnBounds} setFields={setFields} />
        <SimplexLayer activeLayer={activeLayer} isHeatmapMode={isHeatmapMode} />
      </LeafletMap>
      
      {renderLegend()}
    </div>
  );
};

export default MapContainer;
