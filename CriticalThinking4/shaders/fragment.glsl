// Set the precision of floating-point numbers to medium precision
precision highp float;

// Declare a varying variable to hold the color passed from the vertex shader
// This variable will be interpolated across the fragments produced by rasterization
varying vec4 vColor;

// The main function of the fragment shader
void main() {
  // Set the output color of the fragment to the interpolated color passed from the vertex shader
  // This color will be used for rendering the fragment on the screen
  gl_FragColor = vColor;
}
