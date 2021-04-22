import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((_) => ({
  canvas: {
    width: '100%',
    height: '100%',
  },
}));

export interface EngineProps {
  setLoaded: (loaded: boolean) => void;
}

export const Engine = (props: EngineProps): JSX.Element => {
  const classes = useStyles();
  const { setLoaded } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [_, setMod] = useState<undefined | any>(undefined);
  const canvasRef = useRef(null);

  console.log('Engine loading...');
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires
    const factory: any = require('./engine');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    factory().then((i: any) => {
      setMod(i);
      console.log('Engine loaded!');
      setLoaded(true);
    });
    setLoaded(false);
  }, [setMod]);

  return <canvas ref={canvasRef} className={classes.canvas} id="canvas" />;
};
