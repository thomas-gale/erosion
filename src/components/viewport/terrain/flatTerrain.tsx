import useGenerateTerrain from "../../../hooks/terrain/useGenerateTerrain";

export const FlatTerrain = () => {
  useGenerateTerrain();
  return (
    <mesh>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
};
