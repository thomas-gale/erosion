declare module "isosurface" {
  function surfaceNets(
    size: [number, number, number],
    func: (x: number, y: number, z: number) => number,
    bounds: [number, number, number][]
  ): {
    vertices: number[];
    indices: number[];
    normals: number[];
  };
}
