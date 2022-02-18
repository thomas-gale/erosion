import { Terrain } from "./terrain";

const TEST_SEED = 0;

test("creates terrain", () => {
  const terrainSampler = new Terrain();
  expect(terrainSampler).toBeDefined();
});

test("create terrain test sphere", () => {
  const terrainSampler = new Terrain(TEST_SEED);
  const testSphere = terrainSampler.generateTestSphere();
  expect(testSphere).toBeDefined();
});

test("load terrain chunk", () => {
  const terrainSampler = new Terrain(TEST_SEED);
  const testSphere = terrainSampler.loadChunk(0, 0, 0);
  expect(testSphere).toBeDefined();
});
