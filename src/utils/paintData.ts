import { PaintColor } from '../types';

// Convert the CSV data into a structured format
export function processPaintData(csvData: string): PaintColor[] {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const brandIndex = headers.indexOf('New Citadel');
  const hexIndex = headers.indexOf('Hex Code');
  
  return lines.slice(1)
    .map(line => {
      const columns = line.split(',');
      const name = columns[brandIndex]?.trim();
      const hex = columns[hexIndex]?.trim();
      
      if (!name || !hex || name === '') return null;
      
      return {
        name,
        hex: `#${hex}`,
        brand: 'Citadel'
      };
    })
    .filter((color): color is PaintColor => color !== null);
}