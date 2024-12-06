export interface Segment {
  id: string;
  name: string;
  color: string;
  faces: number[];
}

export interface PaintColor {
  name: string;
  hex: string;
  brand: string;
}

export interface PaintBrand {
  name: string;
  colors?: PaintColor[];
}