import { Upload } from 'lucide-react';
import { useStlUpload } from '../hooks/useStlUpload';

export function EmptyState() {
  const { uploadFile, isLoading, error } = useStlUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center p-8 rounded-lg bg-gray-800/50 backdrop-blur-sm">
        <div className="mb-4">
          <Upload className="w-16 h-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No STL File Loaded</h2>
        <p className="text-gray-400 mb-4">Upload a 3D model to get started</p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <label className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-wait' : ''}`}>
          <Upload className="w-5 h-5" />
          <span>{isLoading ? 'Loading...' : 'Choose STL File'}</span>
          <input
            type="file"
            accept=".stl"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
}