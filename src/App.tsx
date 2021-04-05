import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [fibIn, setFibIn] = useState(10);

  const [fibOut, setFibOut] = useState(0);
  useEffect(() => {
    var factory = require("./engine/test");
    factory().then((i: any) => {
      var val = i.fib(fibIn);
      console.log("react fib: " + val);
      setFibOut(val);
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
