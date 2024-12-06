import { Download, Upload } from 'lucide-react';
import { useStlUpload } from '../hooks/useStlUpload';
import { useStore } from '../store/useStore';

export function FileActions() {
  const { currentModel, segments } = useStore();
  const { uploadFile, isLoading, error } = useStlUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDownload = () => {
    const data = {
      segments,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'miniature-segments.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentModel) return null;

  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      {error && (
        <div className="absolute -top-10 right-0 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm whitespace-nowrap">
          {error}
        </div>
      )}
      
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        title="Download Project"
      >
        <Download className="w-5 h-5" />
        <span>Save Project</span>
      </button>
      
      <label className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-wait' : ''}`}>
        <Upload className="w-5 h-5" />
        <span>{isLoading ? 'Loading...' : 'Load STL'}</span>
        <input
          type="file"
          accept=".stl"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
      </label>
    </div>
  );
}