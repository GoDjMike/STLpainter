import { useMemo } from 'react';
import * as THREE from 'three';
import { Segment } from '../../types';

interface ModelGeometryProps {
  geometry: THREE.BufferGeometry;
  hoveredFace: number | null;
  segments: Segment[];
  mode: 'segment' | 'paint';
}

export function ModelGeometry({ geometry, hoveredFace, segments, mode }: ModelGeometryProps) {
  const colors = useMemo(() => {
    const colorArray = new Float32Array(geometry.attributes.position.count * 3);
    const defaultColor = new THREE.Color('#ddd');
    const hoverColor = new THREE.Color('#ff0000');
    const colorMap = new Map<number, THREE.Color>();

    // Pre-compute segment colors
    for (const segment of segments) {
      const segmentColor = new THREE.Color(segment.color);
      for (const face of segment.faces) {
        colorMap.set(face, segmentColor);
      }
    }

    // Batch color assignments
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const faceIndex = Math.floor(i / 3);
      let color = colorMap.get(faceIndex) || defaultColor;
      
      // Apply hover effect only in paint mode when hovering over a segmented face
      if (mode === 'paint' && faceIndex === hoveredFace && colorMap.has(faceIndex)) {
        color = hoverColor;
      } else if (mode === 'segment' && faceIndex === hoveredFace) {
        color = hoverColor;
      }

      const baseIndex = i * 3;
      colorArray[baseIndex] = color.r;
      colorArray[baseIndex + 1] = color.g;
      colorArray[baseIndex + 2] = color.b;
    }

    return colorArray;
  }, [geometry, hoveredFace, segments, mode]);

  const colorAttribute = useMemo(() => {
    return new THREE.Float32BufferAttribute(colors, 3);
  }, [colors]);

  return (
    <>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" {...geometry.attributes.position} />
        <bufferAttribute attach="attributes-normal" {...geometry.attributes.normal} />
        <bufferAttribute attach="attributes-color" {...colorAttribute} />
      </bufferGeometry>
      <meshStandardMaterial
        vertexColors
        wireframe={mode === 'segment'}
        side={THREE.DoubleSide}
        flatShading={mode === 'segment'}
      />
    </>
  );
}