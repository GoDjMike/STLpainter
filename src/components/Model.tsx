import { Suspense } from 'react';
import { useStore } from '../store/useStore';
import { ModelContent } from './model/ModelContent';
import { StlService } from '../services/StlService';

export function Model() {
  const currentModel = useStore(state => state.currentModel);

  if (!currentModel) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ModelContent base64Data={currentModel} />
    </Suspense>
  );
}