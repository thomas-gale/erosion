import { useEffect } from "react";
import { useAppDispatch } from "../state";
import { setGenerating, setOctree } from "../../state/terrain/terrainSlice";

const useGenerateTerrain = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const generate = async () => {
      dispatch(setGenerating(true));
      // Do some fancy things

      await new Promise((r) => setTimeout(r, 3000));

      // Perlin noise etc etc.

      dispatch(
        setOctree({
          node: "hello",
        })
      );
      dispatch(setGenerating(false));
    };
    generate();
  }, [dispatch]);
};

export default useGenerateTerrain;
