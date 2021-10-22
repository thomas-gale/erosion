export const TestCube = () => {
  return (
    <mesh position={[0, 0, 0.5]}>
      <boxGeometry />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};
