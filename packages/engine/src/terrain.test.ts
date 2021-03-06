import { Terrain } from "./terrain";

const TEST_SEED = 0;

test("creates terrain", () => {
  const terrainSampler = new Terrain();
  expect(terrainSampler).toBeDefined();
});

test("create sphere mesh", () => {
  const terrainSampler = new Terrain(TEST_SEED);
  const testSphere = terrainSampler.generateSphereMesh();
  expect(testSphere).toBeDefined();
});

test("load chunk mesh", () => {
  const terrainSampler = new Terrain(TEST_SEED);
  const testMesh = terrainSampler.loadMesh(-16, -16, -16, 16, 16, 16);
  expect(testMesh).toBeDefined();
});

test("deposit terrain", () => {
  const terrainSampler = new Terrain(TEST_SEED);
  terrainSampler.deposit(16, 16, 16);
  const testMesh = terrainSampler.loadMesh(0, 0, 0, 32, 32, 32);
  expect(testMesh).toBeDefined();
});
