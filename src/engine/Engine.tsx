import { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "1rem -1rem 1rem -1rem"
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

  return <canvas className={classes.container} ref={canvasRef} id="canvas"></canvas>;
};
