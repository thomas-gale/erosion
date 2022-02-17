import { Terrain } from "./terrain";

test("creates terrain", () => {
  const terrainSampler = new Terrain();
  expect(terrainSampler).toBeDefined();
});

test("sample terrain", () => {
  const terrainSampler = new Terrain(1234);
  expect(terrainSampler.sample(-0.5, 0, 0.5)).toBe(-0.32173333333333315);
});

test("create terrain test sphere", () => {
  const terrainSampler = new Terrain(1234);
  expect(terrainSampler.generateTestSphere()).toBeDefined();
});
