import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PaintBrand } from '../../types';

interface Props {
  brands: PaintBrand[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export function BrandSelector({ brands, selectedBrand, onSelectBrand }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between p-2 border rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedBrand}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded shadow-lg">
          {brands.map(brand => (
            <button
              key={brand.name}
              className="w-full p-2 text-left hover:bg-gray-100"
              onClick={() => {
                onSelectBrand(brand.name);
                setIsOpen(false);
              }}
            >
              {brand.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}