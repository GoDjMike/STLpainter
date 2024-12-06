import { useState } from 'react';
import { StlService } from '../services/StlService';
import { useStore } from '../store/useStore';

interface UseStlUploadResult {
  isLoading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
}

export function useStlUpload(): UseStlUploadResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentModel, segments } = useStore();

  const uploadFile = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate file
      StlService.validateFile(file);

      // Check for unsaved work
      if (segments.length > 0) {
        const confirm = window.confirm(
          'Loading a new model will clear your current work. Do you want to continue?'
        );
        if (!confirm) return;
      }

      // Convert to Base64
      const base64 = await StlService.fileToBase64(file);
      
      // Update store
      setCurrentModel(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, uploadFile };
}