cmake_minimum_required(VERSION 3.17.2)
project(Engine
    VERSION 0.1.0
    DESCRIPTION "Erosion engine"
    LANGUAGES CXX)

# Project wide C++ standard
set(CMAKE_CXX_STANDARD 17)

add_executable(
    helloworld
    "helloworld.cpp"
)