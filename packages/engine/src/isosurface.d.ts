declare module "isosurface" {
  function surfaceNets(
    dims: [number, number, number],
    potential: (x: number, y: number, z: number) => number,
    bounds: [number, number, number][]
  ): {
    positions: number[][];
    cells: any[][];
  };
}
