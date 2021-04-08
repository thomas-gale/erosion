# erosion

🚜 particle physics based erosion game

## plan (in no particular order)

- learn https://www.babylonjs.com/ or I might just stick with tried and tested https://threejs.org/) or this library looks great: https://github.com/tim-soft/react-particles-webgl
- make some arty stuff in https://www.aseprite.org/
- build the core physics mechanic in https://github.com/taichi-dev/taichi and it's wonderful mpm 'elements' library https://github.com/taichi-dev/taichi_elements
- compile the core physics mechanic to CPU WASM https://taichi.readthedocs.io/en/stable/export_kernels.html (in the future maybe help taichi support compiling to the shiny new https://gpuweb.github.io/gpuweb/ spec)
- make this stack into a game that's somewhat fun...

## emscripten notes

### build

```
mkdir build-engine && cd build-engine
emcmake cmake ../src-engine/
make
```

## taichihub notes

- Added the whole of taichi.js while I figure out which parts are needed to compile to the underlying engine.
- Managed to get the fractal and mpm demos working inside the browser/hub method.

### Commands

```bash
cd taichi.js
docker build . -t taichihub
cd taichihub
python3.8 -m flask run -h 0.0.0.0 -p 3001
```

## cd notes

act github actions uses `.secrets` file

## cra template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
