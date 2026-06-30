import React from 'react';
import { Layers, Droplets, Map as MapIcon, Activity, MapPin, MousePointer2, ThermometerSun } from 'lucide-react';
import { AGRICULTURAL_HUBS } from '../data/mockData';

const Sidebar = ({ activeLayer, setActiveLayer, selectedRegion, setSelectedRegion, isDrawingMode, setIsDrawingMode, isHeatmapMode, setIsHeatmapMode }) => {
  const navItems = [
    { id: 'crop', label: 'Crop Type Map', icon: MapIcon },
    { id: 'stress', label: 'Moisture Stress', icon: Activity },
    { id: 'advisory', label: 'Irrigation Advisory', icon: Droplets },
  ];

  return (
    <div className="sidebar glass">
      <div className="logo-container">
        <Layers className="logo-icon" size={32} />
        <span className="logo-text">AgriSense AI</span>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between p-1 bg-slate-800 rounded-lg mb-4" style={{ border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setIsHeatmapMode(false)}
            className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${!isHeatmapMode ? 'bg-blue-600 text-white' : 'text-secondary hover:text-white'}`}
          >
            Fields
          </button>
          <button 
            onClick={() => setIsHeatmapMode(true)}
            className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-1 ${isHeatmapMode ? 'bg-blue-600 text-white' : 'text-secondary hover:text-white'}`}
          >
            <ThermometerSun size={14} /> Heatmap
          </button>
        </div>
      </div>

      <div className="nav-menu">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeLayer === item.id ? 'active' : ''}`}
            onClick={() => setActiveLayer(item.id)}
          >
            <item.icon size={20} />
            <span className="font-semibold">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 mb-4">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-secondary">
          <MapPin size={16} /> Select Region
        </h4>
        <select 
          className="region-select"
          value={selectedRegion?.name || ''}
          onChange={(e) => {
            const region = AGRICULTURAL_HUBS.find(h => h.name === e.target.value);
            setSelectedRegion(region || null);
          }}
        >
          <option value="">Global View</option>
          {AGRICULTURAL_HUBS.map(hub => (
            <option key={hub.name} value={hub.name}>{hub.name}</option>
          ))}
        </select>
        
        <div className="mt-4">
          <button 
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            className={`w-full p-2 flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${isDrawingMode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-secondary border border-slate-700 hover:text-white'}`}
            style={{ 
              backgroundColor: isDrawingMode ? 'var(--accent-primary)' : 'rgba(30,41,59,0.5)',
              borderColor: isDrawingMode ? 'var(--accent-primary)' : 'var(--border-color)',
              color: isDrawingMode ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <MousePointer2 size={16} />
            {isDrawingMode ? 'Cancel Drawing' : 'Draw Custom Region'}
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <p className="text-xs text-secondary mb-2">Prototype v1.0</p>
        <p className="text-xs text-secondary mb-2">
          <strong>Data Sourced from:</strong> Programme of the European Union - Copernicus: Europe's eyes on Earth - ESA (Simulated)
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Data simulated for 30-hour hackathon demonstration.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
