import { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  canvas: {
    width: "100%",
    height: "100%",
  },
}));

export const Engine = (): JSX.Element => {
  const classes = useStyles();
  const [mod, setMod] = useState<undefined | any>(undefined);
  const canvasRef = useRef(null);

  console.log("Engine loading...");
  useEffect(() => {
    var factory: any = require("./engine");
    factory().then((i: any) => {
      setMod(i);
      console.log("Engine loaded!");
    });
  }, [setMod]);

  return (
    <canvas ref={canvasRef} className={classes.canvas} id="canvas"/>
  );
};
