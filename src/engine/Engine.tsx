import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((_) => ({
  canvas: {
    width: '100%',
    height: '100%',
  },
}));

export const Engine = (): JSX.Element => {
  const classes = useStyles();
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
    });
  }, [setMod]);

  return <canvas ref={canvasRef} className={classes.canvas} id="canvas" />;
};
