import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export class StlService {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly VALID_MIME_TYPES = ['model/stl', 'application/octet-stream'];
  private static loader = new STLLoader();

  static validateFile(file: File): boolean {
    if (!file.name.toLowerCase().endsWith('.stl')) {
      throw new Error('Invalid file type. Please upload an STL file.');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File is too large. Maximum size is 50MB.');
    }

    return true;
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static base64ToGeometrySync(base64: string): THREE.BufferGeometry {
    try {
      // Extract the base64 data
      const base64Data = base64.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid base64 data');
      }

      // Convert base64 to binary
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Parse STL
      const geometry = this.loader.parse(bytes.buffer);
      
      // Optimize geometry
      return this.optimizeGeometry(geometry);
    } catch (error) {
      console.error('Failed to parse STL file:', error);
      throw new Error('Failed to parse STL file');
    }
  }

  static optimizeGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    try {
      // Create a copy of the geometry to avoid modifying the original
      const workingGeometry = geometry.clone();

      // Merge vertices within a small threshold to reduce vertex count
      const mergedGeometry = BufferGeometryUtils.mergeVertices(workingGeometry, 0.001);
      
      // Compute vertex normals for better lighting
      mergedGeometry.computeVertexNormals();
      
      // Center the geometry
      mergedGeometry.center();
      
      // Calculate bounding box
      const box = new THREE.Box3().setFromBufferAttribute(mergedGeometry.attributes.position);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Scale to reasonable size
      const scale = 2 / maxDim;
      mergedGeometry.scale(scale, scale, scale);

      // Rotate to stand upright if needed
      if (size.y < size.z) {
        mergedGeometry.rotateX(-Math.PI / 2);
      }

      // Ensure model is oriented correctly
      const matrix = new THREE.Matrix4();
      matrix.makeRotationY(Math.PI); // Rotate 180 degrees around Y axis
      mergedGeometry.applyMatrix4(matrix);

      // Optimize buffers
      mergedGeometry.attributes.position.needsUpdate = true;
      if (mergedGeometry.attributes.normal) {
        mergedGeometry.attributes.normal.needsUpdate = true;
      }

      // Dispose of intermediate geometries
      workingGeometry.dispose();
      
      return mergedGeometry;
    } catch (error) {
      console.error('Failed to optimize geometry:', error);
      throw error;
    }
  }

  static disposeGeometry(geometry: THREE.BufferGeometry): void {
    if (geometry.dispose) {
      geometry.dispose();
    }
  }
}