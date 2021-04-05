cmake_minimum_required(VERSION 3.17.2)
project(Engine
    VERSION 0.1.0
    DESCRIPTION "Erosion engine"
    LANGUAGES CXX)

# Project wide C++ standard
set(CMAKE_CXX_STANDARD 17)

add_executable(
    test
    "test.cpp"
)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -o test.js -s MODULARIZE -s EXPORTED_RUNTIME_METHODS=['ccall']")

message(STATUS "${CMAKE_CXX_FLAGS}")

# target_compile_options(sqrt PUBLIC
#     "-s" "MODULARIZE" "-s" "EXPORTED_RUNTIME_METHODS=[\'ccall\']"
# )