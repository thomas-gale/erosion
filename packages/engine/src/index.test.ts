import { CreateEngine } from "./index";

test("creates engine", () => {
  const engine = CreateEngine();
  expect(engine.quadTree).toBe("New Engine Quadtree :)");
});
