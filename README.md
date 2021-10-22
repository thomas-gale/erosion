# erosion
[![build](https://github.com/thomas-gale/erosion/actions/workflows/build.yml/badge.svg)](https://github.com/thomas-gale/erosion/actions/workflows/build.yml)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

🚜👷 mining and erosion game

## plan
- inspired by motherlode, factorio.
- hack around trying stuff.

## current implementation stack
- [next.js](https://nextjs.org/)
- [mui](https://material-ui.com/)

## running
```
yarn
yarn dev
```

## emscripten notes

### build

```
./scripts/build-engine.sh
```

### debugging (using chrome)
```
./scripts/debug-serve.sh
chrome --remote-debugging-port=9222 http://localhost:3000/build/Debug/bin/engine.html
```
- vscode debug `attach chrome against source mapped host`

## taichihub notes

- Added the whole of taichi.js while I figure out which parts are needed to compile to the underlying engine.
- Managed to get the fractal and mpm demos working inside the browser/hub method.

### Commands

```bash
cd engine/taichi.js
sudo docker build . -t taichihub
cd taichihub
python3.8 -m flask run -h 0.0.0.0 -p 3001
```
