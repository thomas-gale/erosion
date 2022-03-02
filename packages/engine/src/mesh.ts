export interface Mesh {
  // Vertex Positions
  positions: number[][];
  // Vertex Metadata
  metadata: number[][];
  // Vertex Metadata Stride
  metadataStride: number;
  // Triangle Indices
  cells: number[][];
}
