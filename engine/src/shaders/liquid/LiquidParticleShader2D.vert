uniform highp mat3 viewProjectionMatrix;

layout(location = 0) in highp vec2 backgroundQuad;

// all the mpm point rendering is performed in the fragment shader, simply a
// quad is passed through.
void main() {
  gl_Position = mat4(viewProjectionMatrix) * vec4(backgroundQuad, 0, 1.0);
}
