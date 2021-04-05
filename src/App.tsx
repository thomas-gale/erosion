import logo from "./logo.svg";
import "./App.css";
// import { pingIt } from "./index";
// import { useWasm } from "react-wasm";
// import { useEffect, useState } from "react";
// import test from './engine/test.js';
// import testwasm from './engine/test.wasm';
// import { useEffect } from "react";

function App() {
  // useEffect(() => {
  // const sample = test({
  //   locateFile: () => {
  //     return testwasm;
  //   }
  // });

  // sample.then((core: any) => {
  //   console.log("Lerp result: " + core.lerp(1.0, 2.0, 0.5))
  // })

  //   const path = process.env.PUBLIC_URL + "/engine/test.wasm";

  //   const importObject = {
  //     env: {
  //       memoryBase: 0,
  //       tableBase: 0,
  //       memory: new WebAssembly.Memory({ initial: 256, maximum: 1024 }),
  //       table: new WebAssembly.Table({ initial: 256, element: "anyfunc" }),
  //       __assert_fail: function () {
  //         // todo
  //       },
  //       emscripten_resize_heap: function () {
  //         // todo
  //       },
  //       emscripten_memcpy_big: function () {
  //         // todo
  //       },
  //       setTempRet0: function () {
  //         // todo
  //       },
  //       _embind_register_function: function () {
  //       },
  //       _embind_register_void: function () {
  //       },
  //       _embind_register_bool: function () {
  //       },
  //       _embind_register_float: function () {
  //       },
  //       _embind_register_integer: function () {
  //       },
  //       _embind_register_std_string: function () {
  //       },
  //       _embind_register_std_wstring: function () {
  //       },
  //       _embind_register_emval: function () {
  //       }
  //     },
  //   };

  //   console.log(importObject)

  //   WebAssembly.instantiateStreaming(fetch(path), importObject).then((obj) => {
  //     console.log(obj)
  //     // do stuff
  //   });
  // });

  // useEffect(() => {
  //   let engine = require("./engine/test.js");
  //   engine().then((e: any) => {
  //     console.log(e)
  //   });
  // });

  // const [ wasmStatus, setWasmStatus ] = useState('');

  // const { loading, error, data } = useWasm({
  //   url: "/test.wasm",
  // });

  // // if (loading) setWasmStatus("Loading...");
  // // if (error) setWasmStatus("An error has occurred");

  // const [ result, setResult ] = useState(0);

  // useEffect(() => {
  //   if (data != null) {
  //     setResult(data.instance.exports.int_sqrt(16));
  //   }
  // }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        {/* <div>Wasm Status: { wasmStatus }</div> */}
        {/* <div>root 16 = { result }</div> */}
        <img src={logo} className="App-logo" alt="logo" />
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
