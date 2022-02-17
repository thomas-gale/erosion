export const TestCube = () => {
  return (
    <mesh position={[5, 0, 0.5]}>
      <boxGeometry />
      <meshStandardMaterial wireframe color={"orange"} />
    </mesh>
  );
};
