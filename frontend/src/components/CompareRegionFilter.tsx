import React from 'react';

interface CompareRegionFilterProps {
  regions: string[];
  selectedRegions: string[];
  onChange: (selected: string[]) => void;
}

export default function CompareRegionFilter({ regions, selectedRegions, onChange }: CompareRegionFilterProps) {
  const handleToggle = (region: string) => {
    if (selectedRegions.includes(region)) {
      onChange(selectedRegions.filter((r) => r !== region));
    } else {
      onChange([...selectedRegions, region]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRegions.length === regions.length) {
      onChange([]);
    } else {
      onChange([...regions]);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1000,
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: '220px',
      }}
    >
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>
          <strong>Filter by Province:</strong>
        </label>
        <button
          onClick={handleSelectAll}
          style={{
            fontSize: '11px',
            padding: '4px 8px',
            cursor: 'pointer',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
          }}
        >
          {selectedRegions.length === regions.length ? 'Clear All' : 'Select All'}
        </button>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {regions.map((region) => (
          <div key={region} style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => handleToggle(region)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              <span>{region}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
