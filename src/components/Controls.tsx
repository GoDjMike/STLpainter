import { Brush, Grid } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Controls() {
  const { mode, setMode, currentModel } = useStore();
  
  if (!currentModel) return null;
  
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        className={`p-2 rounded ${mode === 'segment' ? 'bg-blue-500' : 'bg-gray-700'} hover:opacity-90 transition-opacity`}
        onClick={() => setMode('segment')}
        title="Segment Mode"
      >
        <Grid className="w-6 h-6 text-white" />
      </button>
      <button
        className={`p-2 rounded ${mode === 'paint' ? 'bg-blue-500' : 'bg-gray-700'} hover:opacity-90 transition-opacity`}
        onClick={() => setMode('paint')}
        title="Paint Mode"
      >
        <Brush className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}