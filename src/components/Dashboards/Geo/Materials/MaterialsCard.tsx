import React from 'react';
import { TestTubes, X } from 'lucide-react';
import { Material } from '../../../../types/report';

interface MaterialsCardProps {
  materials: Material[];
  selectedMaterials: Set<string>;
  onMaterialSelect: (id: string) => void;
  onMaterialDeselect: (id: string) => void;
  onClearSelection: () => void;
}

export function MaterialsCard({ 
  materials, 
  selectedMaterials, 
  onMaterialSelect, 
  onMaterialDeselect,
  onClearSelection 
}: MaterialsCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TestTubes className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-medium text-brand-secondary">Materials</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">
            {selectedMaterials.size} of {materials.length} selected
          </span>
          {selectedMaterials.size > 0 && (
            <button
              onClick={onClearSelection}
              className="text-xs text-text-muted hover:text-brand-secondary transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {materials.map((material) => {
          const isSelected = selectedMaterials.has(material.id);
          return (
            <button
              key={material.id}
              onClick={() => isSelected ? onMaterialDeselect(material.id) : onMaterialSelect(material.id)}
              className="p-2 text-xs rounded transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: isSelected ? `${material.color}20` : 'rgba(55, 65, 81, 0.5)',
                color: isSelected ? material.color : '#9CA3AF',
                borderWidth: 1,
                borderColor: isSelected ? material.color : 'transparent'
              }}
            >
              <span className="font-medium">{material.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}