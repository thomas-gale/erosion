import useGenerateTerrain from "../../../hooks/terrain/useGenerateTerrain";

export const FlatTerrain = () => {
  useGenerateTerrain();
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};
