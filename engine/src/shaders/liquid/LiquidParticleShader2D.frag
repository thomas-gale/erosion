precision highp float;
precision highp int;
precision highp sampler2D;

// fixed settings for liquid shader
#define massScalingFactor 3000.
#define threshold .5
#define backCol vec3(1., 1., 1.)
#define liqInvCol vec3(.8, .5, 0.)

uniform highp sampler2D massGridTexture; // Bound to texture unit 0

in highp vec2 textureCoords;
out highp vec4 fragmentColor;

void main() {
  // Compute mask based on linear interpolation of corner values
  vec2 neighbour = vec2(1. / 32.);

  // sample 4 values about current texture coords (mass grid data stored in red
  // channel)
  mat2 c = mat2(
      texture(massGridTexture, textureCoords).r, // Col 0, Row 0
      texture(massGridTexture, textureCoords + vec2(neighbour.x, 0.))
          .r, // Col 0, Row 1
      texture(massGridTexture, textureCoords + vec2(0., neighbour.y))
          .r, // Col 1, Row 0
      texture(massGridTexture,
              textureCoords + vec2(neighbour.x, neighbour.y)) // Col 1, Row 1
          .r);

  // scale up intensity
  c *= massScalingFactor;

  // interpolated pos
  vec2 interp = fract(vec2(textureCoords.x / neighbour.x, textureCoords.y / neighbour.y));


  // mix values
  vec2 biX = mix(vec2(c[0][0], c[1][0]), vec2(c[0][1], c[1][1]), interp.x);
  float res = mix(biX[0], biX[1], interp.y);


  // fragmentColor = vec4(vec3(res), 1.);

  // threshold 
  if (res > threshold) {
    fragmentColor = vec4(1.);
  } else {
    fragmentColor = vec4(0.);
  }


  // vec2 biY = mix(vec2(c[0][0], c[0][1]), vec2([c[1][0], c[1][1]]), interp.y);



  // float val = mix(bi.)
  // float valx = mix(c[0][0], c[0][1], interp.x);
  // float valy = mix(c[0][0], c[1][1], interp.y);

  // fragmentColor = vec4(vec3(valx*valy), 1.);






  // stuff


  // fragmentColor = vec4(vec3(1.)-vec3(float(code)/15.), 1.);


  // if (interp.x > .4 && interp.x < .6) {
  //   fragmentColor = vec4(1.);
  // } else {
  //   fragmentColor = vec4(0.);
  // }

  // marching squares hacking!

  // get size and step values
  // ivec2 size = textureSize(massGridTexture, 1);
  // vec2 neighbour = vec2(1. / 32.);


  // if (neighbour.x > (1./33.) && neighbour.x < (1./31.)) {
  //   fragmentColor = vec4(1.);
  // } else {
  //   fragmentColor = vec4(0.);
  // }

  // sample 4 values about current texture coords (mass grid data stored in red
  // channel)
  // mat2 c = mat2(
  //     texture(massGridTexture, textureCoords).r, // Col 0, Row 0
  //     texture(massGridTexture, textureCoords + vec2(neighbour.x, 0.))
  //         .r, // Col 0, Row 1
  //     texture(massGridTexture, textureCoords + vec2(0., neighbour.y))
  //         .r, // Col 1, Row 0
  //     texture(massGridTexture,
  //             textureCoords + vec2(neighbour.x, neighbour.y)) // Col 1, Row 1
  //         .r);

  // scale up intensity
  // c *= massScalingFactor;

  // // look up table contour lines
  // int code = 15;
  // if (c[0][0] > threshold)
  //   code -= 8;
  // if (c[1][0] > threshold)
  //   code -= 4;
  // if (c[1][1] > threshold)
  //   code -= 2;
  // if (c[0][1] > threshold)
  //   code -= 1;

  // // print code
  // fragmentColor = vec4(vec3(1.)-vec3(float(code)/15.), 1.);

  // render case (hack)
  // fragmentColor = vec4(0.);
  // switch (code) {
  // case 0: {
  //   fragmentColor.rgb = vec3(1.);
  //   break;
  // }
  // case 15: {
  //   fragmentColor.rgb = vec3(0.);
  //   break;
  // }
  // }

  // compute the liquid colour based on mass of liquid in texture cell
  // fragmentColor = vec4(backCol - texture(massGridTexture, textureCoords).rrr
  // *
  //                                    massScalingFactor * liqInvCol,
  //                      1.);
}
