import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { BrandSelector } from './color-picker/BrandSelector';
import { SearchInput } from './color-picker/SearchInput';
import { ColorList } from './color-picker/ColorList';
import { paintData } from '../data/paints';

export function ColorPicker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const { setSelectedColor } = useStore();
  
  const filteredColors = useMemo(() => 
    paintData.filter(color => 
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedBrand === 'All Brands' || color.brand === selectedBrand)
    ),
    [searchTerm, selectedBrand]
  );

  const brands = useMemo(() => 
    ['All Brands', ...new Set(paintData.map(color => color.brand))],
    []
  );

  return (
    <div className="absolute left-4 top-4 w-64 bg-white rounded-lg shadow-lg p-4">
      <BrandSelector
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />
      
      <div className="my-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <ColorList
        colors={filteredColors}
        onSelectColor={(color) => setSelectedColor(color.hex)}
      />
    </div>
  );
}