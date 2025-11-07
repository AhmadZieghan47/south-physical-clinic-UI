import React from 'react';
import { COMMON_ENUM_TYPES } from '../../../../types/enumLabel';

interface EnumTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  customTypes?: string[];
}

/**
 * Component for selecting enum types
 * Shows common types as tabs and allows selecting custom types
 */
const EnumTypeSelector: React.FC<EnumTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  customTypes = []
}) => {
  const allTypes = [
    { value: '', label: 'All Types', color: '#6B7280' },
    ...COMMON_ENUM_TYPES,
    ...customTypes.map(type => ({ value: type, label: type, color: '#6B7280' }))
  ];

  return (
    <div className="enum-type-selector mb-3">
      <div className="btn-group btn-group-sm" role="group" aria-label="Enum type filter">
        {allTypes.map(type => (
          <button
            key={type.value}
            type="button"
            className={`btn ${selectedType === type.value ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onTypeChange(type.value)}
            style={selectedType === type.value ? { backgroundColor: type.color, borderColor: type.color } : {}}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnumTypeSelector;





