find_package(Corrade REQUIRED Main)

find_package(Magnum REQUIRED 
    GL
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
shaders/ParticleSphereShader2D.h shaders/ParticleSphereShader2D.cpp
drawableobjects/ParticleGroup2D.h drawableobjects/ParticleGroup2D.cpp
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
    taichi)

target_include_directories(engine PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR})

# For Emscripten copy the boilerplate next to the executable so it can be run
# directly from the build dir; provide an install target as well
if(CORRADE_TARGET_EMSCRIPTEN)
    add_custom_command(TARGET engine POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            ${MAGNUM_EMSCRIPTENAPPLICATION_JS}
            ${MAGNUM_WEBAPPLICATION_CSS}
            ${CMAKE_CURRENT_SOURCE_DIR}/engine.html
            # ${CMAKE_CURRENT_SOURCE_DIR}/shaders/ParticleSphereShader2D.vert
            # ${CMAKE_CURRENT_SOURCE_DIR}/shaders/ParticleSphereShader2D.frag
            ${CMAKE_CURRENT_SOURCE_DIR}/engine.html
            $<TARGET_FILE_DIR:engine>)

    install(TARGETS engine DESTINATION ${MAGNUM_DEPLOY_PREFIX})
    install(FILES
        engine.html
        # shaders/ParticleSphereShader2D.vert
        # shaders/ParticleSphereShader2D.frag
        ${MAGNUM_EMSCRIPTENAPPLICATION_JS}
        ${MAGNUM_WEBAPPLICATION_CSS}
        DESTINATION ${MAGNUM_DEPLOY_PREFIX})
    install(FILES
        $<TARGET_FILE_DIR:engine>/engine.js.mem
        $<TARGET_FILE_DIR:engine>/engine.wasm
        DESTINATION ${MAGNUM_DEPLOY_PREFIX} OPTIONAL)
endif()

# Make the executable a default target to build & run in Visual Studio
set_property(DIRECTORY ${PROJECT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT engine)
