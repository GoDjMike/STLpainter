import { Viewer } from './components/Viewer';
import { Controls } from './components/Controls';
import { ColorPicker } from './components/ColorPicker';
import { FileActions } from './components/FileActions';
import { useStore } from './store/useStore';

export default function App() {
  const mode = useStore(state => state.mode);

  return (
    <div className="w-screen h-screen bg-gray-900 relative">
      <Viewer />
      <Controls />
      {mode === 'paint' && <ColorPicker />}
      <FileActions />
    </div>
  );
}