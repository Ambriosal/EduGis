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
        background: '#ffffff',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        width: '240px',
        marginBottom: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '15px' }}>Filter by Province</span>

        <button
          onClick={handleSelectAll}
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            cursor: 'pointer',
            background: '#f1f5f9',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
          }}
        >
          {selectedRegions.length === regions.length ? 'Clear All' : 'Select All'}
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {regions.map((region) => (
          <label
            key={region}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <input
              type="checkbox"
              checked={selectedRegions.includes(region)}
              onChange={() => handleToggle(region)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            {region}
          </label>
        ))}
      </div>
    </div>
  );
}
