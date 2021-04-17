find_package(Corrade REQUIRED Main)

find_package(Magnum REQUIRED 
    GL
    Trade
    MeshTools
    TgaImporter
    Primitives
    SceneGraph
    Shaders)

if(CORRADE_TARGET_EMSCRIPTEN)
    find_package(Magnum REQUIRED EmscriptenApplication)
else()
    find_package(Magnum REQUIRED Sdl2Application)
endif()

set_directory_properties(PROPERTIES CORRADE_USE_PEDANTIC_FLAGS ON)

corrade_add_resource(ErosionEngine_RESOURCES resources.conf)

add_subdirectory(taichi)

# TODO, move some of this stuff into separate library targets
add_executable(engine 
shaders/liquid/LiquidParticleShader2D.h shaders/liquid/LiquidParticleShader2D.cpp
shaders/solid/SolidParticleSphereShader2D.h shaders/solid/SolidParticleSphereShader2D.cpp
drawableobjects/liquid/LiquidParticleGroup2D.h drawableobjects/liquid/LiquidParticleGroup2D.cpp
drawableobjects/solid/SolidParticleGroup2D.h drawableobjects/solid/SolidParticleGroup2D.cpp
Engine.cpp
${ErosionEngine_RESOURCES})

target_link_libraries(engine PRIVATE
    Corrade::Main
    Magnum::Application
    Magnum::GL
    Magnum::Magnum
    Magnum::MeshTools
    Magnum::Primitives
    Magnum::SceneGraph
    Magnum::Shaders
    Magnum::Trade
    Magnum::TgaImporter
    taichi)

target_include_directories(engine PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR})

# target_compile_options(engine PRIVATE
#     -g -s "DEFAULT_LIBRARY_FUNCS_TO_INCLUDE=['\\$dynCall']")

# add source map for debugging
if ("${CMAKE_BUILD_TYPE}" STREQUAL "Debug")
    target_link_options(engine PRIVATE
        -g4)
endif()

    # -g4 -s \"DEFAULT_LIBRARY_FUNCS_TO_INCLUDE=['\\$dynCall']\")

# --source-map-base "http://localhost:3000/"

# For Emscripten copy the boilerplate next to the executable so it can be run
# directly from the build dir; provide an install target as well
if(CORRADE_TARGET_EMSCRIPTEN)
    add_custom_command(TARGET engine POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            ${MAGNUM_EMSCRIPTENAPPLICATION_JS}
            ${MAGNUM_WEBAPPLICATION_CSS}
            ${CMAKE_CURRENT_SOURCE_DIR}/engine.html
            $<TARGET_FILE_DIR:engine>)
    # install(TARGETS engine DESTINATION ${MAGNUM_DEPLOY_PREFIX})
    # install(FILES
    #     engine.html
    #     ${MAGNUM_EMSCRIPTENAPPLICATION_JS}
    #     ${MAGNUM_WEBAPPLICATION_CSS}
    #     DESTINATION ${MAGNUM_DEPLOY_PREFIX})
    # install(FILES
    #     $<TARGET_FILE_DIR:engine>/engine.js.mem
    #     $<TARGET_FILE_DIR:engine>/engine.wasm
    #     DESTINATION ${MAGNUM_DEPLOY_PREFIX} OPTIONAL)
endif()
