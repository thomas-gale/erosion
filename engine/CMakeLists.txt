cmake_minimum_required(VERSION 3.17.2)
project(ErosionEngine
    VERSION 0.1.0
    DESCRIPTION "Erosion physics engine"
    LANGUAGES C CXX)

# Project wide C++ standard
set(CMAKE_CXX_STANDARD 17)

# Magnum config
set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/modules/" ${CMAKE_MODULE_PATH})
set(WITH_EMSCRIPTENAPPLICATION ON CACHE BOOL "" FORCE)

add_subdirectory(lib)
add_subdirectory(src)
