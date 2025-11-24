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
        <span style={{ fontWeight: 600, fontSize: '15px' }}>Filter by Type</span>

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
          {selectedTypes.length === types.length ? 'Clear All' : 'Select All'}
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {types.map((type) => (
          <label
            key={type}
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
              checked={selectedTypes.includes(type)}
              onChange={() => handleToggle(type)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
}
