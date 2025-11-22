import React from 'react';

interface CompareFacilityTypeFilterProps {
  types: string[];
  selectedTypes: string[];
  onChange: (selected: string[]) => void;
}

export default function CompareFacilityTypeFilter({ types, selectedTypes, onChange }: CompareFacilityTypeFilterProps) {
  const handleToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === types.length) {
      onChange([]);
    } else {
      onChange([...types]);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 260,
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
          <strong>Filter by Type:</strong>
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
          {selectedTypes.length === types.length ? 'Clear All' : 'Select All'}
        </button>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {types.map((type) => (
          <div key={type} style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleToggle(type)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              <span>{type}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
