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
set(TARGET_GLES2 OFF CACHE BOOL "" FORCE)
set(WITH_TGAIMPORTER ON CACHE BOOL "" FORCE)

# emscripten flags
# force webgl 2, allow mem growth and link with dyncall for taichi.
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MIN_WEBGL_VERSION=2 -s \"DEFAULT_LIBRARY_FUNCS_TO_INCLUDE=['\\$dynCall']\"")

# enable debugging to source map
#  --source-map-base http://localhost:3001/build
if ("${CMAKE_BUILD_TYPE}" STREQUAL "Debug")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g -s DEMANGLE_SUPPORT=1")
endif()

# enable binding for use in react
if ("${CMAKE_BUILD_TYPE}" STREQUAL "Release")
    # set(WITH_EMBIND ON CACHE BOOL "" FORCE)
    add_definitions(-DWITH_EMBIND)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ENVIRONMENT=web -s MODULARIZE=1 --bind")
endif()

add_subdirectory(lib)
add_subdirectory(src)
