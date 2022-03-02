/**
 * Attribution!
 *
 * SurfaceNets in JavaScript
 *
 * Written by Mikola Lysenko (C) 2012
 *
 * MIT License
 *
 * Based on: S.F. Gibson, "Constrained Elastic Surface Nets". (1998) MERL Tech Report.
 *
 * Adapted to Typescript class by Thomas Gale
 *
 */

import { Mesh } from "./mesh";

export class IsosurfaceMesher {
  private cube_edges: Int32Array;
  private edge_table: Int32Array;
  private buffer: number[];

  constructor() {
    //Precompute edge table, like Paul Bourke does.
    // This saves a bit of time when computing the centroid of each boundary cell
    this.cube_edges = new Int32Array(24);
    this.edge_table = new Int32Array(256);

    //Initialize the cube_edges table
    // This is just the vertex number of each cube
    var k = 0;
    for (var i = 0; i < 8; ++i) {
      for (var j = 1; j <= 4; j <<= 1) {
        var p = i ^ j;
        if (i <= p) {
          this.cube_edges[k++] = i;
          this.cube_edges[k++] = p;
        }
      }
    }

    //Initialize the intersection table.
    //  This is a 2^(cube configuration) ->  2^(edge configuration) map
    //  There is one entry for each possible cube configuration, and the output is a 12-bit vector enumerating all edges crossing the 0-level.
    for (var i = 0; i < 256; ++i) {
      var em = 0;
      for (var j = 0; j < 24; j += 2) {
        var a = !!(i & (1 << this.cube_edges[j])),
          b = !!(i & (1 << this.cube_edges[j + 1]));
        em |= a !== b ? 1 << (j >> 1) : 0;
      }
      this.edge_table[i] = em;
    }

    //Internal buffer, this may get resized at run time
    this.buffer = new Array(4096);
    for (var i = 0; i < this.buffer.length; ++i) {
      this.buffer[i] = 0;
    }
  }

  // Compute the isosurface mesh
  // dim (dimensions/number of samples in the grid)
  // potential (the isosurface function TODO - first value will be the total material density (to determine the surface), remaining values are constituent meta data values to attach to each vertex)
  generate(
    dims: [number, number, number],
    potentialMetadataChannels: number,
    potential: (x: number, y: number, z: number) => number[],
    bounds: [number, number, number][]
  ): Mesh {
    if (!bounds) {
      bounds = [[0, 0, 0], dims];
    }

    var scale = [0, 0, 0];
    var shift = [0, 0, 0];
    for (var i = 0; i < 3; ++i) {
      scale[i] = (bounds[1][i] - bounds[0][i]) / dims[i];
      shift[i] = bounds[0][i];
    }

    var vertices = [],
      verticesMetadata = [],
      faces = [],
      n = 0,
      x = [0, 0, 0],
      R = [1, dims[0] + 1, (dims[0] + 1) * (dims[1] + 1)],
      grid = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      buf_no = 1;

    //Resize buffer if necessary
    if (R[2] * 2 > this.buffer.length) {
      var ol = this.buffer.length;
      this.buffer.length = R[2] * 2;
      while (ol < this.buffer.length) {
        this.buffer[ol++] = 0;
      }
    }

    //March over the voxel grid
    for (
      x[2] = 0;
      x[2] < dims[2] - 1;
      ++x[2], n += dims[0], buf_no ^= 1, R[2] = -R[2]
    ) {
      //m is the pointer into the buffer we are going to use.
      //This is slightly obtuse because javascript does not have good support for packed data structures, so we must use typed arrays :(
      //The contents of the buffer will be the indices of the vertices on the previous x/y slice of the volume
      var m = 1 + (dims[0] + 1) * (1 + buf_no * (dims[1] + 1));

      for (x[1] = 0; x[1] < dims[1] - 1; ++x[1], ++n, m += 2)
        for (x[0] = 0; x[0] < dims[0] - 1; ++x[0], ++n, ++m) {
          //Read in 8 field values around this vertex and store them in an array
          //Also calculate 8-bit mask, like in marching cubes, so we can speed up sign checks later
          var mask = 0,
            g = 0;
          for (var k = 0; k < 2; ++k)
            for (var j = 0; j < 2; ++j)
              for (var i = 0; i < 2; ++i, ++g) {
                var p =
                  -1 *
                  potential(
                    scale[0] * (x[0] + i) + shift[0],
                    scale[1] * (x[1] + j) + shift[1],
                    scale[2] * (x[2] + k) + shift[2]
                  ).reduce((a, b) => a + b);
                grid[g] = p;
                mask |= p < 0 ? 1 << g : 0;
              }

          //Check for early termination if cell does not intersect boundary
          if (mask === 0 || mask === 0xff) {
            continue;
          }

          //Sum up edge intersections
          var edge_mask = this.edge_table[mask],
            v = [0.0, 0.0, 0.0],
            e_count = 0;

          //For every edge of the cube...
          for (var i = 0; i < 12; ++i) {
            //Use edge mask to check if it is crossed
            if (!(edge_mask & (1 << i))) {
              continue;
            }

            //If it did, increment number of edge crossings
            ++e_count;

            //Now find the point of intersection
            var e0 = this.cube_edges[i << 1], //Unpack vertices
              e1 = this.cube_edges[(i << 1) + 1],
              g0 = grid[e0], //Unpack grid values
              g1 = grid[e1],
              t = g0 - g1; //Compute point of intersection
            if (Math.abs(t) > 1e-6) {
              t = g0 / t;
            } else {
              continue;
            }

            //Interpolate vertices and add up intersections (this can be done without multiplying)
            for (var j = 0, k = 1; j < 3; ++j, k <<= 1) {
              var a = e0 & k,
                b = e1 & k;
              if (a !== b) {
                v[j] += a ? 1.0 - t : t;
              } else {
                v[j] += a ? 1.0 : 0;
              }
            }
          }

          //Now we just average the edge intersections and add them to coordinate
          var s = 1.0 / e_count;
          for (var i = 0; i < 3; ++i) {
            v[i] = scale[i] * (x[i] + s * v[i]) + shift[i];
          }

          //Add vertex to buffer, store pointer to vertex index in buffer
          this.buffer[m] = vertices.length;
          vertices.push(v);

          // TEST - create some sample metadata (sin in the x,z plane)
          verticesMetadata.push([Math.sin(v[0]), Math.sin(v[2])]);

          //Now we need to add faces together, to do this we just loop over 3 basis components
          for (var i = 0; i < 3; ++i) {
            //The first three entries of the edge_mask count the crossings along the edge
            if (!(edge_mask & (1 << i))) {
              continue;
            }

            // i = axes we are point along.  iu, iv = orthogonal axes
            var iu = (i + 1) % 3,
              iv = (i + 2) % 3;

            //If we are on a boundary, skip it
            if (x[iu] === 0 || x[iv] === 0) {
              continue;
            }

            //Otherwise, look up adjacent edges in buffer
            var du = R[iu],
              dv = R[iv];

            //Remember to flip orientation depending on the sign of the corner.
            if (mask & 1) {
              faces.push([
                this.buffer[m],
                this.buffer[m - du],
                this.buffer[m - dv],
              ]);
              faces.push([
                this.buffer[m - dv],
                this.buffer[m - du],
                this.buffer[m - du - dv],
              ]);
            } else {
              faces.push([
                this.buffer[m],
                this.buffer[m - dv],
                this.buffer[m - du],
              ]);
              faces.push([
                this.buffer[m - du],
                this.buffer[m - dv],
                this.buffer[m - du - dv],
              ]);
            }
          }
        }
    }

    //All done!  Return the result
    return {
      positions: vertices,
      metadata: verticesMetadata,
      metadataStride: potentialMetadataChannels, // TODO - compute this from the function parameters - related to the potential function?
      cells: faces,
    };
  }
}
