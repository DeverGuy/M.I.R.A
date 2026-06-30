import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Polygon, Popup, useMap, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import './leaflet-setup';
import 'leaflet/dist/leaflet.css';
import { mockFields, CROP_TYPES, STRESS_LEVELS, ADVISORY_STATUS } from '../data/mockData';
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
const DrawBoxControl = ({ isDrawingMode, setDrawnFields }) => {
  const map = useMap();
  const [bounds, setBounds] = React.useState(null);
  
  React.useEffect(() => {
    if (!isDrawingMode) {
      setBounds(null);
      setDrawnFields([]);
      map.dragging.enable();
      if (map.getContainer()) {
        map.getContainer().style.cursor = '';
      }
      return;
    }
    
    map.dragging.disable();
    if (map.getContainer()) {
      map.getContainer().style.cursor = 'crosshair';
    }
    
    let startPoint = null;
    
    const onMouseDown = (e) => {
      startPoint = e.latlng;
      setBounds([startPoint, startPoint]);
    };
    
    const onMouseMove = (e) => {
      if (!startPoint) return;
      setBounds([startPoint, e.latlng]);
    };
    
    const onMouseUp = (e) => {
      if (!startPoint) return;
      const endPoint = e.latlng;
      const finalBounds = L.latLngBounds(startPoint, endPoint);
      setBounds(finalBounds);
      startPoint = null;
      
      // Calculate intersections with mockFields
      const intersectedFields = mockFields.filter(field => {
        // Check if the field's center/first point is inside the drawn bounds
        const pt = L.latLng(field.polygon[0][0], field.polygon[0][1]);
        return finalBounds.contains(pt);
      });
      setDrawnFields(intersectedFields);
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
  }, [isDrawingMode, map, setDrawnFields]);
  
  if (bounds) {
    return <Rectangle bounds={bounds} pathOptions={{ color: '#3b82f6', weight: 2, fillOpacity: 0.2 }} />;
  }
  return null;
};

const MapContainer = ({ activeLayer, selectedField, setSelectedField, selectedRegion, isDrawingMode, setDrawnFields, isHeatmapMode }) => {
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
        {/* Dark theme styled tile layer (using CartoDB Dark Matter) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {!isHeatmapMode && mockFields.map((field) => (
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
        <DrawBoxControl isDrawingMode={isDrawingMode} setDrawnFields={setDrawnFields} />
        <SimplexLayer activeLayer={activeLayer} isHeatmapMode={isHeatmapMode} />
      </LeafletMap>
      
      {renderLegend()}
    </div>
  );
};

export default MapContainer;
