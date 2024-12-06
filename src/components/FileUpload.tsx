import { Upload } from 'lucide-react';
import { useStore } from '../store/useStore';

export function FileUpload() {
  const { setCurrentModel } = useStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.stl')) {
      alert('Please upload an STL file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setCurrentModel(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute right-4 bottom-4">
      <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
        <Upload className="w-5 h-5" />
        <span>Upload STL</span>
        <input
          type="file"
          accept=".stl"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}