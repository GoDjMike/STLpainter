import { PaintColor } from '../../types';

interface Props {
  colors: PaintColor[];
  onSelectColor: (color: PaintColor) => void;
}

export function ColorList({ colors, onSelectColor }: Props) {
  return (
    <div className="max-h-96 overflow-y-auto">
      {colors.map((color, i) => (
        <button
          key={i}
          className="flex items-center gap-2 w-full p-2 hover:bg-gray-100"
          onClick={() => onSelectColor(color)}
        >
          <div 
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: color.hex }}
          />
          <div className="text-left">
            <div className="text-sm font-medium">{color.name}</div>
            <div className="text-xs text-gray-500">{color.brand}</div>
          </div>
        </button>
      ))}
    </div>
  );
}