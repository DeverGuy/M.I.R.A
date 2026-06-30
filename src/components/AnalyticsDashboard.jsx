import React from 'react';
import { X, TrendingUp, Droplet, Sprout, MapPin } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';

const AnalyticsDashboard = ({ field, region, drawnFields, onClose }) => {
  if (!field && !region && drawnFields === null) return null;

  if (drawnFields !== null) {
    if (drawnFields.length === 0) {
      return (
        <div className="analytics-panel glass">
          <div className="panel-header">
            <div>
              <h2 className="text-xl font-bold">Custom Area</h2>
              <p className="text-sm text-secondary">0 fields selected</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="mt-4 p-4 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-secondary">No agricultural fields were found in the selected area.</p>
            <p className="text-sm text-secondary mt-2">Try drawing a box over the colored field markers on the map.</p>
          </div>
        </div>
      );
    }

    const totalArea = drawnFields.reduce((sum, f) => sum + parseFloat(f.area), 0).toFixed(1);
    
    const stressCounts = { low: 0, mod: 0, high: 0 };
    drawnFields.forEach(f => {
      if (f.stress.id === 'low') stressCounts.low++;
      else if (f.stress.id === 'mod') stressCounts.mod++;
      else if (f.stress.id === 'high') stressCounts.high++;
    });
    
    let dominantStress = 'Low Stress';
    let stressColor = '#10b981';
    if (stressCounts.high >= Math.max(stressCounts.low, stressCounts.mod)) {
      dominantStress = 'High Stress';
      stressColor = '#ef4444';
    } else if (stressCounts.mod >= Math.max(stressCounts.low, stressCounts.high)) {
      dominantStress = 'Moderate Stress';
      stressColor = '#f59e0b';
    }

    const cropCounts = {};
    drawnFields.forEach(f => {
      cropCounts[f.crop.name] = (cropCounts[f.crop.name] || 0) + 1;
    });
    const dominantCrop = Object.keys(cropCounts).length > 0 
      ? Object.keys(cropCounts).reduce((a, b) => cropCounts[a] > cropCounts[b] ? a : b)
      : 'None';

    return (
      <div className="analytics-panel glass">
        <div className="panel-header">
          <div>
            <h2 className="text-xl font-bold">Custom Area</h2>
            <p className="text-sm text-secondary">{drawnFields.length} fields selected</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Total Area</div>
            <div className="stat-value">{totalArea} ha</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Dominant Crop</div>
            <div className="stat-value" style={{ color: '#60a5fa' }}>{dominantCrop}</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <h4 className="font-semibold mb-2">Area Stress Overview</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Overall Status:</span>
            <span className="font-bold" style={{ color: stressColor }}>{dominantStress}</span>
          </div>
          <div className="text-xs text-secondary mt-2">
            Low: {stressCounts.low} | Mod: {stressCounts.mod} | High: {stressCounts.high}
          </div>
        </div>
      </div>
    );
  }

  if (!field && region) {
    return (
      <div className="analytics-panel glass">
        <div className="panel-header">
          <div>
            <h2 className="text-xl font-bold">{region.name}</h2>
            <p className="text-sm text-secondary">Regional Overview</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin size={16} /> Region Selected</h4>
          <p className="text-sm text-secondary mb-2">
            You are currently viewing the general agricultural area for {region.name}.
          </p>
          <p className="text-sm text-secondary text-blue-400">
            Click on any specific field (colored square) on the map within this region to view its precise 12-week time-series data and AI irrigation advisory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`analytics-panel glass ${field ? '' : 'hidden'}`}>
      <div className="panel-header">
        <div>
          <h2 className="text-xl font-bold">{field.name}</h2>
          <p className="text-sm text-secondary">{field.region} • {field.crop.name} • {field.area} ha</p>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Current Stage</div>
          <div className="stat-value flex items-center gap-2">
            <Sprout size={20} className="text-success" />
            {field.stage}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Stress Level</div>
          <div className="stat-value" style={{ color: field.stress.color }}>
            {field.stress.name}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">
          <TrendingUp size={16} />
          Vegetation Indices (NDVI / NDWI)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={field.timeSeries} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ndwi" name="NDWI" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">
          <Droplet size={16} />
          Crop Water Deficit & Rainfall
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={field.timeSeries} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="deficit" name="Water Deficit (mm)" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <h4 className="font-semibold mb-2">AI Advisory</h4>
        <p className="text-sm text-secondary">
          Based on the current water deficit and phenological stage, the system recommends: <strong style={{ color: field.advisory.color }}>{field.advisory.name}</strong>.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
