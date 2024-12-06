import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { ModelGeometry } from './ModelGeometry';
import { StlService } from '../../services/StlService';

interface ModelContentProps {
  base64Data: string;
}

export function ModelContent({ base64Data }: ModelContentProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const { 
    mode, 
    activeSegment, 
    segments, 
    selectedColor,
    setActiveSegment, 
    addFaceToSegment, 
    updateSegmentColor 
  } = useStore();
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  // Throttle pointer move events
  const lastMove = useRef<number>(0);
  const moveThreshold = 100;

  const geometry = useMemo(() => {
    if (!base64Data) return null;
    try {
      const newGeometry = StlService.base64ToGeometrySync(base64Data);
      geometryRef.current = newGeometry;
      return newGeometry;
    } catch (error) {
      console.error('Failed to load geometry:', error);
      return null;
    }
  }, [base64Data]);

  useEffect(() => {
    return () => {
      if (geometryRef.current) {
        StlService.disposeGeometry(geometryRef.current);
        geometryRef.current = null;
      }
    };
  }, [base64Data]);

  const handlePointerMove = useCallback((event: any) => {
    if (!event.face) return;
    
    const now = Date.now();
    if (now - lastMove.current < moveThreshold) return;
    lastMove.current = now;
    
    event.stopPropagation();
    const faceIndex = Math.floor(event.faceIndex / 3);
    setHoveredFace(faceIndex);
  }, []);

  const handleClick = useCallback((event: any) => {
    if (!event.face) return;
    event.stopPropagation();
    const faceIndex = Math.floor(event.faceIndex / 3);
    
    if (mode === 'segment') {
      if (!activeSegment) {
        const newSegmentId = `segment-${Date.now()}`;
        setActiveSegment(newSegmentId);
        addFaceToSegment(newSegmentId, faceIndex);
      } else {
        addFaceToSegment(activeSegment, faceIndex);
      }
    } else if (mode === 'paint' && selectedColor) {
      // Find which segment this face belongs to
      const segment = segments.find(seg => seg.faces.includes(faceIndex));
      if (segment) {
        updateSegmentColor(segment.id, selectedColor);
      }
    }
  }, [mode, activeSegment, segments, selectedColor, setActiveSegment, addFaceToSegment, updateSegmentColor]);

  if (!geometry) return null;

  return (
    <mesh
      ref={mesh}
      onPointerMove={handlePointerMove}
      onPointerOut={() => setHoveredFace(null)}
      onClick={handleClick}
    >
      <ModelGeometry
        geometry={geometry}
        hoveredFace={hoveredFace}
        segments={segments}
        mode={mode}
      />
    </mesh>
  );
}