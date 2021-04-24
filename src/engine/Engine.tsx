import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((_) => ({
  canvas: {
    width: '100%',
    height: '100%',
  },
}));

export interface EngineModule {
  setGravity: (x: number, y: number) => void;
}

export interface EngineProps {
  setLoaded: (loaded: boolean) => void;
}

export const Engine = (props: EngineProps): JSX.Element => {
  const classes = useStyles();
  const { setLoaded } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMod] = useState<undefined | EngineModule>(undefined);
  const canvasRef = useRef(null);

  console.log('Engine loading...');
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires
    const factory: any = require('./engine');
    factory().then((engineMod: EngineModule) => {
      setMod(engineMod);
      console.log('Engine loaded!');
      engineMod.setGravity(4.0, 4.0);
      setLoaded(true);
    });
    setLoaded(false);
  }, [setMod]);

  return <canvas ref={canvasRef} className={classes.canvas} id="canvas" />;
};
