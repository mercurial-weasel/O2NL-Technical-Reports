import { useState } from 'react';

export function useMaterialSelection() {
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterials(prev => new Set(prev).add(materialId));
  };

  const handleMaterialDeselect = (materialId: string) => {
    setSelectedMaterials(prev => {
      const next = new Set(prev);
      next.delete(materialId);
      return next;
    });
  };

  const handleClearMaterialSelection = () => {
    setSelectedMaterials(new Set());
  };

  return {
    selectedMaterials,
    handleMaterialSelect,
    handleMaterialDeselect,
    handleClearMaterialSelection
  };
}