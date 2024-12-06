import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Model } from './Model';
import { useStore } from '../store/useStore';
import { Suspense } from 'react';
import { EmptyState } from './EmptyState';

export function Viewer() {
  const { mode, currentModel } = useStore();
  
  if (!currentModel) {
    return <EmptyState />;
  }
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 2, 4],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <color attach="background" args={['#111827']} />
        <Suspense fallback={null}>
          <Stage
            environment="city"
            intensity={0.5}
            adjustCamera={false}
            preset="rembrandt"
          >
            <Model />
          </Stage>
          <OrbitControls 
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minDistance={2}
            maxDistance={20}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            panSpeed={0.8}
            screenSpacePanning={true}
          />
        </Suspense>
      </Canvas>
      
      {mode === 'segment' && (
        <div className="absolute bottom-4 left-4 text-sm text-white bg-black/50 p-2 rounded">
          Click to select areas for segmentation
        </div>
      )}
      {mode === 'paint' && (
        <div className="absolute bottom-4 left-4 text-sm text-white bg-black/50 p-2 rounded">
          Click on a segment to apply the selected color
        </div>
      )}
    </div>
  );
}