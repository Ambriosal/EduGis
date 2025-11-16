import React from 'react';

interface FacilityTypeFilterProps {
  types: string[];
  selectedTypes: string[];
  onChange: (selected: string[]) => void;
}

export default function FacilityTypeFilter({ types, selectedTypes, onChange }: FacilityTypeFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(values);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 250, // Below region filter
        left: 20,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      <label>
        <strong>Filter by Facility Type:</strong>
      </label>
      <br />
      <select multiple value={selectedTypes} onChange={handleChange} style={{ width: '200px', height: '120px' }}>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
