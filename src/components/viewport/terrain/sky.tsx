export const Sky = () => {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};
