cmake_minimum_required(VERSION 3.17.2)
project(Engine
    VERSION 0.1.0
    DESCRIPTION "Erosion engine"
    LANGUAGES CXX)

# project wide C++ standard
set(CMAKE_CXX_STANDARD 17)

# emscripten em++ flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1 -s ENVIRONMENT=web -s MODULARIZE=1 --bind")

# main wasm executable composition
add_executable(
    engine
    "engine.cpp"
)
