import { create } from 'zustand';
import { Segment } from '../types';

interface State {
  segments: Segment[];
  activeSegment: string | null;
  mode: 'segment' | 'paint';
  currentModel: string | null;
  selectedColor: string | null;
  setSegments: (segments: Segment[]) => void;
  setActiveSegment: (id: string | null) => void;
  setMode: (mode: 'segment' | 'paint') => void;
  addFaceToSegment: (segmentId: string, faceIndex: number) => void;
  updateSegmentColor: (segmentId: string, color: string) => void;
  setCurrentModel: (modelData: string | null) => void;
  setSelectedColor: (color: string | null) => void;
}

export const useStore = create<State>((set) => ({
  segments: [],
  activeSegment: null,
  mode: 'segment',
  currentModel: null,
  selectedColor: null,
  
  setSegments: (segments) => set({ segments }),
  setActiveSegment: (id) => set({ activeSegment: id }),
  setMode: (mode) => set({ mode }),
  setCurrentModel: (modelData) => set({ currentModel: modelData }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  
  addFaceToSegment: (segmentId, faceIndex) => 
    set((state) => {
      const existingSegment = state.segments.find(s => s.id === segmentId);
      
      if (existingSegment) {
        return {
          segments: state.segments.map(seg =>
            seg.id === segmentId
              ? { ...seg, faces: [...new Set([...seg.faces, faceIndex])] }
              : seg
          )
        };
      } else {
        return {
          segments: [
            ...state.segments,
            {
              id: segmentId,
              name: `Segment ${state.segments.length + 1}`,
              color: '#ddd',
              faces: [faceIndex]
            }
          ]
        };
      }
    }),
    
  updateSegmentColor: (segmentId, color) => 
    set((state) => ({
      segments: state.segments.map(seg =>
        seg.id === segmentId ? { ...seg, color } : seg
      )
    }))
}));