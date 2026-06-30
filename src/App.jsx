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
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        activeLayer={activeLayer} 
        setActiveLayer={setActiveLayer}
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
        isHeatmapMode={isHeatmapMode}
      />
      
      <AnalyticsDashboard 
        field={selectedField} 
        region={selectedRegion}
        drawnFields={drawnFields}
        onClose={() => {
          setSelectedField(null);
          setSelectedRegion(null);
          setDrawnFields(null);
        }} 
      />
    </div>
  );
}

export default App;
