import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapContainer from './components/MapContainer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import './App.css';

function App() {
  const [activeLayer, setActiveLayer] = useState('crop'); // 'crop', 'stress', 'advisory'
  const [selectedField, setSelectedField] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnFields, setDrawnFields] = useState(null);
  const [drawnBounds, setDrawnBounds] = useState(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        activeLayer={activeLayer} 
        setActiveLayer={(layer) => {
          setActiveLayer(layer);
          if (layer !== 'stress') {
            setIsHeatmapMode(false);
          }
        }}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        isDrawingMode={isDrawingMode}
        setIsDrawingMode={setIsDrawingMode}
        isHeatmapMode={isHeatmapMode}
        setIsHeatmapMode={setIsHeatmapMode}
      />
      
      <MapContainer 
        activeLayer={activeLayer} 
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        selectedRegion={selectedRegion}
        isDrawingMode={isDrawingMode}
        setDrawnFields={setDrawnFields}
        setDrawnBounds={setDrawnBounds}
        isHeatmapMode={isHeatmapMode}
      />
      
      <AnalyticsDashboard 
        field={selectedField} 
        region={selectedRegion}
        drawnFields={drawnFields}
        drawnBounds={drawnBounds}
        onClose={() => {
          setSelectedField(null);
          setSelectedRegion(null);
          setDrawnFields(null);
          setDrawnBounds(null);
        }} 
      />
    </div>
  );
}

export default App;
