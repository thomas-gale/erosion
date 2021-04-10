import { useEffect, useState } from "react";

export const Engine = (): JSX.Element => {
  const [mod, setMod] = useState<undefined | any>(undefined);

  useEffect(() => {
    var factory: any = require("./engine");
    factory().then((i: any) => {
      setMod(i);
    });
  }, [setMod]);

  return (
    <div>
      <h2>Module: { mod }</h2>
      <canvas id="canvas"></canvas>
    </div>
  );
};
