export interface Engine {
  quadTree: string;
}

export const CreateEngine = (): Engine => {
  return {
    quadTree: "New Engine Quadtree :)",
  };
};
