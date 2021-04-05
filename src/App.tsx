import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [testI, setTestI] = useState<undefined | any>(undefined);

  const [fibIn, setFibIn] = useState(10);

  const [fibOut, setFibOut] = useState(0);
  useEffect(() => {
    var factory = require("./engine/engine");
    factory().then((i: any) => {
      var val = i.fib(fibIn);
      console.log("react fib: " + val);
      setFibOut(val);
      setTestI(i);
    });
  }, [fibIn, setFibOut]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>wasm fib input (capped to 40): {fibIn}</p>
        <input
          onChange={(val) => {
            let numVal = Number(val.target.value);
            if (numVal && numVal <= 40) {
              setFibIn(numVal);
            }
          }}
        />
        <p>wasm fib output: {fibOut}</p>
        <button
          type="button"
          onClick={(_: any) => {
            if (testI) testI.mpm88();
          }}
        >
          Load mpm88 wasm
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
