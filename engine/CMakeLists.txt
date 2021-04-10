cmake_minimum_required(VERSION 3.17.2)
project(ErosionEngine
    VERSION 0.1.0
    DESCRIPTION "Erosion physics engine"
    LANGUAGES C CXX)

# project wide c++ standard
set(CMAKE_CXX_STANDARD 17)

# magnum config
set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/modules/" ${CMAKE_MODULE_PATH})

set(WITH_EMSCRIPTENAPPLICATION ON CACHE BOOL "" FORCE)
# set(WITH_SDL2APPLICATION ON CACHE BOOL "" FORCE)
# set(MAGNUM_TARGET_GLES OFF CACHE BOOL "" FORCE)
# set(MAGNUM_TARGET_GLES2 OFF CACHE BOOL "" FORCE)
# set(MAGNUM_TARGET_GLES3 ON CACHE BOOL "" FORCE)
# set(MAGNUM_TARGET_WEBGL OFF CACHE BOOL "" FORCE)

# emscripten config
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MAX_WEBGL_VERSION=2")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MIN_WEBGL_VERSION=2 -s FULL_ES3=1")

# force webgl 2, link with dyncall for taichi.
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MIN_WEBGL_VERSION=2 -s  -s \"DEFAULT_LIBRARY_FUNCS_TO_INCLUDE=['\\$dynCall']\"")

# enable binding for use in react
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1 -s ENVIRONMENT=web -s MODULARIZE=1 --bind")


add_subdirectory(lib)
add_subdirectory(src)
