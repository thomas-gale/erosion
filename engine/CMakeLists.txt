cmake_minimum_required(VERSION 3.17.2)
project(ErosionEngine
    VERSION 0.1.0
    DESCRIPTION "Erosion physics engine"
    LANGUAGES C CXX)

# project wide c++ standard
set(CMAKE_CXX_STANDARD 17)

# magnum config
set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/modules/" ${CMAKE_MODULE_PATH})
Set(WITH_EMSCRIPTENAPPLICATION ON CACHE BOOL "" FORCE)

# emscripten config
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MIN_WEBGL_VERSION=2 -s FULL_ES3=1")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MIN_WEBGL_VERSION=2")

add_subdirectory(lib)
add_subdirectory(src)
