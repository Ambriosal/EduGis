import React from 'react';

interface RegionFilterProps {
  regions: string[];
  selectedRegions: string[];
  onChange: (selected: string[]) => void;
}

export default function RegionFilter({ regions, selectedRegions, onChange }: RegionFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(values);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      <label>
        <strong>Filter by Region:</strong>
      </label>
      <br />
      <select multiple value={selectedRegions} onChange={handleChange} style={{ width: '200px', height: '120px' }}>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}
