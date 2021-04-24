import { useEffect } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((_) => ({
  canvas: {
    width: '100%',
    height: '100%',
  },
}));

export interface Engine {
  setGravity: (x: number, y: number) => void;
}

export interface EngineCanvasProps {
  setEngine: (engine: Engine) => void;
  setLoaded: (loaded: boolean) => void;
}

export const EngineCanvas = (props: EngineCanvasProps): JSX.Element => {
  const classes = useStyles();
  const { setLoaded, setEngine } = props;

  useEffect(() => {
    console.log('Engine loading...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires
    const factory: any = require('./engine');
    factory().then((engineMod: Engine) => {
      setEngine(engineMod);
      console.log('Engine loaded!');
      engineMod.setGravity(4.0, 4.0);
      setLoaded(true);
    });
    setLoaded(false);
  }, []);

  return <canvas className={classes.canvas} id="canvas" />;
};
